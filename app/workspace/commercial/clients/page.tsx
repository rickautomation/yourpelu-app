"use client";

import { useState } from "react";
import Link from "next/link";
import { useClients } from "@/app/hooks/useClients";
import { FiUserPlus, FiCornerRightDown, FiUser, FiMail, FiPhone, FiSearch } from "react-icons/fi";
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
      .includes(searchTerm.toLowerCase())
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm font-medium">Cargando clientes...</p>
      </div>
    );
  }

  // Empty State
  if (clients.length === 0 && !showAdd) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-[70vh] px-4 text-center animate-fadeIn">
        <p className="text-xl text-gray-200 font-semibold">Aún no hay clientes registrados.</p>
        <p className="text-sm text-gray-400 mt-2 flex items-center gap-1.5">
          Presiona el botón para agregar el primero{" "}
          <FiCornerRightDown className="text-pink-400 text-lg animate-bounce mt-1" />
        </p>

        <button
          onClick={() => setShowAdd(true)}
          className="fixed bottom-20 right-6 p-3 rounded-full bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-600/40 hover:scale-105 active:scale-95 transition-all duration-200 z-10 animate-pulse"
        >
          <FiUserPlus className="text-2xl" />
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-5 animate-slideIn">
      {/* Buscador & Formulario */}
      <div className="w-full">
        {!showAdd && (
          <div className="relative w-full max-w-md mx-auto">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-luminiBrandBlue border border-pink-600/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-md transition-all duration-200"
            />
          </div>
        )}

        {showAdd && (
          <form
            className="p-6 bg-luminiBrandBlue border border-pink-600/30 rounded-2xl shadow-2xl flex flex-col gap-4 max-w-md mx-auto animate-fadeIn"
            onSubmit={handleSubmit}
          >
            <h3 className="text-center text-xl font-bold text-white mb-1">Nuevo Cliente</h3>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del cliente"
              required
              className="px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-700/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
            />

            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Apellido del cliente"
              required
              className="px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-700/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico (opcional)"
              className="px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-700/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
            />

            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Número de contacto (opcional)"
              className="px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-700/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
            />

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
                className="flex-1 bg-gray-700/70 hover:bg-gray-700 text-gray-200 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-semibold"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="flex-1 bg-pink-600 hover:bg-pink-500 text-white px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-semibold shadow-md shadow-pink-600/20"
              >
                Guardar
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Lista de Clientes */}
      {!showAdd && (
        <div className="flex flex-col gap-3">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="p-5 bg-luminiBrandBlue border border-pink-600/30 rounded-2xl shadow-lg flex flex-col gap-3 hover:border-pink-500/50 transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <FiUser className="text-pink-400 text-xl shrink-0" />
                <h4 className="text-lg font-bold text-white">
                  {client.name} {client.lastname}
                </h4>
              </div>

              {(client.email || client.phone) && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-300">
                  {client.email && (
                    <p className="flex items-center gap-1.5">
                      <FiMail className="text-pink-400 shrink-0" /> {client.email}
                    </p>
                  )}
                  {client.phone && (
                    <p className="flex items-center gap-1.5">
                      <FiPhone className="text-pink-400 shrink-0" /> {client.phone}
                    </p>
                  )}
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex gap-2 pt-2 border-t border-gray-700/40">
                <button
                  onClick={() => deleteClient(client.id)}
                  className="flex-1 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 px-3 py-2 rounded-xl transition-all duration-200 text-xs font-semibold text-center"
                >
                  Eliminar
                </button>

                <Link
                  href={`/workspace/commercial/clients/edit/${client.id}`}
                  className="flex-1 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/40 text-cyan-300 px-3 py-2 rounded-xl transition-all duration-200 text-xs font-semibold text-center"
                >
                  Editar
                </Link>

                <Link
                  href={`/dashboard/clientes/info/${client.id}`}
                  className="flex-1 bg-pink-600 hover:bg-pink-500 text-white px-3 py-2 rounded-xl transition-all duration-200 text-xs font-semibold text-center shadow-md shadow-pink-600/20"
                >
                  Ver más
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mensajes de Feedback */}
      {message && (
        <p
          className={`text-center font-medium text-sm ${
            message.type === "success" ? "text-green-400" : "text-rose-400"
          }`}
        >
          {message.text}
        </p>
      )}

      {/* Botón flotante para agregar */}
      {!showAdd && (
        <button
          onClick={() => setShowAdd(true)}
          className="fixed bottom-20 right-6 p-2 rounded-full bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-600/40 hover:scale-105 active:scale-95 transition-all duration-200 z-10"
          aria-label="Agregar cliente"
        >
          <FiUserPlus className="w-8 h-8" />
        </button>
      )}
    </div>
  );
}