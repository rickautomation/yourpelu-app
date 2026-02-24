"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useOfferings } from "@/app/hooks/useOfferings";
import { useUserBarbershops } from "@/app/hooks/useUserBarbershops";
import { useAuth } from "@/app/lib/useAuth";

import Link from "next/link";

export default function OfferingPage() {
  const { user } = useAuth();
  const { activeBarbershop } = useUserBarbershops(user);
  const { clientOfferings, updatePrice, deleteOffering } = useOfferings(
    activeBarbershop?.id,
  );

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<string>("");

  const categories = Array.from(
    new Map(
      clientOfferings.map((co) => [
        co.baseType?.category?.id,
        co.baseType?.category,
      ]),
    ).values(),
  ).filter(Boolean);

  const offeringsToShow = selectedCategory
    ? clientOfferings.filter(
        (co) => co.baseType?.category?.id === selectedCategory?.id,
      )
    : clientOfferings;

  return (
    <div className="px-4 py-2">
      <div className="mb-4 relative flex items-center justify-between">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="px-4 py-2 bg-gray-700 text-white rounded flex justify-between items-center text-xl"
        >
          {selectedCategory ? selectedCategory.name : "Todas las categorías"}
          <FiChevronDown
            className={`ml-2 text-xl transition-transform duration-200 ${
              showDropdown ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
        {showDropdown && (
          <ul className="absolute top-full left-0 mt-1 w-full max-h-60 overflow-y-auto bg-gray-800 rounded shadow-lg z-10">
            <li
              onClick={() => {
                setSelectedCategory(null);
                setShowDropdown(false);
              }}
              className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
            >
              Todas las categorías
            </li>
            {categories.map((cat) => (
              <li
                key={cat?.id}
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowDropdown(false);
                }}
                className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
              >
                {cat?.name}
              </li>
            ))}
          </ul>
        )}

        {/* 👇 botón de navegación */}
        <Link
          href="/dashboard/offerings/new"
          className="bg-pink-500 text-white text-xl font-bold px-4 py-2 rounded hover:bg-pink-600 transition-colors"
        >
          +
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {offeringsToShow.map((co) => (
          <div
            key={co.id}
            className="px-6 py-4 bg-gray-700 rounded-lg shadow-md flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{co.name}</p>
                {co.description && (
                  <p className="text-xs text-gray-300">{co.description}</p>
                )}
              </div>

              {editingId === co.id ? (
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-24 px-2 py-1 rounded bg-gray-600 text-white text-lg"
                />
              ) : (
                <p className="text-xl text-pink-400 font-bold">${co.price}</p>
              )}
            </div>

            <div className="flex gap-2 mt-2">
              {editingId === co.id ? (
                <>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setNewPrice("");
                    }}
                    className="flex-1 bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 transition-colors text-sm font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={async () => {
                      await updatePrice(co.id, Number(newPrice));
                      setEditingId(null);
                      setNewPrice("");
                    }}
                    className="flex-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition-colors text-sm font-semibold"
                  >
                    Guardar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditingId(co.id);
                      setNewPrice(String(parseFloat(String(co.price))));
                    }}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-yellow-600 transition-colors text-sm font-semibold"
                  >
                    Editar
                  </button>
                  <button
                    onClick={async () => {
                      await deleteOffering(co.id);
                    }}
                    className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors text-sm font-semibold"
                  >
                    Borrar
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {selectedCategory && offeringsToShow.length === 0 && (
          <div className="px-6 py-4 bg-gray-800 rounded-lg shadow-md text-center">
            <p className="text-blue-400 font-semibold">
              No hay servicios disponibles en esta categoría.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
