"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/app/lib/apiGet";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { useAuth } from "@/app/hooks/useAuth";

type UserBalance = {
  userId: string;
  name: string;
  lastname: string;
  role: string;
  offeringTotal: number;
  adjustedTotal: number;
};

type BalanceResponse = {
  establishmentId: string;
  users: UserBalance[];
  totalEstablishment: number;
};

export default function IncomeStaffPage() {
  const { user } = useAuth();
  const { activeEstablishment } = useEstablishment();
  const [balance, setBalance] = useState<BalanceResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const now = new Date();

        const fromDate = new Date(now.getFullYear(), now.getMonth(), 1)
          .toISOString()
          .split("T")[0];
        const toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
          .toISOString()
          .split("T")[0];

        const data = await apiGet<BalanceResponse>(
          `/balance/summary/${activeEstablishment?.id}?fromDate=${fromDate}&toDate=${toDate}`,
        );
        setBalance(data);
      } catch (err) {
        console.error("Error fetching balance:", err);
      } finally {
        setLoading(false);
      }
    };

    if (activeEstablishment?.id) {
      fetchBalance();
    }
  }, [activeEstablishment?.id]);

  if (loading) return <div>Cargando...</div>;
  if (!balance) return <div>No se pudo obtener la info.</div>;

  return (
    <div className="p-6">
       <div className="flex flex-col gap-2">
        {balance.users.map((u) => (
          <div
            key={u.userId}
            className="flex flex-row items-center gap-6 bg-luminiBrandBlue rounded-md p-4"
          >
            {/* Nombre */}

            {u.userId !== user?.id ? (
              <p
                className={`font-medium w-1/2 ${
                  u.name.length + u.lastname.length < 13 ? "mt-4" : ""
                }`}
              >
                {u.name} {u.lastname}
              </p>
            ) : (
              <p
                className={`font-medium w-1/2 ${
                  "Tu Cuenta".length < 14 ? "mt-4" : ""
                }`}
              >
                Tu Cuenta
              </p>
            )}

            {/* Total */}
            <div className="flex flex-col items-center w-1/4">
              <span className="text-sm text-gray-400">Total</span>
              <span>${u.offeringTotal}</span>
            </div>

            {/* Ajustado */}
            <div className="flex flex-col items-center w-1/4">
              <span className="text-sm text-gray-400">Ajustado</span>
              <span>${u.adjustedTotal}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 bg-luminiBrandBlue rounded-md p-4 text-3xl text-center">
        Total: ${balance.totalEstablishment}
      </p>
    </div>
  );
}
