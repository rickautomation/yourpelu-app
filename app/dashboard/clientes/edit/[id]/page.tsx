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

useEffect(() => {
  const fetchClient = async () => {
    const client = await apiGet<BarberClient>(`/barber-clients/client/${id}`);
    setName(client.name);
    setLastname(client.lastname);
    setEmail(client.email ?? "");
    setPhone(client.phone ?? "");
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
    router.push("/dashboard/clientes"); // volver a la lista
  };

  return (
    <div className="p-6 max-w-md mx-auto rounded-lg shadow-md">
      <h1 className="text-white text-2xl font-bold mb-4">Editar Cliente</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-3 py-2 rounded bg-gray-700 text-white"
          placeholder="Nombre"
          required
        />
        <input
          type="text"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          className="px-3 py-2 rounded bg-gray-700 text-white"
          placeholder="Apellido"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-3 py-2 rounded bg-gray-700 text-white"
          placeholder="Email"
        />
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="px-3 py-2 rounded bg-gray-700 text-white"
          placeholder="Teléfono"
        />

        <button
          type="submit"
          className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors font-semibold"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}