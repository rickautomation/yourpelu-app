"use client";

import { useProducts } from "@/app/hooks/useProducts";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

type Product = {
  id: string;
  name: string;
  description?: string;
  salePrice: number;
};

type Props = {
  linkedCategories: {
    id: string;
    name: string;
    products?: Product[];
  }[];
};

export default function CategoryProductSelector({ linkedCategories }: Props) {
  const { updateProduct } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [open, setOpen] = useState(false);

  // 👉 estados para edición
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", description: "", salePrice: 0 });

  // 👉 productos filtrados
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
    });
  };

  const handleSave = async () => {
    if (!editingProduct) return;
    await updateProduct(editingProduct.id, form);
    setEditingProduct(null); // cerrar modal
  };

  return (
    <div className="space-y-4">
      {/* Simil select */}
      <div className="relative w-full">
        <div
          onClick={() => setOpen(!open)}
          className="flex justify-between items-center px-3 py-2 border rounded cursor-pointer bg-luminiBrandBlue text-white"
        >
          <span>
            {selectedCategory === "all"
              ? "Todos los productos"
              : linkedCategories.find((cat) => cat.id === selectedCategory)
                  ?.name}
          </span>
          <FiChevronDown
            className={`transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          />
        </div>

        {open && (
          <div className="absolute mt-1 w-full bg-luminiBrandBlue border rounded shadow-lg z-10">
            <button
              onClick={() => {
                setSelectedCategory("all");
                setOpen(false);
              }}
              className="block w-full text-left px-3 py-2 hover:bg-gray-600 text-white"
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
                className="block w-full text-left px-3 py-2 hover:bg-gray-600 text-white"
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lista de productos */}
      {products.length === 0 ? (
        <p className="text-gray-500 italic">
          No hay productos en esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="flex justify-between p-4 rounded-lg shadow bg-luminiBrandBlue"
            >
              <div>
                <p className="font-semibold">{prod.name}</p>
                <p className="text-md text-gray-200 mt-2">$ {prod.salePrice}</p>
              </div>
              <button
                onClick={() => handleEditClick(prod)}
                className="px-4 py-2 bg-pink-500 rounded hover:bg-pink-600 self-start"
              >
                Editar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal de edición */}
      {editingProduct && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-70 flex items-center justify-center bg-opacity-50 z-50 p-6">
          <div className="border border-pink-600 bg-darkBrandBlue p-6 rounded-lg w-96 space-y-4">
            <h2 className="font-bold text-lg">Editar producto</h2>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-2 py-1 border bg-white text-black rounded"
              placeholder="Nombre"
            />
            <input
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full px-2 py-1 border bg-white text-black rounded"
              placeholder="Descripción"
            />
            <input
              type="number"
              value={form.salePrice === 0 ? "" : form.salePrice}
              onChange={(e) =>
                setForm({
                  ...form,
                  salePrice: e.target.value === "" ? 0 : Number(e.target.value),
                })
              }
              onFocus={() => setForm({ ...form, salePrice: 0 })} // 👉 al entrar, lo vaciamos
              className="w-full px-2 py-1 border bg-white text-black rounded"
              placeholder="Precio venta"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setEditingProduct(null)}
                className="flex-1 px-3 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-3 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
