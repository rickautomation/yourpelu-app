"use client";

import { useState } from "react";
import { BsToggle2On, BsToggle2Off, BsCash } from "react-icons/bs";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { SiMercadopago } from "react-icons/si";
import { AiOutlineRight } from "react-icons/ai";
import { useRouter } from "next/navigation";

export default function AddRegisterPage() {
  const { activeEstablishment, settings } = useEstablishment();
  const router = useRouter();

  // Estado local inicial desde settings
  const [clientsInOfferings, setClientsInOfferings] = useState(
    settings?.clients_in_offerings ?? false,
  );
  const [editing, setEditing] = useState(false); // controla si el toggle está habilitado
  const [tempValue, setTempValue] = useState(clientsInOfferings); // valor temporal mientras editás

  console.log("settings: ", settings);

  // Guardar cambios en API
  const handleSave = async () => {
    try {
      const res = await fetch(
        `/api/establishments/${activeEstablishment?.id}/settings`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clients_in_offerings: tempValue }),
        },
      );
      if (!res.ok) throw new Error("Error al actualizar settings");
      console.log("Actualizado en backend:", tempValue);
      setClientsInOfferings(tempValue);
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Cancelar edición
  const handleCancel = () => {
    setTempValue(clientsInOfferings); // vuelve al valor original
    setEditing(false);
  };

  return (
    <div className="min-h-screen text-white p-6 space-y-4">
      {/* Header */}
      <header className="border-b border-gray-700 pb-4 text-xl">
        <p>{"Settings > Register"}</p>
      </header>

      {/* Sección: Incluir clientes */}
      <section className="bg-exposeBrandBlue rounded-lg p-4 shadow-md">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Incluir clientes</h3>

          {/* Toggle siempre visible */}
          <button
            disabled={!editing}
            onClick={() => setTempValue(!tempValue)}
            className={`flex items-center gap-2 px-4 py-2 rounded text-2xl ${
              !editing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {tempValue ? (
              <>
                <BsToggle2On className="text-green-600 text-4xl" />
                <span>SI</span>
              </>
            ) : (
              <>
                <BsToggle2Off className="text-gray-500 text-4xl" />
                <span>NO</span>
              </>
            )}
          </button>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-center gap-4 mt-3">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-pink-500 hover:bg-yellow-700 px-4 py-2 rounded"
            >
              Cambiar
            </button>
          ) : (
            <div className="flex gap-4 mt-4 w-full">
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded"
              >
                Guardar
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Sección: Métodos de pago */}
      <section className="bg-exposeBrandBlue rounded-lg p-4 shadow-md">
        <h3 className="text-xl font-semibold mb-2">Métodos de pago</h3>
        <div className="px-2 text-center">
          <ul className="space-y-1 text-gray-300">
            <div className="flex items-center gap-3 text-xl">
              <BsCash className="text-green-500" />
              <li> Efectivo</li>
            </div>
            <div className="flex items-center gap-3 text-xl">
              <SiMercadopago className="text-blue-500 bg-white" />
              <li>MercadoPago</li>
            </div>
          </ul>
          <button className="mt-3 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
            Agregar
          </button>
        </div>
      </section>

      {/* Sección: Cambiar vista */}
      <section
        onClick={() => router.push(`/dashboard/settings/add-register/views`)}
        className="flex items-center justify-between bg-exposeBrandBlue rounded-lg p-4 shadow-md"
      >
        <h3 className="text-xl font-semibold mb-2">Cambiar vista</h3>
        <div className="p-1 bg-ligthBrandBlue rounded-full">
          <AiOutlineRight />
        </div>
      </section>
    </div>
  );
}
