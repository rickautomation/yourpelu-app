"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/app/lib/apiGet";
import { BalanceResponse } from "../../types/establishment-finance";


export function useEstablishmentFinance(
  establishmentId?: string,
  from?: string,
  to?: string
) {
  const [balance, setBalance] = useState<BalanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!establishmentId) return;

      try {
        setLoading(true);
        setError(null);

        // Construir Query Params dinámicos
        let query = `/establishment-finances/summary-staff/${establishmentId}`;
        if (from && to) {
          query += `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
        }

        const data = await apiGet<BalanceResponse>(query);
        setBalance(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [establishmentId, from, to]);

  return { balance, loading, error };
}