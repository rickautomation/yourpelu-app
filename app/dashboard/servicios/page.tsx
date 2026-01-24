"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/lib/useAuth";
import { useServices } from "@/app/hooks/useServices";
import { useUserBarbershops } from "@/app/hooks/useUserBarbershops";

interface ServicesPageProps {
  render?: string;
  onServicesChange?: (count: number) => void; // 👈 nueva prop
}

export default function ServicesPage({
  render,
  onServicesChange,
}: ServicesPageProps) {
  const { user } = useAuth();
  const { activeBarbershop } = useUserBarbershops(user);

  const {
    globalServices,
    ownServices,
    loading,
    error,
    addOwnService,
    addGlobalService,
    updateService,
    deleteService,
  } = useServices(activeBarbershop?.id);

  const [showForm, setShowForm] = useState<"own" | "template" | null>(null);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState<number>(0);

  const [openPriceInput, setOpenPriceInput] = useState<string | null>(null);
  const [price, setPrice] = useState<string>("");

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    onServicesChange?.(ownServices.length);
  }, [ownServices, onServicesChange]);

  const showTempMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error cargando servicios</p>;

  const availableTemplates = globalServices.filter(
    (g) => !ownServices.some((o) => o.baseType?.id === g.id || o.id === g.id),
  );

  return (
    <div
      className={`flex flex-col space-y-4 ${render === "true" ? "p-0" : "p-4"}`}
    >
      {user?.rol === "admin" && showForm === null ? (
        <div className="px-6 py-4 bg-gray-800 rounded-lg shadow-md flex justify-between items-center">
          <p className="text-lg font-semibold text-white">Agregar servicio</p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowForm("own")}
              className="px-4 py-2 bg-pink-400 text-white rounded hover:bg-pink-500 transition-colors text-sm font-semibold"
            >
              Crear propio
            </button>
            <button
              onClick={() => setShowForm("template")}
              className="px-4 py-2 bg-pink-400 text-white rounded hover:bg-pink-500 transition-colors text-sm font-semibold"
            >
              Usar plantilla
            </button>
          </div>
        </div>
      ) : showForm === "own" ? (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await addOwnService({
              name: newName,
              description: newDescription,
              price: newPrice,
            });
            setNewName("");
            setNewDescription("");
            setNewPrice(0);
            setShowForm(null);
            showTempMessage("success", "Servicio propio creado exitosamente");
          }}
        >
          <input
            type="text"
            placeholder="Nombre del servicio"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="px-3 py-2 rounded bg-gray-700 text-white"
            required
          />
          <textarea
            placeholder="Descripción"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="px-3 py-2 rounded bg-gray-700 text-white"
          />
          <input
            type="number"
            placeholder="Precio"
            value={newPrice}
            onChange={(e) => setNewPrice(Number(e.target.value))}
            className="px-3 py-2 rounded bg-gray-700 text-white"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors font-semibold"
            >
              Crear
            </button>
            <button
              type="button"
              onClick={() => setShowForm(null)}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors font-semibold"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : user?.rol === "admin" && showForm === "template" ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-300">
            Selecciona un servicio global para añadirlo abajo.
          </p>
          <button
            onClick={() => setShowForm(null)}
            className="self-start bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors text-sm font-semibold"
          >
            Cancelar selección de plantilla
          </button>
        </div>
      ) : null}

      {/* Lista de servicios propios */}
      {ownServices.map((service) => (
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
            <div className="flex flex-col items-end">
              {openPriceInput === service.id ? (
                <>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)} // siempre string
                    className="w-24 px-2 py-1 rounded text-black"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={async () => {
                        await updateService(service.id, {
                          price: Number(price),
                        });
                        setOpenPriceInput(null);
                      }}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500 text-sm font-semibold"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setOpenPriceInput(null)}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-400 text-sm font-semibold"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-xl text-pink-300 font-semibold">
                    $ {service.price}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setOpenPriceInput(service.id);
                        setPrice(service.price?.toString() ?? ""); // inicializar como string
                      }}
                      className="bg-blue-600 text-white px-2 py-2 rounded hover:bg-blue-500 transition-colors text-sm font-semibold"
                    >
                      Editar
                    </button>
                    <button
                      onClick={async () => {
                        await deleteService(service.id);
                        showTempMessage(
                          "success",
                          "Servicio eliminado exitosamente",
                        );
                      }}
                      className="bg-pink-700 text-white px-2 py-2 rounded hover:bg-red-600 transition-colors text-sm font-semibold"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Lista de plantillas disponibles */}
      {showForm === "template" &&
        availableTemplates.map((service) => (
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

      {/* 👇 Mensaje temporal */}
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
