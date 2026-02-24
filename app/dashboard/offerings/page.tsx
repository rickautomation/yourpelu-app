"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/app/lib/apiGet";
import { useAuth } from "@/app/hooks/useAuth";
import { useUserBarbershops } from "@/app/hooks/useUserBarbershops";
import { useServices } from "@/app/hooks/useServices";

type OfferingType = {
  id: string;
  name: string;
  description?: string;
};

type OfferingCategory = {
  id: string;
  name: string;
  description?: string;
  types?: OfferingType[];
};

interface OfferingPageProps {
  render?: string;
  setHasServices?: React.Dispatch<React.SetStateAction<boolean | null>>;
  hasServices?: boolean | null;
}

export default function OfferingPage({
  render,
  hasServices,
  setHasServices,
}: OfferingPageProps) {
  const { user } = useAuth();
  const { activeBarbershop } = useUserBarbershops(user);

  const { globalServices, ownServices, addGlobalService, loading, error } =
    useServices(activeBarbershop?.id);

  const [categories, setCategories] = useState<OfferingCategory[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<OfferingCategory | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catData = await apiGet<OfferingCategory[]>(
          "/offering-categories",
        );
        setCategories(catData);
        // 👇 apenas cargan los datos, seleccionamos la primera categoría
        if (catData.length > 0) {
          setSelectedCategory(catData[0]);
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="px-4 py-2">
      <div className="flex justify-between">
        <div className="mb-4 relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-68 px-4 py-3 bg-gray-700 text-white rounded flex justify-between items-center text-2xl"
          >
            {selectedCategory ? selectedCategory.name : "Cargando..."}
            <span className="ml-2">▼</span>
          </button>
          {/* Dropdown con categorías */}
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
          <button className="bg-pink-400 text-2xl font-bold text-white px-5 py-3 rounded hover:bg-pink-500 transition-colors">
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {selectedCategory?.types?.map((service) => (
          <div
            key={service.id}
            className="px-6 py-4 bg-gray-700 rounded-lg shadow-md flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{service.name}</p>
                {service.description && (
                  <p className="text-xs text-gray-300">{service.description}</p>
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
                      setHasServices?.(true);
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
      </div>
    </div>
  );
}
