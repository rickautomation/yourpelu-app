"use client";
import { useEffect, useState } from "react";
import { apiGet } from "@/app/lib/apiGet";
import { apiPost } from "@/app/lib/apiPost";
import { useAuth } from "@/app/lib/useAuth";
import Link from "next/link";

type BarberClient = {
  id: string;
  name: string;
  lastname: string;
  email?: string;
  phone?: string;
  createdAt: string;
};

export default function ClientsPage() {
  const { user } = useAuth();

  const [clients, setClients] = useState<BarberClient[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await apiGet<BarberClient[]>(
          `/barber-clients/barbershop/${user?.barbershop?.id}`,
        );
        setClients(data);
      } catch (err) {
        console.error("Error cargando clientes", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.barbershop?.id) {
      fetchClients();
    } else {
      setLoading(false);
    }
  }, [user]);

  const filteredClients = clients.filter((client) =>
    `${client.name} ${client.lastname} ${client.email ?? ""} ${client.phone ?? ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const showTempMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiPost(`/barber-clients/barbershop/${user?.barbershop?.id}`, {
        name,
        lastname,
        email,
        phone,
      });

      setName("");
      setLastname("");
      setEmail("");
      setPhone("");
      setShowAdd(false);

      const data = await apiGet<BarberClient[]>(
        `/barber-clients/barbershop/${user?.barbershop?.id}`,
      );
      setClients(data);

      showTempMessage("success", "Cliente creado exitosamente");
    } catch (err) {
      console.error("Error creando cliente", err);
      showTempMessage("error", "Error al crear cliente");
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      {/* Card para agregar cliente */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-2 py-2 rounded bg-gray-700 text-white w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {!showAdd && (
            <button
              onClick={() => setShowAdd(true)}
              className="w-10 h-10 flex items-center justify-center bg-pink-400 text-white rounded-md hover:bg-pink-500 transition-colors text-xl font-bold"
            >
              +
            </button>
          )}
        </div>

        {showAdd && (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm mb-1 text-white">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del cliente"
                required
                className="px-3 py-2 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-white">Apellido</label>
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Apellido del cliente"
                required
                className="px-3 py-2 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-white">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                className="px-3 py-2 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-white">Teléfono</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Número de contacto"
                className="px-3 py-2 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors font-semibold"
              >
                Guardar Cliente
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAdd(false);
                  setName("");
                  setLastname("");
                  setEmail("");
                  setPhone("");
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors font-semibold"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Lista de clientes (solo si el form está cerrado) */}
      {!showAdd && (
        <>
          {loading ? (
            <p className="text-gray-400">Cargando clientes...</p>
          ) : (
            <div className="space-y-3">
              {filteredClients.map((client) => {
                return (
                  <div
                    key={client.id}
                    className="flex flex-col px-5 py-4 bg-gray-700 rounded-lg shadow-md"
                  >
                    <div className="flex gap-1 items-center">
                      <p className="text-xl text-white font-bold">
                        {client.name}
                      </p>
                      <p className="text-xl text-white font-bold">
                        {client.lastname}
                      </p>

                      <Link
                        href={`/dashboard/clientes/info/${client.id}`}
                        className="ml-auto bg-pink-400 text-white px-3 py-1 rounded hover:bg-pink-500 transition-colors text-sm font-semibold"
                      >
                        Ver más
                      </Link>
                    </div>

                    <div className="text-sm text-gray-300">
                      {(client.email || client.phone) && (
                        <ul className="space-y-1">
                          {client.email && <li>{client.email}</li>}
                          {client.phone && <li> {client.phone}</li>}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {message && (
        <p
          className={`text-center ${
            message.type === "success" ? "text-green-500" : "text-red-500"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
