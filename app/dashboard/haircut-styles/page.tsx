"use client";
import { useEffect, useState } from "react";
import { apiGet } from "@/app/lib/apiGet";
import { apiPost } from "@/app/lib/apiPost";
import { useFakeAuth } from "@/app/lib/useFakeAuth";

type HaircutStyle = {
  id: string;
  name: string;
  description?: string;
};

export default function HaircutStylesPage() {
  const { user, loading, isUnauthorized, router } = useFakeAuth();
  const [styles, setStyles] = useState<HaircutStyle[]>([]);
  const [barbershopId, setBarbershopId] = useState<string>("");
  const [showForm, setShowForm] = useState(false);

  // campos del formulario
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const fetchStyles = async (shopId: string) => {
    try {
      if (shopId) {
        const res = await apiGet<HaircutStyle[]>(`/haircut-styles/barbershop/${shopId}`);
        setStyles(res);
      }
    } catch (err) {
      console.error("Error cargando estilos", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiPost<HaircutStyle>("/haircut-styles", {
        name,
        description,
        barbershopId, // 👈 opcional, si quieres asociar el estilo a la barbería
      });
      setMessage("Estilo creado ✅");
      setName("");
      setDescription("");
      setShowForm(false);
      await fetchStyles(barbershopId);
      setTimeout(() => setMessage(null), 2000);
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "Error al crear estilo ❌");
      setTimeout(() => setMessage(null), 2000);
    }
  };

  useEffect(() => {
    if (user?.rol === "admin" && user?.barbershop?.id) {
      setBarbershopId(user.barbershop.id);
    }
  }, [user]);

  useEffect(() => {
    if (barbershopId) {
      fetchStyles(barbershopId);
    }
  }, [barbershopId]);

  if (loading) return <p>Cargando...</p>;
  if (isUnauthorized) {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex flex-col space-y-2">
      {message && (
        <div className="mb-4 bg-pink-500 text-white text-center py-2 rounded">
          {message}
        </div>
      )}

      {/* Bloque para agregar estilos */}
      {!showForm && (
        <div className="flex items-center px-6 py-4 bg-gray-800 rounded-lg shadow-md">
          <p className="text-xl font-semibold">Agrega tus estilos</p>
          <button
            onClick={() => setShowForm(true)}
            className="ml-auto bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors"
          >
            +
          </button>
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-gray-800 p-4 rounded-lg shadow-md"
        >
          <div>
            <label className="block text-sm mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="px-3 py-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="px-3 py-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors font-semibold"
            >
              Crear Estilo
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors font-semibold"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Lista de estilos */}
      {styles.length === 0 ? (
        <p className="text-gray-400 text-center">No hay estilos aún.</p>
      ) : (
        styles.map((style) => (
          <div
            key={style.id}
            className="flex flex-col px-6 py-4 bg-gray-700 rounded-lg shadow-md"
          >
            <p className="text-xl font-semibold">{style.name}</p>
            <p className="text-gray-300">{style.description || "Sin descripción"}</p>
          </div>
        ))
      )}
    </div>
  );
}