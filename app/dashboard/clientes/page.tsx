"use client";
import { useState } from "react";
import Link from "next/link";
import { useClients } from "@/app/hooks/useClients";

export default function ClientsPage() {
  const { clients, loading, message, addClient, deleteClient } = useClients();

  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const filteredClients = clients.filter((client) =>
    `${client.name} ${client.lastname} ${client.email ?? ""} ${client.phone ?? ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addClient({ name, lastname, email, phone });
    setName("");
    setLastname("");
    setEmail("");
    setPhone("");
    setShowAdd(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  console.log("clients: ", clients.length)

  if (clients.length === 0 ) {
    <div className="flex items-center justify-center h-screen">
      No hay Clientes 
    </div>
  }

  return (
    <div className="flex flex-col gap-3 px-4 py-2">
      {/* Card para agregar cliente */}
      <div className="flex flex-col gap-3">
        {!showAdd && (
          <div className="flex justify-between items-center gap-3 rounded-lg py-2">
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.trim())}
              className="px-2 py-2 rounded bg-gray-800 text-white w-full  max-w-xs focus:outline-none focus:ring-2 focus:ring-pink-600"
            />

            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 justify-center px-2 border border-pink-600 text-pink-600 rounded-md hover:bg-pink-500 transition-colors font-bold"
            >
              <span>nuevo</span>
              <span className="text-4xl">+</span>
            </button>
          </div>
        )}

        {showAdd && (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <h3 className="text-center text-xl font-semibold">Nuevo Cliente</h3>
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.trim())}
                placeholder="Nombre del cliente"
                required
                className="px-3 py-2 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value.trim())}
                placeholder="Apellido del cliente"
                required
                className="px-3 py-2 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                placeholder="Correo electrónico (opcional)"
                className="px-3 py-2 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value.trim())}
                placeholder="Número de contacto (opcional)"
                className="px-3 py-2 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  setShowAdd(false);
                  setName("");
                  setLastname("");
                  setEmail("");
                  setPhone("");
                }}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors font-semibold"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="flex-1 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors font-semibold"
              >
                Guardar
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Lista de clientes (solo si el form está cerrado) */}
      {!showAdd && (
        <>
          {clients.length === 0 && loading ? (
            <p className="text-gray-400">Aun no se agregaron clientes</p>
          ) : (
            <div className="space-y-3">
              {filteredClients.map((client) => {
                return (
                  <div
                    key={client.id}
                    className="flex flex-col px-5 py-4 bg-gray-800 rounded-lg shadow-md"
                  >
                    {/* Nombre centrado */}
                    <div className="flex justify-center items-center mb-2">
                      <p className="text-xl text-white font-bold mr-2">
                        {client.name}
                      </p>
                      <p className="text-xl text-white font-bold">
                        {client.lastname}
                      </p>
                    </div>

                    {/* Email y teléfono más bonitos */}
                    <div className="flex justify-between items-center text-sm text-gray-300 mb-3">
                      {client.email && (
                        <p className="flex items-center gap-1">
                          <span className="font-semibold">📧</span>{" "}
                          {client.email}
                        </p>
                      )}
                      {client.phone && (
                        <p className="flex items-center gap-1">
                          <span className="font-semibold">📞</span>{" "}
                          {client.phone}
                        </p>
                      )}
                    </div>

                    {/* Botones ocupando todo el ancho */}
                    <div className="flex w-full gap-2">
                      <button
                        onClick={() => deleteClient(client.id)}
                        className="flex-1 border border-red-600 text-red-600 px-3 py-2 rounded hover:bg-red-700 transition-colors text-sm font-semibold"
                      >
                        Eliminar
                      </button>

                      <Link
                        href={`/dashboard/clientes/edit/${client.id}`}
                        className="flex-1 text-center border border-blue-600 text-blue-600 px-3 py-2 rounded hover:bg-blue-500 transition-colors text-sm font-semibold"
                      >
                        Editar
                      </Link>

                      <Link
                        href={`/dashboard/clientes/info/${client.id}`}
                        className="flex-1 text-center border-2 border-pink-600 text-pink-600 px-3 py-2 rounded hover:bg-pink-500 transition-colors text-sm font-semibold"
                      >
                        Ver más
                      </Link>
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
