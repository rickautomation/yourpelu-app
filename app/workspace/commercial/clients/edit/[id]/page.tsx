"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet } from "@/app/lib/apiGet";
import { apiUpdate } from "@/app/lib/apiUpdate";

type BarberClient = {
  id: string;
  name: string;
  lastname: string;
  email?: string;
  phone?: string;
  createdAt: string;
};

export default function EditClientPage() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const client = await apiGet<BarberClient>(`/barber-clients/client/${id}`);
        setName(client.name);
        setLastname(client.lastname);
        setEmail(client.email ?? "");
        setPhone(client.phone ?? "");
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiUpdate(`/barber-clients/client/${id}`, {
      name,
      lastname,
      email,
      phone,
    });
    router.push("/dashboard/clientes");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm font-medium">Cargando datos del cliente...</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto animate-fadeIn">
      <div className="p-6 space-y-5">
        <h1 className="text-white text-xl font-bold text-center">Editar Cliente</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium pl-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-700/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
              placeholder="Nombre"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium pl-1">Apellido</label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-700/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
              placeholder="Apellido"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium pl-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-700/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
              placeholder="Email (opcional)"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium pl-1">Teléfono</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-700/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
              placeholder="Teléfono (opcional)"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => router.push("/workspace/commercial/clients")}
              className="flex-1 bg-gray-700/70 hover:bg-gray-700 text-gray-200 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-semibold text-center"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex-1 bg-pink-600 hover:bg-pink-500 text-white px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-semibold shadow-md shadow-pink-600/20 text-center"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}