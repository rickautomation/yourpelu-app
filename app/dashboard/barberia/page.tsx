"use client";
import { useEffect, useState } from "react";
import { apiPost } from "@/app/lib/apiPost";
import { apiGet } from "@/app/lib/apiGet";
import { useAuth } from "@/app/lib/useAuth";
import { Barbershop } from "@/app/interfaces";
import { apiUpdate } from "@/app/lib/apiUpdate";
//import { useFakeAuth } from "@/app/lib/useFakeAuth";
import BarbershopForm from "@/app/components/dashboard/BarberShopForm";

export default function BarbershopPage() {
  const { user, loading, isAuthenticated } = useAuth();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // 🔄 función para traer barbería
  const fetchBarbershop = async () => {
    if (user) {
      try {
        const data = await apiGet<Barbershop>(`/barbershops/user/${user.id}`);
        setBarbershop(data);
        setName(data.name || "");
        setPhoneNumber(data.phoneNumber || "");
        setAddress(data.address || "");
      } catch (err: any) {
        console.error(err);
        setBarbershop(null);
        setMessage("No se encontró barbería asociada ❌");
        setTimeout(() => setMessage(null), 2000);
      }
    }
  };

  useEffect(() => {
    fetchBarbershop();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setMessage("Debes estar autenticado para crear/editar una barbería");
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    try {
      if (barbershop) {
        await apiUpdate<Barbershop>(`/barbershops/${barbershop.id}`, {
          name,
          phoneNumber,
          address,
        });
      } else {
        await apiPost<Barbershop>("/barbershops", {
          name,
          phoneNumber,
          address,
          userId: user.id,
        });

        // 🔄 refrescar barbería
        await fetchBarbershop();

        // 👇 refrescar sesión para que useAuth traiga el rol actualizado
        window.location.reload();
      }

      setMessage("Barbería guardada ✅");
      setIsEditing(false);
      setTimeout(() => setMessage(null), 2000);
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "Error al guardar barbería ❌");
      setTimeout(() => setMessage(null), 2000);
    }
  };

  if (loading) return <p className="text-white">Cargando...</p>;
  if (!isAuthenticated) return <p className="text-white">No autorizado</p>;

  return (
    <div className="flex items-center justify-center bg-gray-950 text-white text-center ">
      <div className="w-full max-w-md rounded-lg shadow-lg pt-0">
        {message && (
          <div className="mb-4 bg-pink-500 text-white text-center py-2 rounded">
            {message}
          </div>
        )}

        {barbershop && !isEditing ? (
          // 📌 Vista de barbería existente
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
          // 📌 Formulario de creación/edición
          user && (
            <BarbershopForm
              barbershop={barbershop}
              userId={user.id}
              onSave={async (data) => {
                if (barbershop) {
                  await apiUpdate<Barbershop>(
                    `/barbershops/${barbershop.id}`,
                    data
                  );
                  // 👇 cerrar el form
                  setIsEditing(false);
                  await fetchBarbershop();
                } else {
                  await apiPost<Barbershop>("/barbershops", {
                    ...data,
                    userId: user.id,
                  });
                  await fetchBarbershop();
                  window.location.reload();
                  // 👇 cerrar el form
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
