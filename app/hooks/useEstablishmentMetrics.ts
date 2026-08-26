import { useState, useEffect, useCallback } from "react";
import { apiGet } from "../lib/apiGet";

export interface EstablishmentSummary {
  totalOfferings: number;
  totalRevenue: number;
  averageTicket: number;
}

export interface StaffMetric {
  userId: string;
  userName: string;
  servicesCount: number;
  totalRevenue: number;
  averageTicket: number;
}

export interface ServiceMetric {
  serviceId: string;
  serviceName: string;
  count: number;
  totalRevenue: number;
}

export interface CategoryMetric {
  categoryId: string;
  categoryName: string;
  count: number;
  totalRevenue: number;
}

export interface PaymentMethodMetric {
  paymentMethodId: string;
  paymentMethodName: string;
  count: number;
  totalAmount: number;
}

export interface ClientMetric {
  clientId: string;
  clientName: string;
  visitCount: number;
  totalSpent: number;
}

export interface EstablishmentMetricsData {
  summary: EstablishmentSummary;
  staffMetrics: StaffMetric[];
  topServices: ServiceMetric[];
  topCategories: CategoryMetric[];
  paymentMethodsBreakdown: PaymentMethodMetric[];
  topClients: ClientMetric[];
}

interface UseEstablishmentMetricsParams {
  establishmentId?: string;
  startDate?: string;
  endDate?: string;
  enabled?: boolean;
}

export function useEstablishmentMetrics({
  establishmentId,
  startDate,
  endDate,
  enabled = true,
}: UseEstablishmentMetricsParams) {
  const [metrics, setMetrics] = useState<EstablishmentMetricsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    if (!enabled || !establishmentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({ establishmentId });

      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);

      const endpoint = `/establishment-metrics?${queryParams.toString()}`;
      
      const data = await apiGet<EstablishmentMetricsData>(endpoint);
      
      setMetrics(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al consultar métricas.");
      }
    } finally {
      setLoading(false);
    }
  }, [establishmentId, startDate, endDate, enabled]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics,
  };
}