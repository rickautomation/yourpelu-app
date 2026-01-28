"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/lib/useAuth";
import { useServices } from "@/app/hooks/useServices";
import { useUserBarbershops } from "@/app/hooks/useUserBarbershops";
import { useRouter } from "next/navigation";

interface ServicesPageProps {
  render?: string;
  onServicesChange?: (count: number) => void;
}

export default function ServicesPage({
  render,
  onServicesChange,
}: ServicesPageProps) {
  const { user, refreshUser } = useAuth();
  const { activeBarbershop } = useUserBarbershops(user);
  const router = useRouter();

  const {
    ownServices,
    loading,
    error,
    addOwnService,
    updateService,
    deleteService,
  } = useServices(activeBarbershop?.id);

  const [showMenu, setShowMenu] = useState(false);
  const [showOwnPopup, setShowOwnPopup] = useState(false);

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState<number>(0);

  const [openPriceInput, setOpenPriceInput] = useState<string | null>(null);
  const [price, setPrice] = useState<string>("");

  // Estado para el select de categorías
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [category, setCategory] = useState("todos");

  // Estado para el popup de acciones del botón +
  const [showPopup, setShowPopup] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    refreshUser?.();
  }, []);

  useEffect(() => {
    onServicesChange?.(ownServices.length);
  }, [ownServices, onServicesChange]);

  const showTempMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error cargando servicios</p>;

  return (
    <div
      className={`flex flex-col space-y-4 ${render === "true" ? "p-0" : "p-4"}`}
    >
      {/* Botón + para admins */}
      {user?.rol === "admin" && (
        <div className="">
          <div className="px-4 py-4 bg-gray-900 rounded-lg shadow-md flex items-center gap-2 relative">
            {/* Botón que abre el dropdown */}
            <div className="relative w-64">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="bg-gray-700 text-white px-4 py-2 rounded w-full flex justify-between items-center font-semibold"
              >
                <span>
                  {category === "todos"
                    ? "Todos los servicios"
                    : category === "cortes"
                      ? "Cortes"
                      : "Coloraciones"}
                </span>
                <svg
                  className={`w-4 h-4 ml-2 transition-transform ${
                    showCategoryDropdown ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown personalizado */}
              {showCategoryDropdown && (
                <ul className="absolute top-full left-0 mt-1 w-full max-h-40 overflow-y-auto bg-gray-800 rounded shadow-lg z-10">
                  <li
                    onClick={() => {
                      setCategory("todos");
                      setShowCategoryDropdown(false);
                    }}
                    className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                  >
                    Todos los servicios
                  </li>
                  <li
                    onClick={() => {
                      setCategory("cortes");
                      setShowCategoryDropdown(false);
                    }}
                    className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                  >
                    Cortes
                  </li>
                  <li
                    onClick={() => {
                      setCategory("coloraciones");
                      setShowCategoryDropdown(false);
                    }}
                    className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                  >
                    Coloraciones
                  </li>
                </ul>
              )}
            </div>

            {/* Botón + */}
            <button
              onClick={() => setShowPopup(!showPopup)}
              className="ml-auto bg-pink-400 text-2xl font-bold text-white px-3 py-1 rounded hover:bg-pink-500 transition-colors"
            >
              +
            </button>
          </div>

          {/* Popup de creación */}
          {showPopup && (
            <div
              className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 px-2"
              onClick={() => setShowPopup(false)}
            >
              <div
                className="bg-gray-800 rounded-lg p-6 max-w-sm w-full text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-semibold mb-3">
                    Elige cómo crear el servicio
                  </p>
                  <button
                    onClick={() => {
                      router.push("/dashboard/servicios/new");
                      setShowPopup(false);
                    }}
                    className="w-full bg-pink-500 text-white px-3 py-2 rounded hover:bg-gray-700 transition-colors"
                  >
                    Crear desde plantilla
                  </button>
                  <button
                    onClick={() => {
                      setShowOwnPopup(true);
                      setShowPopup(false);
                    }}
                    className="w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-pink-500 transition-colors"
                  >
                    Crear desde cero
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Popup para crear servicio propio */}
      {showOwnPopup && (
        <div
          className="fixed inset-0 backdrop-blur-sm  flex items-center justify-center z-50 px-6"
          onClick={() => setShowOwnPopup(false)}
        >
          <div
            className="bg-gray-800 rounded-lg p-6 max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-pink-400 mb-4">
              Nuevo servicio
            </h3>
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
                setShowOwnPopup(false);
                showTempMessage(
                  "success",
                  "Servicio propio creado exitosamente",
                );
              }}
              className="flex flex-col gap-2"
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
              <div className="flex gap-2 mt-3">
                <button
                  type="submit"
                  className="flex-1 bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors font-semibold"
                >
                  Crear
                </button>
                <button
                  type="button"
                  onClick={() => setShowOwnPopup(false)}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de servicios propios */}
      {ownServices.map((service) => (
        <div
          key={service.id}
          className="px-6 py-4 bg-gray-800 rounded-lg shadow-md flex flex-col gap-2"
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
                    onChange={(e) => setPrice(e.target.value)}
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
                        setPrice(service.price?.toString() ?? "");
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
