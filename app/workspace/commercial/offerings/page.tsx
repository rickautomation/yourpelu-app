"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useOfferings } from "@/app/hooks/useOfferings";
import Link from "next/link";
import { IoAddSharp } from "react-icons/io5";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { LuScissors } from "react-icons/lu";
import { IoWarningOutline } from "react-icons/io5";

export default function OfferingPage() {
  const { activeEstablishment } = useEstablishment();
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
        if (co.baseType?.category) {
          return [co.baseType.category.id, co.baseType.category];
        }
        if (co.globalCategory) {
          return [co.globalCategory.id, co.globalCategory];
        }
        if (co.clientCategory) {
          return [co.clientCategory.id, co.clientCategory];
        }
        return [null, null];
      })
    ).values()
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm font-medium">Cargando servicios...</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-5 animate-slideIn">
      {/* Dropdown de Categorías */}
      <div className="w-full relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full px-5 py-3.5 bg-luminiBrandBlue hover:bg-gray-800/80 text-white rounded-2xl flex justify-between items-center text-base font-semibold border border-pink-600/30 transition-all duration-200 shadow-md"
        >
          <span>{selectedCategory ? selectedCategory.name : "Todas las categorías"}</span>
          <FiChevronDown
            className={`text-xl text-pink-400 transition-transform duration-200 ${
              showDropdown ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        {showDropdown && (
          <ul className="absolute top-full left-0 mt-2 w-full max-h-60 overflow-y-auto bg-luminiBrandBlue border border-pink-600/30 rounded-2xl shadow-2xl z-20 backdrop-blur-md overflow-hidden">
            <li
              onClick={() => {
                setSelectedCategory(null);
                setShowDropdown(false);
              }}
              className="px-5 py-3.5 text-white hover:bg-pink-600/20 cursor-pointer text-sm font-medium transition-colors border-b border-gray-700/50"
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
                className="px-5 py-3.5 text-white hover:bg-pink-600/20 cursor-pointer text-sm font-medium transition-colors border-b border-gray-700/50 last:border-b-0"
              >
                {cat?.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Lista de Servicios */}
      <div className="flex flex-col gap-3">
        {offeringsToShow.map((co) => (
          <div
            key={co.id}
            className="p-5 bg-luminiBrandBlue border border-pink-600/30 rounded-2xl shadow-lg flex flex-col gap-3 hover:border-pink-500/50 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <LuScissors className="text-pink-400 w-4 h-4 shrink-0" />
                  <p className="text-base font-semibold text-white">{co.name}</p>
                </div>
                {co.description && (
                  <p className="text-xs text-gray-400 pl-6 line-clamp-2">
                    {co.description}
                  </p>
                )}
              </div>

              {editingId === co.id ? (
                <div className="flex items-center gap-1">
                  <span className="text-pink-400 text-lg font-bold">$</span>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-28 px-3 py-1.5 rounded-xl bg-gray-900/90 border border-pink-500 text-white text-base font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="0.00"
                    autoFocus
                  />
                </div>
              ) : (
                <p className="text-xl font-bold text-pink-400 shrink-0">
                  ${Number(co.price).toLocaleString("es-AR")}
                </p>
              )}
            </div>

            {/* Acciones de la Tarjeta */}
            <div className="flex gap-2 pt-2 border-t border-gray-700/40">
              {editingId === co.id ? (
                <>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setNewPrice("");
                    }}
                    className="flex-1 bg-gray-700/70 hover:bg-gray-700 text-gray-200 px-3 py-2 rounded-xl transition-all duration-200 text-xs font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={async () => {
                      if (!newPrice || Number(newPrice) <= 0) {
                        setShowErrorPopup(true);
                        setTimeout(() => setShowErrorPopup(false), 2000);
                        return;
                      }

                      await updatePrice(co.id, Number(newPrice));
                      setEditingId(null);
                      setNewPrice("");
                    }}
                    className="flex-1 bg-pink-600 hover:bg-pink-500 text-white px-3 py-2 rounded-xl transition-all duration-200 text-xs font-semibold shadow-md shadow-pink-600/20"
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
                    className="flex-1 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 px-3 py-2 rounded-xl transition-all duration-200 text-xs font-semibold"
                  >
                    Borrar
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(co.id);
                      setNewPrice(String(parseFloat(String(co.price))));
                    }}
                    className="flex-1 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/40 text-cyan-300 px-3 py-2 rounded-xl transition-all duration-200 text-xs font-semibold"
                  >
                    Editar Precio
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {/* Estado Vacío */}
        {selectedCategory && offeringsToShow.length === 0 && (
          <div className="p-8 bg-luminiBrandBlue/50 border border-dashed border-gray-700 rounded-2xl text-center">
            <p className="text-gray-400 font-medium text-sm">
              No hay servicios disponibles en esta categoría.
            </p>
          </div>
        )}
      </div>

      {/* Modal: Crear Servicio */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-luminiBrandBlue border border-pink-600/30 p-6 rounded-2xl shadow-2xl w-full max-w-sm space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">Nuevo Servicio</h3>
              <p className="text-xs text-gray-400">
                Seleccioná el método para agregar un servicio
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/workspace/commercial/offerings/new/from-template"
                className="bg-cyan-950/60 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 px-4 py-3 rounded-xl transition-all duration-200 text-center font-medium text-sm shadow-md"
                onClick={() => setShowModal(false)}
              >
                Crear desde plantilla
              </Link>
              <Link
                href="/workspace/commercial/offerings/new/from-custom"
                className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-3 rounded-xl transition-all duration-200 text-center font-medium text-sm shadow-lg shadow-pink-600/30"
                onClick={() => setShowModal(false)}
              >
                Crear desde cero
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Popup de Error */}
      {showErrorPopup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="border border-rose-500/50 bg-luminiBrandBlue text-white rounded-2xl shadow-2xl p-5 flex items-center gap-3 max-w-sm">
            <IoWarningOutline className="text-rose-400 text-3xl shrink-0" />
            <span className="font-semibold text-sm">
              Debes ingresar un precio válido mayor a 0
            </span>
          </div>
        </div>
      )}

      {/* Botón Flotante para Agregar */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-20 right-6 p-2 rounded-full bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-600/40 hover:scale-105 active:scale-95 transition-all duration-200 z-10"
        aria-label="Agregar servicio"
      >
        <IoAddSharp className="text-3xl" />
      </button>
    </div>
  );
}