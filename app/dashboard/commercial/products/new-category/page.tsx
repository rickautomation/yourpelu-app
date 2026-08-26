"use client";

import { useState } from "react";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { useProductCategories } from "@/app/hooks/useProductCategories";
import { FiCheckCircle } from "react-icons/fi";

export default function AddCategories() {
  const { activeEstablishment } = useEstablishment();
  const { unassignedCategories, createCategory, createFromTemplate } =
    useProductCategories(activeEstablishment?.id);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const handleCreate = async () => {
    setIsSubmitting(true);
    await createCategory({ name, description });
    setSelectedCategory({ name });
    setShowSuccessPopup(true);

    setName("");
    setDescription("");
    setShowForm(false);
    setIsSubmitting(false);

    // Ocultar popup después de 2 segundos
    setTimeout(() => setShowSuccessPopup(false), 2000);
  };

  const handleAddTemplate = async (cat: any) => {
    setIsSubmitting(true);
    await createFromTemplate(cat.id);
    setSelectedCategory(cat);
    setShowSuccessPopup(true);

    setIsSubmitting(false);
    setTimeout(() => setShowSuccessPopup(false), 2000);
  };

  return (
    <div className="p-4 space-y-4">
      {showForm ? (
        <div className="p-4 bg-luminiBrandBlue rounded-md space-y-3">
          <p className="font-bold text-center">Nueva categoría</p>

          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-2 py-1 rounded border"
          />

          <input
            type="text"
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-2 py-1 rounded border"
          />

          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(false)}
              disabled={isSubmitting}
              className={`flex-1 px-3 py-2 rounded text-white ${
                isSubmitting
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-400 hover:bg-gray-500"
              }`}
            >
              Cancelar
            </button>
            <button
              onClick={handleCreate}
              disabled={isSubmitting}
              className={`flex-1 px-3 py-2 rounded text-white ${
                isSubmitting
                  ? "bg-pink-300 cursor-not-allowed"
                  : "bg-pink-500 hover:bg-pink-600"
              }`}
            >
              Guardar
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="p-4 bg-luminiBrandBlue rounded-md flex justify-between items-center">
            <p className="font-bold">Crear nueva categoría</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-2 px-3 py-1 bg-pink-500 text-white rounded hover:bg-pink-600"
            >
              Crear
            </button>
          </div>

          {unassignedCategories.map((cat) => (
            <div
              key={cat.id}
              className="p-4 bg-luminiBrandBlue rounded-md flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{cat.name}</p>
                <p className="text-sm text-gray-400">{cat.description}</p>
              </div>
              <button
                onClick={() => handleAddTemplate(cat)}
                disabled={isSubmitting}
                className={`px-3 py-1 rounded text-white ${
                  isSubmitting
                    ? "bg-pink-300 cursor-not-allowed"
                    : "bg-pink-500 hover:bg-pink-600"
                }`}
              >
                Agregar
              </button>
            </div>
          ))}
        </>
      )}

      {showSuccessPopup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-70 flex items-center justify-center z-50">
          <div className="border border-green-500 bg-darkBrandBlue text-white rounded-lg shadow-lg p-6 flex items-center space-x-3">
            <FiCheckCircle className="text-green-400 text-3xl" />
            <span className="font-semibold">
              {selectedCategory?.name} creado con éxito!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
