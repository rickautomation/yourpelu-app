"use client";
import { useMemo, useState } from "react";
import { apiPost } from "@/app/lib/apiPost";
import { useAuth } from "@/app/lib/useAuth";
import { Barbershop } from "@/app/interfaces";
import { apiUpdate } from "@/app/lib/apiUpdate";
import BarbershopForm from "@/app/components/dashboard/BarberShopForm";

export default function EstablishmentPage() {
  const { user, loading, isAuthenticated, refreshUser } = useAuth();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const sessionId = useMemo(() => {
    return typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : String(Date.now());
  }, []);

  if (loading) return <p className="text-white">Cargando...</p>;
  if (!isAuthenticated) return <p className="text-white">No autorizado</p>;

  return (
    <div className="flex items-center justify-center bg-gray-950 text-white text-center p-4">
      <div className="w-full max-w-md rounded-lg shadow-lg pt-0">
        {message && (
          <div className="mb-4 bg-pink-500 text-white text-center py-2 rounded">
            {message}
          </div>
        )}

        {barbershop && !isEditing ? (
          <div className="p-4 bg-gray-800 rounded">
            <h2 className="font-bold text-4xl mb-2">{barbershop.name}</h2>
            <p>📞 {barbershop.phoneNumber}</p>
            <p>📍 {barbershop.address}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors font-semibold"
            >
              Editar
            </button>
          </div>
        ) : (
          user && (
            <BarbershopForm
              barbershop={barbershop}
              userId={user.id}
              onSave={async (data) => {
                if (barbershop) {
                  await apiUpdate<Barbershop>(
                    `/establishment/${barbershop.id}`,
                    data
                  );
                  setIsEditing(false);
                } else {
                  await apiPost<Barbershop>("/establishment", {
                    ...data,
                    userId: user.id,
                    sessionId,
                  });
                  if (typeof refreshUser === "function") {
                    await refreshUser();
                    window.location.href = "/dashboard";
                  }
                  setIsEditing(false);
                }
              }}
            />
          )
        )}
      </div>
    </div>
  );
}