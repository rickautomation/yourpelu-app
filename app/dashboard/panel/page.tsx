"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { useUserEstablishment } from "@/app/hooks/useUserEstablishment";

export default function DashboardPanelPage() {
  const { user, loading, isUnauthorized, router } = useAuth();
  const { activeEstablishment } = useUserEstablishment(user)

  if (loading) {
    return <div className="p-6 text-white">Cargando...</div>;
  }

  return (
    <div className="text-white">
      {user && (
        <div className="flex border-amber-300 gap-1 space-y-4">
          <div className="border-b border-gray-700">
            <h1 className="text-3xl font-bold">
              {activeEstablishment?.name}
            </h1>
            <p className="text-xs text-gray-300">{activeEstablishment?.address}</p>
          </div>
        </div>
      )}
    </div>
  );
}
