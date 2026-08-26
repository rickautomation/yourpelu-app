"use client";

import { useState } from "react";
import { FiBox, FiTag, FiX as IoCloseOutline } from "react-icons/fi";

type Props = {
  linkedCategories: { id: string; name: string }[];
  onCancel: () => void;
  onSave: (product: {
    name: string;
    description: string;
    brand: string;
    costPrice: number;
    salePrice: number;
    stock: number;
    categoryId: string;
  }) => void;
};

export default function NewProductForm({ linkedCategories, onCancel, onSave }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [costPrice, setCostPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);

  const [errors, setErrors] = useState<string[]>([]);

  const validate = () => {
    const newErrors: string[] = [];
    if (!name.trim()) newErrors.push("El nombre es obligatorio.");
    if (!categoryId) newErrors.push("Debes seleccionar una categoría.");
    if (costPrice <= 0) newErrors.push("El precio de costo debe ser mayor a 0.");
    if (salePrice <= 0) newErrors.push("El precio de venta debe ser mayor a 0.");
    if (stock < 0) newErrors.push("El stock no puede ser negativo.");
    setErrors(newErrors);

    // 👉 limpiar errores después de 3 segundos
    if (newErrors.length > 0) {
      setTimeout(() => setErrors([]), 2000);
    }

    return newErrors.length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    console.log("Guardando producto con categoryId:", categoryId);
    onSave({ name, description, brand, costPrice, salePrice, stock, categoryId });
  };

  return (
    <div className="text-white space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-pink-500/10 border border-pink-500/20 rounded-lg text-pink-400">
            <FiBox className="text-base" />
          </div>
          <p className="font-semibold text-slate-100 text-base">Nuevo producto</p>
        </div>
      </div>

      {/* 👉 Mensajes de error */}
      {errors.length > 0 && (
        <div className="bg-red-500/15 border border-red-500/30 text-red-300 p-3 rounded-xl animate-in fade-in duration-200">
          <ul className="list-disc list-inside text-xs space-y-0.5">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2.5 pt-1">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">Nombre</label>
          <input
            type="text"
            placeholder="Ej: Champú reparador..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 text-slate-100 border border-slate-700/80 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-sm outline-none transition-all placeholder:text-slate-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">Descripción</label>
          <input
            type="text"
            placeholder="Breve descripción del producto"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 text-slate-100 border border-slate-700/80 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-sm outline-none transition-all placeholder:text-slate-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">Marca</label>
          <input
            type="text"
            placeholder="Ej: L'Oréal, Kerastase..."
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 text-slate-100 border border-slate-700/80 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-sm outline-none transition-all placeholder:text-slate-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Precio costo</label>
            <input
              type="number"
              placeholder="0"
              value={costPrice === 0 ? "" : costPrice}
              onChange={(e) => setCostPrice(e.target.value === "" ? 0 : Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 text-slate-100 border border-slate-700/80 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-sm outline-none transition-all placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Precio venta</label>
            <input
              type="number"
              placeholder="0"
              value={salePrice === 0 ? "" : salePrice}
              onChange={(e) => setSalePrice(e.target.value === "" ? 0 : Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 text-slate-100 border border-slate-700/80 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-sm outline-none transition-all placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Stock</label>
            <input
              type="number"
              placeholder="0"
              value={stock === 0 ? "" : stock}
              onChange={(e) => setStock(e.target.value === "" ? 0 : Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 text-slate-100 border border-slate-700/80 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-sm outline-none transition-all placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">Categoría</label>
          <div
            onClick={() => setShowCategoryPopup(true)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700/80 cursor-pointer bg-slate-950/80 hover:border-slate-600 text-slate-200 transition-all text-sm flex items-center justify-between"
          >
            <span className="flex items-center gap-2 truncate">
              <FiTag className="text-pink-400 shrink-0 text-sm" />
              <span className={selectedCategory ? "text-slate-100 font-medium" : "text-slate-500"}>
                {selectedCategory ? selectedCategory : "Seleccionar categoría"}
              </span>
            </span>
          </div>
        </div>
      </div>

      {showCategoryPopup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="border border-slate-700 bg-darkBrandBlue text-white rounded-2xl shadow-2xl p-6 space-y-3.5 w-full max-w-sm relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <p className="font-semibold text-slate-100 text-base">Selecciona una categoría</p>
              <button
                onClick={() => setShowCategoryPopup(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <IoCloseOutline className="text-xl" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {linkedCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setCategoryId(cat.id);
                    setShowCategoryPopup(false);
                  }}
                  className="w-full px-3.5 py-2.5 bg-luminiBrandBlue hover:bg-pink-600/20 border border-slate-800 hover:border-pink-500/50 rounded-xl text-slate-200 hover:text-pink-300 text-xs font-medium transition-all text-left flex items-center gap-2"
                >
                  <FiTag className="text-pink-400 text-sm shrink-0" />
                  {cat.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCategoryPopup(false)}
              className="w-full px-4 py-2.5 bg-pink-600 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-medium transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
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
  );
}