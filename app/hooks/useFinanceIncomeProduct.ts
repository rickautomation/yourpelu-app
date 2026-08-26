// @/app/hooks/useFinanceIncomeProduct.ts
import { useState, useEffect } from "react";
import { apiGet } from "@/app/lib/apiGet";

interface FinanceSummary {
  totalIncome: number;
  totalCost: number;
  margin: number;
}

export function useFinanceIncomeProduct(
  establishmentId?: string,
  startDate?: string,
  endDate?: string
) {
  const [data, setData] = useState<FinanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!establishmentId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        const queryString = params.toString() ? `?${params.toString()}` : "";
        
        // Pasamos la interfaz FinanceSummary a apiGet como tipo genérico
        const res = await apiGet<FinanceSummary>(
          `/finance-income-product/${establishmentId}/summary${queryString}`
        );
        
        setData(res);
      } catch (err: any) {
        setError(err.message || "Error al obtener datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [establishmentId, startDate, endDate]);

  return { data, loading, error };
}