"use client";

import { useState } from "react";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { useProductCategories } from "@/app/hooks/useProductCategories";
import { FiCheckCircle, FiPlus, FiTag, FiLayers, FiLoader } from "react-icons/fi";

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
    <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-5">
      {/* Alerta de éxito flotante */}
      {showSuccessPopup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="border border-emerald-500/40 bg-luminiBrandBlue text-white rounded-2xl shadow-2xl p-6 flex items-center gap-4 animate-in zoom-in-95 duration-200">
            <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl">
              <FiCheckCircle className="text-emerald-400 text-2xl shrink-0" />
            </div>
            <div>
              <p className="font-semibold text-slate-100 text-sm">¡Categoría agregada!</p>
              <p className="text-xs text-slate-400 mt-0.5">
                <span className="text-emerald-300 font-medium">{selectedCategory?.name}</span> se creó con éxito.
              </p>
            </div>
          </div>
        </div>
      )}

      {showForm ? (
        <div className="bg-slate-900/80 border border-slate-700/60 p-6 rounded-2xl space-y-4 backdrop-blur-sm shadow-xl animate-in fade-in duration-200">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-pink-500/10 border border-pink-500/20 rounded-lg text-pink-400">
                <FiTag className="text-base" />
              </div>
              <h3 className="font-semibold text-slate-100 text-base">Nueva categoría</h3>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Nombre</label>
              <input
                type="text"
                placeholder="Ej: Cuidado capilar, Bebidas..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 text-slate-100 border border-slate-700/80 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-sm outline-none transition-all placeholder:text-slate-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Descripción (Opcional)</label>
              <textarea
                placeholder="Breve detalle sobre la categoría"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 text-slate-100 border border-slate-700/80 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-sm outline-none transition-all placeholder:text-slate-500 resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowForm(false)}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreate}
              disabled={isSubmitting || !name.trim()}
              className="flex-1 px-4 py-2.5 rounded-xl text-xs font-medium text-white bg-pink-600 hover:bg-pink-500 shadow-lg shadow-pink-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting && <FiLoader className="animate-spin text-sm" />}
              Guardar
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Tarjeta para crear categoría personalizada */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between gap-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-pink-500/10 border border-pink-500/20 rounded-xl text-pink-400">
                <FiLayers className="text-xl" />
              </div>
              <div>
                <p className="font-semibold text-slate-100 text-sm">Crear nueva categoría</p>
                <p className="text-xs text-slate-400">Diseña una categoría a tu medida.</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-medium text-xs rounded-xl transition-all shadow-md shadow-pink-600/20 flex items-center gap-2 shrink-0"
            >
              <FiPlus className="text-base" />
              Crear
            </button>
          </div>

          {/* Listado de categorías sugeridas / plantillas */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
              Plantillas disponibles
            </h4>

            {unassignedCategories.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/30 border border-slate-800 rounded-2xl">
                <p className="text-xs text-slate-400 italic">No hay más plantillas disponibles para agregar.</p>
              </div>
            ) : (
              unassignedCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-2xl flex items-center justify-between gap-4 hover:border-slate-700 transition-all"
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-200 text-sm">{cat.name}</p>
                    <p className="text-xs text-slate-400 line-clamp-1">{cat.description || "Sin descripción"}</p>
                  </div>
                  <button
                    onClick={() => handleAddTemplate(cat)}
                    disabled={isSubmitting}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium text-white transition-all shrink-0 ${
                      isSubmitting
                        ? "bg-pink-300 cursor-not-allowed"
                        : "bg-slate-800 hover:bg-pink-600 border border-slate-700 hover:border-pink-500"
                    }`}
                  >
                    Agregar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}