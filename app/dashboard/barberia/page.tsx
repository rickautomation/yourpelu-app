"use client";
import { useState } from "react";
import { apiPost } from "@/app/lib/apiPost";
import { useAuth } from "@/app/lib/useAuth";

export default function BarbershopPage() {
  const { user, loading, isAuthenticated } = useAuth();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setMessage("Debes estar autenticado para crear una barbería");
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    try {
      const data = await apiPost("/barbershops", {
        name,
        phoneNumber,
        address,
        userId: user.id, // 👈 se asocia con el usuario autenticado
      });

      console.log("Barbería creada:", data);
      setMessage("Barbería guardada ✅");
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
        <h1 className="text-xl font-bold mb-6 text-center">
          Configuración de Barbería
        </h1>

        {message && (
          <div className="mb-4 bg-pink-500 text-white text-center py-2 rounded">
            {message}
          </div>
        )}

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
            Guardar Barbería
          </button>
        </form>
      </div>
    </div>
  );
}
