"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useOfferings } from "@/app/hooks/useOfferings";
import { useAuth } from "@/app/lib/useAuth";

import Link from "next/link";
import { useUserEstablishment } from "@/app/hooks/useUserEstablishment";
import { IoAddSharp } from "react-icons/io5";

export default function OfferingPage() {
  const { user } = useAuth();
  const { activeEstablishment } = useUserEstablishment(user);
  const { clientOfferings, updatePrice, deleteOffering, loading } =
    useOfferings(activeEstablishment?.id);

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<string>("");

  const [showErrorPopup, setShowErrorPopup] = useState(false);

  // Construimos lista de categorías únicas
  const categories = Array.from(
    new Map(
      clientOfferings.map((co) => {
        // si tiene baseType, usamos esa categoría
        if (co.baseType?.category) {
          return [co.baseType.category.id, co.baseType.category];
        }
        // si no, usamos globalCategory
        if (co.globalCategory) {
          return [co.globalCategory.id, co.globalCategory];
        }
        // si no, usamos clientCategory
        if (co.clientCategory) {
          return [co.clientCategory.id, co.clientCategory];
        }
        return [null, null];
      }),
    ).values(),
  ).filter(Boolean);

  const offeringsToShow = selectedCategory
    ? clientOfferings.filter((co) => {
        const categoryId =
          co.baseType?.category?.id ||
          co.globalCategory?.id ||
          co.clientCategory?.id;
        return categoryId === selectedCategory?.id;
      })
    : clientOfferings;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-2">
      <div className="mb-4 relative flex items-center justify-between">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="px-4 py-2 bg-ligthBrandBlue text-white rounded flex justify-between items-center text-xl"
        >
          {selectedCategory ? selectedCategory.name : "Todas las categorías"}
          <FiChevronDown
            className={`ml-2 text-xl transition-transform duration-200 ${
              showDropdown ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
        {showDropdown && (
          <ul className="absolute top-full left-0 mt-1 w-full max-h-100 overflow-y-auto bg-luminiBrandBlue rounded shadow-lg shadow-black z-10">
            <li
              onClick={() => {
                setSelectedCategory(null);
                setShowDropdown(false);
              }}
              className="px-3 py-4 text-white hover:bg-gray-600 cursor-pointer border border-t border-gray-700"
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
                className="px-3 py-4 text-white hover:bg-gray-600 cursor-pointer border border-t border-gray-700"
              >
                {cat?.name}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={() => setShowModal(true)}
          className="bg-pink-500 text-white text-xl font-bold px-4 py-2 rounded hover:bg-pink-600 transition-colors"
        >
          +
        </button>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-opacity-50 backdrop-blur-lg flex items-center justify-center z-20 p-4"
          onClick={() => setShowModal(false)} // 👈 cierra al hacer click fuera
        >
          <div
            className="bg-darkBrandBlue p-6 rounded-lg shadow-lg shadow-black w-96"
            onClick={(e) => e.stopPropagation()} // 👈 evita que se cierre al hacer click dentro
          >
            <div className="flex flex-col gap-3">
              <Link
                href="/dashboard/offerings/new/from-template"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-center"
                onClick={() => setShowModal(false)}
              >
                Crear desde plantilla
              </Link>
              <Link
                href="/dashboard/offerings/new/from-custom"
                className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-center"
                onClick={() => setShowModal(false)}
              >
                Crear desde cero
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {offeringsToShow.map((co) => (
          <div
            key={co.id}
            className="px-6 py-4 bg-exposeBrandBlue rounded-lg shadow-md flex flex-col gap-2"
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
                <p className="text-2xl text-pink-400">
                  ${Number(co.price).toLocaleString("es-AR")}
                </p>
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
                      if (!newPrice || Number(newPrice) <= 0) {
                        setShowErrorPopup(true);
                        setTimeout(() => setShowErrorPopup(false), 2000); // se oculta solo
                        return;
                      }

                      await updatePrice(co.id, Number(newPrice));
                      setEditingId(null);
                      setNewPrice("");
                    }}
                    className="flex-1 bg-pink-500 text-white px-3 py-2 rounded hover:bg-green-700 transition-colors text-sm font-semibold"
                  >
                    Guardar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={async () => {
                      await deleteOffering(co.id);
                    }}
                    className="flex-1 bg-rose-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors text-sm font-semibold"
                  >
                    Borrar
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(co.id);
                      setNewPrice(String(parseFloat(String(co.price))));
                    }}
                    className="flex-1 bg-cyan-700 text-white px-3 py-2 rounded hover:bg-yellow-600 transition-colors text-sm font-semibold"
                  >
                    Editar
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

      {showErrorPopup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-70 flex items-center justify-center z-50">
          <div className="border border-red-500 bg-gray-800 text-white rounded-lg shadow-lg p-6 flex items-center space-x-3">
            <span className="text-red-400 text-3xl">⚠️</span>
            <span className="font-semibold">
              Debes ingresar un precio válido
            </span>
          </div>
        </div>
      )}

        <button
                    //onClick={() => router.push("/dashboard/staff/new")}
                   
                    className="fixed bottom-20 right-4 p-2 rounded-md bg-pink-500 text-white shadow-md shadow-black hover:bg-pink-600 transition-colors"
                  >
                    <IoAddSharp className="text-3xl " />
                  </button>
    </div>
  );
}
