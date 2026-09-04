"use client";

import { useProducts } from "@/app/hooks/useProducts";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiChevronDown, FiEdit3, FiTrash2, FiTag, FiBox } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";

type Product = {
  id: string;
  name: string;
  description?: string;
  stock?: number;
  salePrice: number;
};

type Props = {
  linkedCategories: {
    id: string;
    name: string;
    products?: Product[];
  }[];
  onDeleteProduct?: (productId: string) => Promise<void>;
  onRefresh?: () => void;
};

export default function CategoryProductSelector({
  linkedCategories,
  onDeleteProduct,
  onRefresh,
}: Props) {
  const { updateProduct } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [open, setOpen] = useState(false);

  // Estados para edición
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<{
    name: string;
    description: string;
    salePrice: number | string;
    stock: number | string;
  }>({ name: "", description: "", salePrice: 0, stock: 0 });

  // Estados para eliminación
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const products =
    selectedCategory === "all"
      ? linkedCategories.flatMap((cat) => cat.products || [])
      : linkedCategories.find((cat) => cat.id === selectedCategory)?.products ||
        [];

  const handleEditClick = (prod: Product) => {
    setEditingProduct(prod);
    setForm({
      name: prod.name,
      description: prod.description || "",
      salePrice: prod.salePrice,
      stock: prod.stock ?? 0,
    });
  };

  const handleSave = async () => {
    if (!editingProduct) return;

    const payload = {
      ...form,
      salePrice: Number(form.salePrice),
      stock: Number(form.stock),
    };

    await updateProduct(editingProduct.id, payload);
    setEditingProduct(null);

    // Refresca la vista si los datos vienen del servidor mediante RSC (React Server Components)
    // Ejecuta el refresco del estado superior
    if (onRefresh) {
      onRefresh();
    }
  };

  const ConfirmDelete = async () => {
    if (!deletingProduct || !onDeleteProduct) return;
    try {
      setIsDeleting(true);
      await onDeleteProduct(deletingProduct.id);
      setDeletingProduct(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Error al eliminar producto:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const selectedCategoryName =
    selectedCategory === "all"
      ? "Todos los productos"
      : linkedCategories.find((cat) => cat.id === selectedCategory)?.name;

  return (
    <div className="space-y-6">
      {/* Selector de Categorías */}
      <div className="relative w-full max-w-xs">
        <div
          onClick={() => setOpen(!open)}
          className="flex justify-between items-center px-4 py-3 border border-slate-700/80 rounded-xl cursor-pointer bg-darkBrandBlue hover:border-slate-600 transition-all text-sm font-medium shadow-sm"
        >
          <span className="flex items-center gap-2 truncate">
            <FiTag className="text-pink-400 shrink-0 text-base" />
            <span className="truncate">{selectedCategoryName}</span>
          </span>
          <FiChevronDown
            className={`transition-transform duration-200 text-slate-400 text-lg ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>

        {open && (
          <div className="absolute top-full left-0 mt-2 w-full bg-darkBrandBlue border border-slate-700 rounded-xl shadow-2xl z-30 py-1 divide-y divide-slate-800 backdrop-blur-md">
            <button
              onClick={() => {
                setSelectedCategory("all");
                setOpen(false);
              }}
              className="block w-full text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Todos los productos
            </button>
            {linkedCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setOpen(false);
                }}
                className="block w-full text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800 transition-colors"
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid de Productos */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 bg-luminiBrandBlue border border-slate-800 rounded-2xl text-center">
          <FiBox className="text-3xl mb-2 text-slate-400" />
          <p className="text-sm font-medium text-slate-200">
            No hay productos en esta categoría
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Intenta seleccionar otra categoría o añade uno nuevo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((prod) => {
            const stockValue = Number(prod.stock ?? 0);
            const isLowStock = stockValue > 0 && stockValue <= 5;
            const isOutOfStock = stockValue <= 0;

            return (
              <div
                key={prod.id}
                className="flex justify-between items-start p-5 rounded-2xl border border-slate-800 bg-luminiBrandBlue hover:border-slate-700 transition-all shadow-md backdrop-blur-sm group"
              >
                <div className="space-y-2 pr-2 flex-1 min-w-0">
                  <p className="font-semibold text-sm tracking-wide text-slate-100 truncate">
                    {prod.name}
                  </p>

                  {prod.description && (
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {prod.description}
                    </p>
                  )}

                  {/* Badges de Stock */}
                  {prod.stock !== undefined && (
                    <div className="pt-0.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                          isOutOfStock
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                            : isLowStock
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        }`}
                      >
                        <FiBox className="text-xs shrink-0" />
                        <span>
                          {isOutOfStock
                            ? "Sin Stock"
                            : `${stockValue} un. en stock`}
                        </span>
                      </span>
                    </div>
                  )}

                  <p className="text-base font-bold text-pink-400 pt-1">
                    $ {prod.salePrice.toLocaleString()}
                  </p>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleEditClick(prod)}
                    className="p-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl transition-all shadow-sm"
                    title="Editar"
                  >
                    <FiEdit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingProduct(prod)}
                    className="p-2 bg-red-900/40 border border-red-700/50 hover:bg-red-600 text-white rounded-xl transition-all shadow-sm"
                    title="Eliminar"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Edición */}
      {editingProduct && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-6 animate-in fade-in duration-200">
          <div className="border border-slate-700 bg-darkBrandBlue text-white rounded-2xl shadow-2xl p-6 w-full max-w-sm space-y-4 relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="font-semibold text-slate-100 text-base">
                Editar producto
              </h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <IoCloseOutline className="text-xl" />
              </button>
            </div>

            <div className="space-y-3.5 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Nombre
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:border-pink-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Descripción
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:border-pink-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:border-pink-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">
                    Precio ($)
                  </label>
                  <input
                    type="number"
                    value={form.salePrice}
                    onChange={(e) =>
                      setForm({ ...form, salePrice: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:border-pink-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEditingProduct(null)}
                className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-medium transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2.5 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-medium transition-all shadow-lg shadow-pink-600/20"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación */}
      {deletingProduct && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 p-6 animate-in fade-in duration-200">
          <div className="border border-slate-700 bg-darkBrandBlue text-white rounded-2xl shadow-2xl p-6 w-full max-w-sm space-y-4 animate-in zoom-in-95 duration-200">
            <h3 className="font-semibold text-slate-100 text-base">
              ¿Eliminar producto?
            </h3>
            <p className="text-xs text-slate-300">
              ¿Estás seguro de que deseas eliminar{" "}
              <span className="font-semibold text-pink-400">
                "{deletingProduct.name}"
              </span>
              ? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                disabled={isDeleting}
                onClick={() => setDeletingProduct(null)}
                className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-medium transition-all"
              >
                Cancelar
              </button>
              <button
                disabled={isDeleting}
                onClick={ConfirmDelete}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-medium transition-all shadow-lg shadow-rose-600/20 flex justify-center items-center"
              >
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
