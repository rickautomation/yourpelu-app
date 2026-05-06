"use client";
import { useState } from "react";
import { FiChevronDown, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "@/app/hooks/useAuth";
import { useOfferings } from "@/app/hooks/useOfferings";
import { apiPost } from "@/app/lib/apiPost";
import { useRouter } from "next/navigation";
import { useWizard } from "@/app/context/WizardContext";
import { useSearchParams } from "next/navigation";
import { useUserEstablishment } from "@/app/hooks/useUserEstablishment";

export interface ClientOfferingType {
  id: string;
  establishmentId: string;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  clientCategory?: { id: string; name: string };
  globalCategory?: { id: string; name: string };
}

export default function NewOfferingFromCustomPage() {
  const { user } = useAuth();
   const {activeEstablishment} = useUserEstablishment(user)
  const { categories, addClientCategory, clientOfferings, setClientOfferings } = useOfferings(
    activeEstablishment?.id, activeEstablishment?.type?.id
  );
  const { step, setStep } = useWizard();
  const searchParams = useSearchParams();
  const inWizard = searchParams.get("inWizard") === "true";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");

  const [createdService, setCreatedService] =
    useState<ClientOfferingType | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [categoryError, setCategoryError] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory) {
      setCategoryError(true);
      return;
    }

    const payload = {
      establishmentId: activeEstablishment?.id,
      name,
      description,
      price: Number(price),
      categoryId: selectedCategory.id,
    };

    try {
      const data = await apiPost<ClientOfferingType>(
        "/client-offering-types/with-category",
        payload,
      );

      setCreatedService(data);
      setShowSuccess(true);

      // 👇 actualizamos la lista inmediatamente
      setClientOfferings((prev) => [...prev, data]);

      // limpiamos el formulario
      setName("");
      setDescription("");
      setPrice("");
      setSelectedCategory(null);

      // ocultamos el mensaje de éxito después de 2 segundos
      setTimeout(() => {
        setShowSuccess(false);
        setCreatedService(null);
      }, 2000);
    } catch (err: any) {
      console.error(err);
      alert(`Hubo un error al crear el servicio: ${err.message}`);
    }
  };

  return (
    <div
      className={
        "flex flex-col gap-2 max-w-lg mx-auto px-4 py-2"
      }
    >
      {/* Mensaje de éxito temporal */}
      {showSuccess && createdService && (
        <div
          key={createdService.id}
          className="px-6 py-4 bg-green-700 rounded-lg shadow-md flex items-center gap-2"
        >
          <FiCheckCircle className="text-white text-2xl" />
          <p className="text-white font-semibold">Servicio agregado</p>
        </div>
      )}

      {/* Selector de categoría */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="h-full px-4 py-2 bg-ligthBrandBlue text-white rounded flex justify-between items-center text-xl w-full"
          >
            {selectedCategory ? selectedCategory.name : "Categoría"}
            <FiChevronDown
              className={`ml-2 text-xl transition-transform duration-200 ${
                showDropdown ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
          {showDropdown && (
            <ul className="absolute top-full left-0 mt-1 w-full max-h-70 overflow-y-auto bg-ligthBrandBlue rounded shadow-lg z-10">
              {categories.map((cat: any) => (
                <li
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowDropdown(false);
                    setCategoryError(false); // 👈 ocultamos error al seleccionar
                  }}
                  className="p-3 text-white hover:bg-gray-600 border border-t border-gray-400 cursor-pointer"
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex-1">
          <button
            type="button"
            onClick={() => {
              setShowCategoryForm(true);
              // cerramos el form de servicio
            }}
            className="h-full w-full bg-blue-600 text-white font-bold px-4 py-2 rounded hover:bg-pink-600 transition-colors"
          >
            Nueva Categoria
          </button>
        </div>
      </div>

      {showCategoryForm && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const newCat = await addClientCategory({
                establishmentId: activeEstablishment?.id!,
                name: newCategoryName,
                description: newCategoryDescription,
              });
              // limpiamos y cerramos
              setNewCategoryName("");
              setNewCategoryDescription("");
              setShowCategoryForm(false);

              // 👇 asignamos la nueva categoría como seleccionada
              setSelectedCategory(newCat);
            } catch (err: any) {
              console.error(err);
              alert(`Error creando categoría: ${err.message}`);
            }
          }}
          className="flex flex-col gap-4 mt-8"
        >
          <input
            type="text"
            placeholder="Nombre categoría"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="px-3 py-2 rounded bg-exposeBrandBlue text-white"
            required
          />
          <textarea
            placeholder="Descripción categoría"
            value={newCategoryDescription}
            onChange={(e) => setNewCategoryDescription(e.target.value)}
            className="px-3 py-2 rounded bg-exposeBrandBlue text-white"
          />

          <div className="flex gap-2 mt-6">
            <button
              type="button"
              onClick={() => {
                // limpiamos y cerramos sin crear
                setNewCategoryName("");
                setNewCategoryDescription("");
                setShowCategoryForm(false);
              }}
              className="flex-1 bg-ligthBrandBlue text-white font-bold px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-pink-600 text-white font-bold px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Crear categoría
            </button>
          </div>
        </form>
      )}

      {categoryError && (
        <p className="text-red-400 text-sm mt-1">
          Debes seleccionar una categoría
        </p>
      )}

      {/* Formulario */}
      {!showCategoryForm && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-2 rounded bg-exposeBrandBlue text-white"
            required
          />
          <textarea
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-3 py-2 rounded bg-exposeBrandBlue text-white"
          />
          <input
            type="number"
            placeholder="Precio"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="px-3 py-2 rounded bg-exposeBrandBlue text-white"
            required
          />

          <button
            type="submit"
            className="mt-6 bg-pink-500 text-white font-bold px-4 py-2 rounded hover:bg-pink-600 transition-colors"
          >
            Crear
          </button>
        </form>
      )}

      {inWizard && !showCategoryForm && (
        <div className="py-4 flex justify-end">
          <button
            onClick={() => {
              if (setStep) {
                setStep(5);
              }
              router.push("/dashboard/initial-setup?step=5");
            }}
            disabled={clientOfferings.length === 0}
            className={`px-4 py-2 rounded 
          ${
            clientOfferings.length === 0
              ? "bg-gray-500 text-gray-700 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
          >
            Finalizar
          </button>
        </div>
      )}
    </div>
  );
}
