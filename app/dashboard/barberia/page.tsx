"use client";
import { useEffect, useState } from "react";
import { apiPost } from "@/app/lib/apiPost";
import { apiGet } from "@/app/lib/apiGet";
//import { useAuth } from "@/app/lib/useAuth";
import { Barbershop } from "@/app/interfaces";
import { apiUpdate } from "@/app/lib/apiUpdate";
import { useFakeAuth } from "@/app/lib/useFakeAuth";

export default function BarbershopPage() {
  const { user, loading, isAuthenticated } = useFakeAuth();

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
    <div className="flex items-center justify-center bg-gray-950 text-white">
      <div className="w-full max-w-md rounded-lg shadow-lg pt-0">
        {message && (
          <div className="mb-4 bg-pink-500 text-white text-center py-2 rounded">
            {message}
          </div>
        )}

        {barbershop && !isEditing ? (
          // 📌 Vista de barbería existente
          <div className="p-4 bg-gray-800 rounded">
            <h2 className="font-bold text-lg mb-2">{barbershop.name}</h2>
            <p>📞 {barbershop.phoneNumber}</p>
            <p>📍 {barbershop.address}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors font-semibold"
            >
              Editar Barbería
            </button>
          </div>
        ) : (
          // 📌 Formulario de creación/edición
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm mb-1">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre de la barbería"
                required
                className="px-3 py-2 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Contacto</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Número de contacto"
                required
                className="px-3 py-2 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Ubicación</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Dirección o ciudad"
                required
                className="px-3 py-2 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <button
              type="submit"
              className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors font-semibold"
            >
              {barbershop ? "Actualizar Barbería" : "Guardar Barbería"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
