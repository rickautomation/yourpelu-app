"use client";

import { useState } from "react";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { useProductCategories } from "@/app/hooks/useProductCategories";
import { useProducts } from "@/app/hooks/useProducts"; // 👈 Hook de productos
import { IoAddSharp, IoCloseOutline } from "react-icons/io5";
import { FiBox, FiTag, FiLayers } from "react-icons/fi";
import { useRouter } from "next/navigation";
import CategoryProductSelector from "./components/CategoryProductSelector";

export default function ProductsPage() {
  const { activeEstablishment } = useEstablishment();
  const { linkedCategories, loading, error, refetch } = useProductCategories(
    activeEstablishment?.id
  );
  const { deleteProduct } = useProducts(activeEstablishment?.id);

  const router = useRouter();
  const [showOptions, setShowOptions] = useState(false);

  // 👈 Función para eliminar y refrescar la UI
  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      await refetch();
    } catch (err) {
      console.error("Error al eliminar el producto:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Cargando categorías...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 bg-rose-500/15 border border-rose-500/30 rounded-2xl text-rose-300 text-sm">
          Error al cargar los datos: {error}
        </div>
      </div>
    );
  }

  const noCategories = linkedCategories.length === 0;
  const noProducts =
    !noCategories &&
    linkedCategories.every((cat) => !cat.products || cat.products.length === 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Contenido Principal */}
      {noCategories ? (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-800/30 border border-slate-700/50 rounded-2xl text-center backdrop-blur-sm">
          <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-full text-pink-400 mb-3">
            <FiLayers className="text-2xl" />
          </div>
          <h3 className="text-slate-200 font-semibold text-base mb-1">Sin categorías creadas</h3>
          <p className="text-slate-400 text-xs max-w-sm mb-4">
            Es necesario crear categorías primero para poder organizar y agregar tus productos.
          </p>
          <button
            onClick={() => router.push("products/new-category")}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-medium text-xs rounded-xl transition-all shadow-lg shadow-pink-600/20"
          >
            Crear primera categoría
          </button>
        </div>
      ) : noProducts ? (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-800/30 border border-slate-700/50 rounded-2xl text-center backdrop-blur-sm">
          <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-full text-pink-400 mb-3">
            <FiBox className="text-2xl" />
          </div>
          <h3 className="text-slate-200 font-semibold text-base mb-1">Aún no hay productos</h3>
          <p className="text-slate-400 text-xs max-w-sm">
            Empieza a agregar artículos a tus categorías usando el botón flotante inferior.
          </p>
        </div>
      ) : (
        /* 👈 Pasamos el handler como prop */
        <CategoryProductSelector
          linkedCategories={linkedCategories}
          onDeleteProduct={handleDeleteProduct}
        />
      )}

      {/* Popup de Opciones */}
      {showOptions && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="border border-slate-700 bg-darkBrandBlue text-white rounded-2xl shadow-2xl p-6 space-y-4 w-full max-w-xs relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <p className="font-semibold text-slate-100 text-sm">¿Qué deseas crear?</p>
              <button
                onClick={() => setShowOptions(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <IoCloseOutline className="text-xl" />
              </button>
            </div>

            <div className="space-y-2.5 pt-1">
              <button
                onClick={() => {
                  setShowOptions(false);
                  router.push("products/new-category");
                }}
                className="w-full px-4 py-3 bg-luminiBrandBlue hover:bg-slate-700/80 border border-slate-700/60 rounded-xl font-medium text-xs flex items-center gap-3 transition-all group"
              >
                <div className="p-2 bg-pink-500/10 border border-pink-500/20 rounded-lg text-pink-400 group-hover:bg-pink-500 group-hover:text-white transition-all">
                  <FiTag className="text-base" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Nueva categoría</p>
                  <p className="text-[10px] text-slate-400">Organiza por secciones</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowOptions(false);
                  router.push("products/new-product");
                }}
                className="w-full px-4 py-3 bg-luminiBrandBlue hover:bg-slate-700/80 border border-slate-700/60 rounded-xl font-medium text-xs flex items-center gap-3 transition-all group"
              >
                <div className="p-2 bg-pink-500/10 border border-pink-500/20 rounded-lg text-pink-400 group-hover:bg-pink-500 group-hover:text-white transition-all">
                  <FiBox className="text-base" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Nuevo producto</p>
                  <p className="text-[10px] text-slate-400">Añade stock y precios</p>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowOptions(false)}
              className="w-full mt-2 py-2 bg-pink-600 rounded-md text-xs font-medium hover:text-slate-200 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Botón Flotante */}
      <button
        onClick={() => setShowOptions(true)}
        className="fixed bottom-20 right-6 p-2 rounded-full bg-pink-600 text-white shadow-xl shadow-pink-600/30 hover:bg-pink-500 hover:scale-105 active:scale-95 transition-all z-40 group flex items-center justify-center"
        aria-label="Crear nuevo"
      >
        <IoAddSharp className="w-8 h-8 group-hover:rotate-90 transition-transform duration-200" />
      </button>
    </div>
  );
}