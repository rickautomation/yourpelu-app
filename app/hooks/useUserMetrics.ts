import { useState, useEffect, useCallback } from 'react';
import { apiGet } from '../lib/apiGet';
import { UserMetricsResponse, UseUserMetricsParams } from '../../types/user-metrics';

interface UseUserMetricsReturn {
  metrics: UserMetricsResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserMetrics = (params: UseUserMetricsParams): UseUserMetricsReturn => {
  const [metrics, setMetrics] = useState<UserMetricsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    if (!params.userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Armamos la query string limpiando valores indefinidos
      const queryParams = new URLSearchParams();
      queryParams.append('userId', params.userId);

      if (params.establishmentId) queryParams.append('establishmentId', params.establishmentId);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);

      // Consumimos tu helper apiGet
      const data = await apiGet<UserMetricsResponse>(`/user-metrics?${queryParams.toString()}`);

      setMetrics(data);
    } catch (err: any) {
      console.error('Error cargando métricas de usuario:', err);
      // apiGet arroja directamente un new Error(msg)
      setError(err.message || 'Ocurrió un error al cargar las métricas del usuario.');
    } finally {
      setLoading(false);
    }
  }, [params.userId, params.establishmentId, params.startDate, params.endDate]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics,
  };
};