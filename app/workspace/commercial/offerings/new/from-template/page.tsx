"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiChevronDown, FiCheckCircle, FiAlertCircle, FiPlusCircle, FiTag } from "react-icons/fi";
import { useOfferings } from "@/app/hooks/useOfferings";
import Link from "next/link";
import { useEstablishment } from "@/app/context/EstablishmentContext";

interface OfferingPageProps {
  inWizard?: boolean;
  setStep?: (step: number) => void;
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
  setStep,
}: OfferingPageProps) {
  const { activeEstablishment } = useEstablishment();
  const {
    addOffering,
    clientOfferings,
    isOfferingCategory,
    selectedCategory,
    setSelectedCategory,
    globalCategories,
  } = useOfferings(activeEstablishment?.id, activeEstablishment?.type?.id);

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
    <div className={`max-w-xl mx-auto ${inWizard ? "" : "px-4 py-4 sm:px-6"}`}>
      {/* Selector superior */}
      <div className="flex w-full gap-3 items-center py-2 mb-4">
        <div className="relative flex-1">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full px-4 py-3 bg-slate-800/80 hover:bg-slate-800 text-slate-100 rounded-xl border border-slate-700 hover:border-slate-600 flex justify-between items-center text-sm font-medium transition-all shadow-sm"
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
            <ul className="absolute top-full left-0 mt-2 w-full max-h-64 overflow-y-auto bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 py-1 divide-y divide-slate-700/50">
              {globalCategories.map((cat: any) => (
                <li
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowDropdown(false);
                  }}
                  className="px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-700/70 cursor-pointer transition-colors"
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {inWizard && (
          <div className="flex-1">
            <Link
              href="/dashboard/offerings/new/from-custom?inWizard=true"
              className="w-full px-4 py-3 bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold rounded-xl transition-all text-center block shadow-md shadow-pink-600/20 whitespace-nowrap"
            >
              Crear desde cero
            </Link>
          </div>
        )}
      </div>

      {/* Listado de Servicios */}
      <div className="flex flex-col gap-3">
        {selectedCategory &&
          isOfferingCategory(selectedCategory) &&
          selectedCategory.types
            .filter((service: OfferingType) => {
              if (recentlyAdded === service.id) return true;
              return !clientOfferings.some(
                (co) => co.baseType?.id === service.id,
              );
            })
            .map((service: OfferingType) =>
              recentlyAdded === service.id ? (
                <div
                  key={service.id}
                  className="px-5 py-4 bg-emerald-500/15 border border-emerald-500/30 rounded-xl shadow-sm flex items-center gap-3 animate-in fade-in duration-200"
                >
                  <FiCheckCircle className="text-emerald-400 text-xl shrink-0" />
                  <p className="text-emerald-200 text-sm font-medium">Servicio agregado correctamente</p>
                </div>
              ) : (
                <div
                  key={service.id}
                  className="p-4 bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/60 rounded-2xl shadow-sm transition-all flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col">
                      <p className="text-base font-semibold text-slate-100">{service.name}</p>
                      {service.description && (
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
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
                        className="shrink-0 px-4 py-2 bg-pink-600/10 hover:bg-pink-600 text-pink-400 hover:text-white border border-pink-500/30 rounded-xl transition-all text-xs font-semibold flex items-center gap-1.5"
                      >
                        <FiPlusCircle className="text-sm" />
                        Añadir
                      </button>
                    )}
                  </div>

                  {/* Input desplegable para el precio */}
                  {openPriceInput === service.id && (
                    <div className="flex flex-col gap-3 p-3 mt-1 bg-slate-900/60 rounded-xl border border-slate-700/60">
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                        <input
                          type="number"
                          placeholder="Ingresa el precio"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full pl-7 pr-3 py-2 bg-slate-800 text-slate-100 rounded-lg border border-slate-700 focus:border-pink-500 text-sm outline-none transition-all placeholder:text-slate-500"
                          autoFocus
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setOpenPriceInput(null);
                            setPrice("");
                          }}
                          className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-lg transition-colors text-xs font-medium border border-slate-700"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={async () => {
                            if (!price || Number(price) <= 0) {
                              setShowErrorPopup(true);
                              setTimeout(() => setShowErrorPopup(false), 2000);
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
                          className="flex-1 bg-pink-600 hover:bg-pink-500 text-white px-3 py-2 rounded-lg transition-colors text-xs font-semibold shadow-md shadow-pink-600/20"
                        >
                          Confirmar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ),
            )}

        {/* Estado vacío */}
        {selectedCategory &&
          isOfferingCategory(selectedCategory) &&
          selectedCategory.types.filter((service: OfferingType) => {
            if (recentlyAdded === service.id) return true;
            return !clientOfferings.some(
              (co) => co.baseType?.id === service.id,
            );
          }).length === 0 && (
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-800/20 text-center">
              <p className="text-slate-400 text-sm font-medium">
                No quedan servicios de plantilla disponibles para agregar en esta categoría.
              </p>
            </div>
          )}
      </div>

      {inWizard && (
        <div className="pt-4 mt-4 flex justify-end border-t border-slate-800">
          <button
            onClick={() => {
              if (setStep) {
                setStep(6);
              }
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

      {/* Error Popup Moderno */}
      {showErrorPopup && (
        <div className="fixed inset-0 backdrop-blur-md bg-slate-950/60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="border border-rose-500/40 bg-slate-900 text-slate-100 rounded-2xl shadow-2xl p-5 flex items-center gap-3 max-w-sm w-full">
            <FiAlertCircle className="text-rose-400 text-2xl shrink-0" />
            <span className="font-medium text-sm">
              Debes ingresar un precio válido
            </span>
          </div>
        </div>
      )}
    </div>
  );
}