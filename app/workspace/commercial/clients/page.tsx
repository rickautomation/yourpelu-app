"use client";
import { useState } from "react";
import Link from "next/link";
import { useClients } from "@/app/hooks/useClients";
import { FiUserPlus, FiCornerRightDown } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function ClientsPage() {
  const { clients, loading, message, addClient, deleteClient } = useClients();

  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const router = useRouter();

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

  // Si no hay clientes y el formulario de agregar no está activo, mostramos el empty state apuntando al botón flotante
  if (clients.length === 0 && !showAdd) {
    return (
      <div className="relative flex flex-col items-center justify-center h-[140vh] px-4 text-center">
        <p className="text-xl text-gray-300 font-medium">Aún no hay clientes registrados.</p>
        <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
          Presiona el botón para agregar el primero <FiCornerRightDown className="text-pink-500 text-lg animate-bounce mt-1" />
        </p>

        {/* El botón flotante se mantiene visible aquí para que el usuario pueda hacer click directamente */}
        <button
          onClick={() => setShowAdd(true)}
          className="fixed bottom-20 right-6 p-2 rounded-full bg-pink-500 text-white shadow-lg hover:bg-pink-600 transition-colors animate-pulse"
        >
          <FiUserPlus className="text-3xl" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-6 py-2">
      {/* Card para agregar cliente */}
      <div className="flex flex-col gap-3 w-full">
        {!showAdd && (
          <div className="flex justify-center items-center gap-3 rounded-lg py-2">
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-2 py-2 rounded bg-ligthBrandBlue text-white w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-pink-600"
            />
          </div>
        )}

        {showAdd && (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <h3 className="text-center text-xl font-semibold">Nuevo Cliente</h3>
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del cliente"
                required
                className="px-3 py-2 rounded bg-exposeBrandBlue text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Apellido del cliente"
                required
                className="px-3 py-2 rounded bg-exposeBrandBlue text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico (opcional)"
                className="px-3 py-2 rounded bg-exposeBrandBlue text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Número de contacto (opcional)"
                className="px-3 py-2 rounded bg-exposeBrandBlue text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
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
                className="flex-1 bg-ligthBrandBlue text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors font-semibold"
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
        <div className="space-y-3 px-1">
          {filteredClients.map((client) => {
            return (
              <div
                key={client.id}
                className="flex flex-col px-5 py-4 bg-exposeBrandBlue rounded-lg shadow-md"
              >
                <div className="flex justify-center items-center mb-2">
                  <p className="text-xl text-white font-bold mr-2">
                    {client.name}
                  </p>
                  <p className="text-xl text-white font-bold">
                    {client.lastname}
                  </p>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-300 mb-3">
                  {client.email && (
                    <p className="flex items-center gap-1">
                      <span className="font-semibold">📧</span> {client.email}
                    </p>
                  )}
                  {client.phone && (
                    <p className="flex items-center gap-1">
                      <span className="font-semibold">📞</span> {client.phone}
                    </p>
                  )}
                </div>

                {/* Botones ocupando todo el ancho */}
                <div className="flex w-full gap-2">
                  <button
                    onClick={() => deleteClient(client.id)}
                    className="flex-1 bg-rose-700 px-3 py-2 rounded hover:bg-red-700 transition-colors text-sm font-semibold"
                  >
                    Eliminar
                  </button>

                  <Link
                    href={`/dashboard/clientes/edit/${client.id}`}
                    className="flex-1 text-center bg-blue-600 px-3 py-2 rounded hover:bg-blue-500 transition-colors text-sm font-semibold"
                  >
                    Editar
                  </Link>

                  <Link
                    href={`/dashboard/clientes/info/${client.id}`}
                    className="flex-1 text-center bg-pink-500 px-3 py-2 rounded hover:bg-pink-500 transition-colors text-sm font-semibold"
                  >
                    Ver más
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
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

      {/* Botón flotante: Oculto cuando showAdd es true */}
      {!showAdd && (
        <button
          onClick={() => setShowAdd(true)}
          className="fixed bottom-20 right-6 p-2 rounded-full bg-pink-500 text-white shadow-lg hover:bg-pink-600 transition-colors"
        >
          <FiUserPlus className="text-3xl" />
        </button>
      )}
    </div>
  );
}