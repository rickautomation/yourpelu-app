"use client";

import { useState } from "react";

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
    <div className="text-white rounded-md space-y-3">
      <p className="font-bold text-center">Nuevo producto</p>

      {/* 👉 Mensajes de error */}
      {errors.length > 0 && (
        <div className="bg-red-500 text-white p-2 rounded">
          <ul className="list-disc list-inside text-sm">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-2 py-1 rounded border bg-white text-black placeholder-gray-400"
      />

      <input
        type="text"
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-2 py-1 rounded border bg-white text-black placeholder-gray-400"
      />

      <input
        type="text"
        placeholder="Marca"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        className="w-full px-2 py-1 rounded border bg-white text-black placeholder-gray-400"
      />

      <div>
        <label className="block text-sm font-semibold mb-1">Precio costo</label>
        <input
          type="number"
          placeholder="0"
          value={costPrice === 0 ? "" : costPrice}
          onChange={(e) => setCostPrice(e.target.value === "" ? 0 : Number(e.target.value))}
          className="w-full px-2 py-1 rounded border bg-white text-black placeholder-gray-400"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Precio venta</label>
        <input
          type="number"
          placeholder="0"
          value={salePrice === 0 ? "" : salePrice}
          onChange={(e) => setSalePrice(e.target.value === "" ? 0 : Number(e.target.value))}
          className="w-full px-2 py-1 rounded border bg-white text-black placeholder-gray-400"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Stock</label>
        <input
          type="number"
          placeholder="0"
          value={stock === 0 ? "" : stock}
          onChange={(e) => setStock(e.target.value === "" ? 0 : Number(e.target.value))}
          className="w-full px-2 py-1 rounded border bg-white text-black placeholder-gray-400"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Categoría</label>
        <div
          onClick={() => setShowCategoryPopup(true)}
          className="w-full px-2 py-1 rounded border cursor-pointer bg-white text-gray-700"
        >
          {selectedCategory ? selectedCategory : "Seleccionar categoría"}
        </div>
      </div>

      {showCategoryPopup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="border border-pink-500 bg-darkBrandBlue text-white rounded-lg shadow-lg p-6 space-y-3 w-96">
            <p className="font-bold text-center">Selecciona una categoría</p>

            {linkedCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setCategoryId(cat.id);
                  setShowCategoryPopup(false);
                }}
                className="w-full px-3 py-2 bg-pink-500 rounded hover:bg-pink-600"
              >
                {cat.name}
              </button>
            ))}

            <button
              onClick={() => setShowCategoryPopup(false)}
              className="w-full px-3 py-2 bg-gray-400 rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onCancel}
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
  );
}
