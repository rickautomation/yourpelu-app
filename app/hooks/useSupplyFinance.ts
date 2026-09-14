// src/app/hooks/useSupplyFinance.ts
import { useState, useCallback } from 'react';
import { apiGet } from '../lib/apiGet';

export interface SupplyFinanceSummary {
  totalCost: number;
}

export function useSupplyFinance() {
  const [data, setData] = useState<SupplyFinanceSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async (
    establishmentId: string,
    startDate?: string,
    endDate?: string,
  ) => {
    if (!establishmentId) return;
    setLoading(true);
    setError(null);
    try {
      let query = '';
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const queryString = params.toString();
      if (queryString) query = `?${queryString}`;

      const result = await apiGet<SupplyFinanceSummary>(
        `/supply-finance/summary/${establishmentId}${query}`
      );
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos financieros de insumos');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetchSummary,
  };
}