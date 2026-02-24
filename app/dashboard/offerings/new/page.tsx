"use client";

import { useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { useUserBarbershops } from "@/app/hooks/useUserBarbershops";

import { FiChevronDown } from "react-icons/fi";
import { FiCheckCircle } from "react-icons/fi";

import { useOfferings } from "@/app/hooks/useOfferings";

interface OfferingPageProps {
  render?: string;
  setHasServices?: React.Dispatch<React.SetStateAction<boolean | null>>;
  hasServices?: boolean | null;
}

export default function NewOfferingPage({ setHasServices }: OfferingPageProps) {
  const { user } = useAuth();
  const { activeBarbershop } = useUserBarbershops(user);
  const { addOffering, clientOfferings } = useOfferings(activeBarbershop?.id);

  // 👇 usamos el hook en vez de duplicar lógica
  const { categories, selectedCategory, setSelectedCategory } = useOfferings(
    activeBarbershop?.id,
  );

  const [showDropdown, setShowDropdown] = useState(false);
  const [openPriceInput, setOpenPriceInput] = useState<string | null>(null);
  const [price, setPrice] = useState<string>("");
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showTempMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  console.log("client offerings: ", clientOfferings);

  return (
    <div className="px-4 py-2">
      <div className="flex justify-between">
        <div className="mb-4 relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="px-4 py-2 bg-gray-700 text-white rounded flex justify-between items-center text-xl"
          >
            {selectedCategory ? selectedCategory.name : "Cargando..."}
            <FiChevronDown
              className={`ml-2 text-xl transition-transform duration-200 ${
                showDropdown ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
          {showDropdown && (
            <ul className="absolute top-full left-0 mt-1 w-full max-h-60 overflow-y-auto bg-gray-800 rounded shadow-lg z-10">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowDropdown(false);
                  }}
                  className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <button className="bg-pink-400 text-xl font-bold text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors">
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {selectedCategory?.types
          ?.filter((service) => {
            // 👇 si está en recentlyAdded, no lo filtramos
            if (recentlyAdded === service.id) return true;
            // caso normal: ocultar si ya existe en clientOfferings
            return !clientOfferings.some(
              (co) => co.baseType?.id === service.id,
            );
          })
          .map((service) =>
            recentlyAdded === service.id ? (
              <div
                key={service.id}
                className="px-6 py-4 bg-green-700 rounded-lg shadow-md flex items-center gap-2"
              >
                <FiCheckCircle className="text-white text-2xl" />
                <p className="text-white font-semibold">Servicio agregado</p>
              </div>
            ) : (
              <div
                key={service.id}
                className="px-6 py-4 bg-gray-700 rounded-lg shadow-md flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">{service.name}</p>
                    {service.description && (
                      <p className="text-xs text-gray-300">
                        {service.description}
                      </p>
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
                          await addOffering({
                            baseTypeId: service.id,
                            name: service.name,
                            description: service.description,
                            price: Number(price),
                          });
                          setOpenPriceInput(null);
                          setPrice("");
                          setHasServices?.(true);
                          setRecentlyAdded(service.id);
                          setTimeout(() => setRecentlyAdded(null), 2000);
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
            ),
          )}

        {/* 👇 mensaje cuando no quedan plantillas disponibles */}
        {selectedCategory?.types?.filter((service) => {
          if (recentlyAdded === service.id) return true;
          return !clientOfferings.some((co) => co.baseType?.id === service.id);
        }).length === 0 && (
          <div className="px-6 py-4 bg-gray-800 rounded-lg shadow-md text-center">
            <p className="text-blue-600 font-semibold">
              No quedan servicios de plantilla disponibles para agregar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
