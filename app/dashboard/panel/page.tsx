"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { useUserBarbershops } from "@/app/hooks/useUserBarbershops";

export default function DashboardPanelPage() {
  const { user, loading, isUnauthorized, router } = useAuth();
  const { activeBarbershop, barbershops } = useUserBarbershops(user);

  if (loading) {
    return <div className="p-6 text-white">Cargando...</div>;
  }

  console.log("activeBarbershop", activeBarbershop);

  return (
    <div className="text-white">
      {user && (
        <div className="flex border-amber-300 gap-1 space-y-4">
          <div className="border-b border-gray-700">
            <h1 className="text-3xl font-bold">
              {activeBarbershop?.name}
            </h1>
            <p className="text-xs text-gray-300">{activeBarbershop?.address}</p>
          </div>
        </div>
      )}
    </div>
  );
}
