"use client";
import { useEffect, useState } from "react";
import { apiGet } from "@/app/lib/apiGet";
import { apiPost } from "@/app/lib/apiPost";
import { useAuth } from "@/app/lib/useAuth";

type HaircutType = {
  id: string;
  name: string;
  description?: string;
  price?: number;
  baseType?: { id: string }; // 👈 agregar esta propiedad opcional
};

export default function ServicesPage() {
  const [globalServices, setGlobalServices] = useState<HaircutType[]>([]);
  const [ownServices, setOwnServices] = useState<HaircutType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [showForm, setShowForm] = useState<"own" | "template" | null>(null);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState<number>(0);

  const [openPriceInput, setOpenPriceInput] = useState<string | null>(null);
  const [price, setPrice] = useState<string>("");

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const global = await apiGet<HaircutType[]>("/haircut-types");
        const own = await apiGet<HaircutType[]>(
          `/client-haircut-types/barbershop/${user?.barbershop?.id}`
        );
        setGlobalServices(global);
        setOwnServices(own);
      } catch (err) {
        console.error("Error cargando servicios", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.barbershop?.id) fetchServices();
  }, [user]);

  const showTempMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddOwnService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiPost(`/client-haircut-types/barbershop/${user?.barbershop?.id}`, {
        name: newName,
        description: newDescription,
        price: newPrice,
      });
      setNewName("");
      setNewDescription("");
      setNewPrice(0);
      setShowForm(null);

      const own = await apiGet<HaircutType[]>(
        `/client-haircut-types/barbershop/${user?.barbershop?.id}`
      );
      setOwnServices(own);
      showTempMessage("success", "Servicio propio creado exitosamente");
    } catch (err) {
      console.error("Error creando servicio propio", err);
      showTempMessage("error", "Error al crear servicio propio");
    }
  };

  const handleConfirmAddGlobal = async (serviceId: string) => {
    try {
      await apiPost(
        `/client-haircut-types/barbershop/${user?.barbershop?.id}/add/${serviceId}`,
        { price: Number(price) }
      );
      const own = await apiGet<HaircutType[]>(
        `/client-haircut-types/barbershop/${user?.barbershop?.id}`
      );
      setOwnServices(own);
      setOpenPriceInput(null);
      setPrice("");
      showTempMessage("success", "Servicio añadido a tu barbería");
    } catch (err) {
      console.error("Error añadiendo servicio global", err);
      showTempMessage("error", "Error al añadir servicio");
    }
  };

  if (loading) return <p>Cargando...</p>;

  // 👇 filtrar globales que ya están en propios
  const availableTemplates = globalServices.filter(
    (g) => !ownServices.some((o) => o.baseType?.id === g.id || o.id === g.id)
  );

  return (
    <div className="flex flex-col space-y-4">
      {/* Card para agregar servicio propio */}
      {showForm === null ? (
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
          onSubmit={handleAddOwnService}
          className="flex flex-col gap-2 bg-gray-800 p-4 rounded-lg shadow-md"
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
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-300">Selecciona un servicio global para añadirlo abajo.</p>
          <button
            onClick={() => setShowForm(null)}
            className="self-start bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors text-sm font-semibold"
          >
            Cancelar selección de plantilla
          </button>
        </div>
      )}

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
            {service.price && (
              <p className="text-xl text-pink-300 font-semibold">${service.price}</p>
            )}
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
                    setOpenPriceInput(openPriceInput === service.id ? null : service.id)
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
                    onClick={() => handleConfirmAddGlobal(service.id)}
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
                 