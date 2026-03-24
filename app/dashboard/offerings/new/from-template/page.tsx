"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { useUserBarbershops } from "@/app/hooks/useUserBarbershops";

import { FiChevronDown } from "react-icons/fi";
import { FiCheckCircle } from "react-icons/fi";
import { useWizard } from "@/app/context/WizardContext";

import { useOfferings } from "@/app/hooks/useOfferings";
import Link from "next/link";

interface OfferingPageProps {
  inWizard?: boolean;
}

type OfferingCategory = {
  id: string;
  name: string;
  description?: string;
  types: OfferingType[];
};

type OfferingType = {
  id: string;
  name: string;
  description?: string;
  category?: OfferingCategory;
};

export default function NewOfferingFromTemplatePage({
  inWizard,
}: OfferingPageProps) {
  const { user } = useAuth();
  const { activeBarbershop } = useUserBarbershops(user);
  const {
    addOffering,
    clientOfferings,
    isOfferingCategory,
    selectedCategory,
    setSelectedCategory,
    globalCategories,
  } = useOfferings(activeBarbershop?.id);
  const { step, setStep } = useWizard();

  const router = useRouter();

  const [showDropdown, setShowDropdown] = useState(false);
  const [openPriceInput, setOpenPriceInput] = useState<string | null>(null);
  const [price, setPrice] = useState<string>("");
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showTempMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="py-2 px-4">
      <div className="flex justify-between items-center py-2 mb-2">
        <div className="relative flex-1">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-68 px-3 py-2 bg-gray-700 text-white rounded flex justify-between items-center text-xl"
          >
            {selectedCategory ? selectedCategory.name : "Categoría"}
            <FiChevronDown
              className={`ml-2 text-xl transition-transform duration-200 ${
                showDropdown ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
          {showDropdown && (
            <ul className="absolute top-full left-0 mt-1 w-68 max-h-60 overflow-y-auto bg-gray-800 rounded shadow-lg z-10">
              {globalCategories.map((cat: any) => (
                <li
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowDropdown(false);
                  }}
                  className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {inWizard && (
          <div className="ml-2">
            <Link
              href="/dashboard/offerings/new/from-custom?inWizard=true"
              className="px-4 py-3 bg-pink-500 text-white text-xl font-bold rounded hover:bg-pink-600 transition-colors"
            >
              +
            </Link>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {selectedCategory &&
          isOfferingCategory(selectedCategory) &&
          selectedCategory.types
            .filter((service: OfferingType) => {
              // 👇 si está en recentlyAdded, no lo filtramos
              if (recentlyAdded === service.id) return true;
              // caso normal: ocultar si ya existe en clientOfferings
              return !clientOfferings.some(
                (co) => co.baseType?.id === service.id,
              );
            })
            .map((service: OfferingType) =>
              recentlyAdded === service.id ? (
                <div
                  key={service.id}
                  className="px-6 py-4 bg-green-700 rounded-lg shadow-md flex items-center gap-2"
                >
                  <FiCheckCircle className="text-white text-2xl" />
                  <p className="text-white font-semibold">Servicio agregado</p>
                </div>
              ) : (
                <div
                  key={service.id}
                  className="px-6 py-4 bg-gray-700 rounded-lg shadow-md flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold">{service.name}</p>
                      {service.description && (
                        <p className="text-xs text-gray-300">
                          {service.description}
                        </p>
                      )}
                    </div>
                    {openPriceInput !== service.id && (
                      <button
                        onClick={() =>
                          setOpenPriceInput(
                            openPriceInput === service.id ? null : service.id,
                          )
                        }
                        className="ml-auto w-28 text-center px-2 py-3 bg-pink-400 text-white rounded hover:bg-pink-500 transition-colors text-lg font-semibold"
                      >
                        Añadir
                      </button>
                    )}
                  </div>

                  {openPriceInput === service.id && (
                    <div className="flex flex-col gap-2 bg-gray-800 p-3 rounded-lg">
                      <input
                        type="number"
                        placeholder="Precio"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="px-2 py-1 rounded bg-gray-700 text-white text-lg"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            if (!price || Number(price) <= 0) {
                              setShowErrorPopup(true);
                              setTimeout(() => setShowErrorPopup(false), 2000); // se oculta solo
                              return;
                            }

                            await addOffering({
                              baseTypeId: service.id,
                              categoryId: selectedCategory?.id,
                              name: service.name,
                              description: service.description,
                              price: Number(price),
                            });

                            setOpenPriceInput(null);
                            setPrice("");
                            setRecentlyAdded(service.id);
                            setTimeout(() => setRecentlyAdded(null), 2000);
                          }}
                          className="flex-1 bg-pink-400 text-white px-3 py-2 rounded hover:bg-pink-500 transition-colors text-sm font-semibold"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => {
                            setOpenPriceInput(null);
                            setPrice("");
                          }}
                          className="flex-1 bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 transition-colors text-sm font-semibold"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ),
            )}

        {/* 👇 mensaje cuando no quedan plantillas disponibles */}
        {selectedCategory &&
          isOfferingCategory(selectedCategory) &&
          selectedCategory.types.filter((service: OfferingType) => {
            if (recentlyAdded === service.id) return true;
            return !clientOfferings.some(
              (co) => co.baseType?.id === service.id,
            );
          }).length === 0 && (
            <div className="px-6 py-4 rounded-lg shadow-md text-center">
              <p className="text-blue-500 font-semibold">
                No quedan servicios de plantilla disponibles para agregar.
              </p>
            </div>
          )}
      </div>

      {inWizard && (
        <div className="py-4 flex justify-end">
          <button
            onClick={() => {
              if (setStep) {
                setStep(3);
              }
              router.push("/dashboard/initial-setup?step=3");
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

      {showErrorPopup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-70 flex items-center justify-center z-50">
          <div className="border border-red-500 bg-gray-800 text-white rounded-lg shadow-lg p-6 flex items-center space-x-3">
            <span className="text-red-400 text-3xl">⚠️</span>
            <span className="font-semibold">
              Debes ingresar un precio válido
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
