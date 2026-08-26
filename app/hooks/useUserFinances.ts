import { useState, useEffect } from "react";
import { apiGet } from "../lib/apiGet";

export interface UserFinancesResponse {
  userId: string;
  totalOfferings: number;
  deduction: number;
  finalTotal: number;
  commissionRate?: number | null;
}

interface UseUserFinancesOptions {
  userId: string;
  establishmentId: string;
  from?: string;
  to?: string;
}

export function useUserFinances({
  userId,
  establishmentId,
  from,
  to,
}: UseUserFinancesOptions) {
  const [data, setData] = useState<UserFinancesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (from) params.append("from", from);
        if (to) params.append("to", to);

        const url = `/user-finances/${userId}/${establishmentId}?${params.toString()}`;
        const json = await apiGet<UserFinancesResponse>(url);
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (userId && establishmentId) {
      fetchData();
    }
  }, [userId, establishmentId, from, to]);

  return { data, loading, error };
}
