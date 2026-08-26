"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiChevronDown, FiCheckCircle, FiLoader, FiPlus, FiTag } from "react-icons/fi";
import { useOfferings } from "@/app/hooks/useOfferings";
import { apiPost } from "@/app/lib/apiPost";
import { useWizard } from "@/app/context/WizardContext";
import { useEstablishment } from "@/app/context/EstablishmentContext";

export interface ClientCategoryType {
  id: string;
  name: string;
  description?: string;
}

export interface ClientOfferingType {
  id: string;
  establishmentId: string;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  clientCategory?: ClientCategoryType;
  globalCategory?: ClientCategoryType;
}

export default function NewOfferingFromCustomPage() {
  const { activeEstablishment } = useEstablishment();
  const { categories, addClientCategory, clientOfferings, setClientOfferings } = useOfferings(
    activeEstablishment?.id,
    activeEstablishment?.type?.id
  );
  const { setStep } = useWizard();
  const searchParams = useSearchParams();
  const router = useRouter();

  const inWizard = searchParams.get("inWizard") === "true";

  // Form State - Offering
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ClientCategoryType | null>(null);

  // UI State
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State - Category
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");

  // Feedback State
  const [createdService, setCreatedService] = useState<ClientOfferingType | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [categoryError, setCategoryError] = useState(false);

  const handleSubmitOffering = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory) {
      setCategoryError(true);
      return;
    }

    if (!activeEstablishment?.id) {
      alert("No se encontró un establecimiento activo seleccionado.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      establishmentId: activeEstablishment.id,
      name,
      description,
      price: Number(price),
      categoryId: selectedCategory.id,
    };

    try {
      const data = await apiPost<ClientOfferingType>(
        "/client-offering-types/with-category",
        payload
      );

      setCreatedService(data);
      setShowSuccess(true);
      setClientOfferings((prev) => [...prev, data]);

      // Reset Form
      setName("");
      setDescription("");
      setPrice("");
      setSelectedCategory(null);

      setTimeout(() => {
        setShowSuccess(false);
        setCreatedService(null);
      }, 2000);
    } catch (err: any) {
      console.error("Error creating custom offering:", err);
      alert(`Hubo un error al crear el servicio: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeEstablishment?.id) {
      alert("Establecimiento activo no disponible.");
      return;
    }

    setIsSubmitting(true);
    try {
      const newCat = await addClientCategory({
        establishmentId: activeEstablishment.id,
        name: newCategoryName,
        description: newCategoryDescription,
      });

      setNewCategoryName("");
      setNewCategoryDescription("");
      setShowCategoryForm(false);
      setSelectedCategory(newCat);
      setCategoryError(false);
    } catch (err: any) {
      console.error("Error creating category:", err);
      alert(`Error creando categoría: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto px-4 py-4 sm:px-6">
      {/* Alerta de éxito */}
      {showSuccess && createdService && (
        <div className="px-5 py-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl shadow-lg backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <FiCheckCircle className="text-emerald-400 text-xl shrink-0" />
          <p className="text-emerald-200 text-sm font-medium">Servicio agregado correctamente</p>
        </div>
      )}

      {/* Cabecera con título y botón para agregar categoría fuera del form */}
      {!showCategoryForm && (
        <div className="flex items-center justify-between bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
          <div>
            <h2 className="font-semibold text-slate-100 text-base">Gestión de Servicios</h2>
            <p className="text-xs text-slate-400">Crea categorías y organiza tus ítems.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCategoryForm(true)}
            className="bg-luminiBrandBlue hover:bg-slate-700 text-pink-400 border border-slate-700 hover:border-pink-500/40 font-medium px-3.5 py-2 rounded-xl transition-all text-xs flex items-center gap-2 shadow-sm"
          >
            <FiPlus className="text-base" />
            Nueva Categoría
          </button>
        </div>
      )}

      {/* Formulario Creación Categoría */}
      {showCategoryForm ? (
        <form onSubmit={handleCreateCategory} className="flex flex-col gap-4 bg-darkBrandBlue p-5 rounded-2xl border border-slate-700/60 backdrop-blur-sm">
          <div className="border-b border-slate-700/60 pb-3">
            <h3 className="font-semibold text-slate-100 text-base">Nueva Categoría</h3>
            <p className="text-xs text-slate-400 mt-0.5">Crea una sección para agrupar tus servicios personalizados.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-300">Nombre</label>
            <input
              type="text"
              placeholder="Ej: Corte, Masajes..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900/80 text-slate-100 border border-slate-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-sm outline-none transition-all placeholder:text-slate-500"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-300">Descripción (Opcional)</label>
            <textarea
              placeholder="Detalles sobre esta categoría"
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
              rows={2}
              className="px-3.5 py-2.5 rounded-xl bg-darkBrandBlue text-slate-100 border border-slate-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-sm outline-none transition-all placeholder:text-slate-500 resize-none"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                setNewCategoryName("");
                setNewCategoryDescription("");
                setShowCategoryForm(false);
              }}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-4 py-2.5 rounded-xl transition-all text-sm border border-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-pink-600 hover:bg-pink-500 text-white font-medium px-2 py-1.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-600/20 disabled:opacity-50"
            >
              {isSubmitting && <FiLoader className="animate-spin text-lg" />}
              Guardar
            </button>
          </div>
        </form>
      ) : (
        /* Formulario Creación Servicio (Incluye el selector de categoría) */
        <form onSubmit={handleSubmitOffering} className="flex flex-col gap-4 bg-darkBrandBlue p-5 rounded-2xl border border-slate-700/60 backdrop-blur-sm">
          <div className="border-b border-slate-700/60 pb-3">
            <h3 className="font-semibold text-slate-100 text-base">Nuevo servicio</h3>
            <p className="text-xs text-slate-400 mt-0.5">Ingresa los detalles del nuevo ítem a ofrecer.</p>
          </div>

          {/* Selector de Categoría integrado dentro del form */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-300">Categoría</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDropdown((prev) => !prev)}
                className={`w-full px-4 py-2.5 bg-luminiBrandBlue hover:bg-slate-900 text-slate-100 rounded-xl border flex justify-between items-center transition-all text-sm font-medium shadow-sm ${
                  categoryError ? "border-rose-500 ring-1 ring-rose-500/50" : "border-slate-700 hover:border-slate-600"
                }`}
              >
                <span className="truncate flex items-center gap-2">
                  <FiTag className="text-slate-400 shrink-0" />
                  {selectedCategory ? selectedCategory.name : "Seleccionar Categoría"}
                </span>
                <FiChevronDown
                  className={`ml-2 text-lg text-slate-400 transition-transform duration-200 ${
                    showDropdown ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {showDropdown && (
                <ul className="absolute top-full left-0 mt-2 w-full max-h-60 overflow-y-auto bg-luminiBrandBlue border border-slate-700 rounded-xl shadow-xl z-30 py-1 divide-y divide-slate-700">
                  {categories.length === 0 ? (
                    <li className="p-3 text-xs text-slate-400 text-center">No hay categorías disponibles</li>
                  ) : (
                    categories.map((cat: ClientCategoryType) => (
                      <li
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setShowDropdown(false);
                          setCategoryError(false);
                        }}
                        className="px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800 cursor-pointer transition-colors"
                      >
                        {cat.name}
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
            {categoryError && (
              <p className="text-rose-400 text-xs font-medium pl-1 mt-0.5">
                Debes seleccionar una categoría
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-300">Nombre del servicio</label>
            <input
              type="text"
              placeholder="Ej: Corte de cabello premium"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900/80 text-slate-100 border border-slate-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-sm outline-none transition-all placeholder:text-slate-500"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-300">Descripción</label>
            <textarea
              placeholder="Breve descripción del servicio"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900/80 text-slate-100 border border-slate-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-sm outline-none transition-all placeholder:text-slate-500 resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-300">Precio</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-medium">$</span>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="any"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-900/80 text-slate-100 border border-slate-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-sm outline-none transition-all placeholder:text-slate-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 bg-pink-600 hover:bg-pink-500 text-white font-medium px-4 py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-600/20 disabled:opacity-50"
          >
            {isSubmitting && <FiLoader className="animate-spin text-lg" />}
            Crear Servicio
          </button>
        </form>
      )}

      {inWizard && !showCategoryForm && (
        <div className="pt-2 flex justify-end border-t border-slate-800">
          <button
            onClick={() => {
              if (setStep) setStep(6);
              router.push("/dashboard/initial-setup?step=6");
            }}
            disabled={clientOfferings.length === 0}
            className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all shadow-md ${
              clientOfferings.length === 0
                ? "bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
            }`}
          >
            Finalizar
          </button>
        </div>
      )}
    </div>
  );
}