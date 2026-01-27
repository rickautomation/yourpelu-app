"use client";

import { useState } from "react";
import { useAuth } from "@/app/lib/useAuth";
import { useServices } from "@/app/hooks/useServices";
import { useUserBarbershops } from "@/app/hooks/useUserBarbershops";

export default function TemplateServicesPage() {
  const { user } = useAuth();
  const { activeBarbershop } = useUserBarbershops(user);

  const { globalServices, ownServices, addGlobalService, loading, error } =
    useServices(activeBarbershop?.id);

  console.log("services", globalServices);

  const [openPriceInput, setOpenPriceInput] = useState<string | null>(null);
  const [price, setPrice] = useState<string>("");

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showTempMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error cargando servicios</p>;

  // Filtrar plantillas que no estén ya en ownServices
  // Filtrar plantillas que no estén ya en ownServices
  const availableTemplates = globalServices.filter(
    (g) => !ownServices.some((o) => o.baseType?.id === g.id),
  );

  return (
    <div className="flex flex-col space-y-4 p-4">
      {availableTemplates.length === 0 && (
        <p className="text-gray-400 italic">
          Todas las plantillas ya fueron utilizadas en tu barbería
        </p>
      )}
      {availableTemplates.map((service) => (
        <div
          key={service.id}
          className="px-6 py-4 bg-gray-700 rounded-lg shadow-md flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">{service.name}</p>
              {service.description && (
                <p className="text-sm text-gray-300">{service.description}</p>
              )}
            </div>
            {openPriceInput !== service.id && (
              <button
                onClick={() =>
                  setOpenPriceInput(
                    openPriceInput === service.id ? null : service.id,
                  )
                }
                className="ml-auto w-28 text-center px-2 py-3 bg-pink-400 text-white rounded hover:bg-pink-500 transition-colors text-lg font-semibold"
              >
                Añadir
              </button>
            )}
          </div>

          {openPriceInput === service.id && (
            <div className="flex flex-col gap-2 bg-gray-800 p-3 rounded-lg">
              <input
                type="number"
                placeholder="Precio"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="px-2 py-1 rounded bg-gray-700 text-white text-lg"
              />
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await addGlobalService(service.id, Number(price));
                    setOpenPriceInput(null);
                    setPrice("");
                    showTempMessage(
                      "success",
                      "Servicio añadido a tu barbería",
                    );
                  }}
                  className="flex-1 bg-pink-400 text-white px-3 py-2 rounded hover:bg-pink-500 transition-colors text-sm font-semibold"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => {
                    setOpenPriceInput(null);
                    setPrice("");
                  }}
                  className="flex-1 bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 transition-colors text-sm font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Mensaje temporal */}
      {message && (
        <p
          className={`text-sm ${
            message.type === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
