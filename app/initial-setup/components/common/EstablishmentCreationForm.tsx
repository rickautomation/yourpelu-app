"use client";

import { apiPost } from "@/app/lib/apiPost";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { FiCheckCircle } from "react-icons/fi";

interface CurrentEstablishment {
  id: string;
  userId: string;
  establishmentId: string;
  sessionId: string;
  createdAt: string;
  establishment: Establishment;
}

export interface Establishment {
  id: string;
  establishmentId?: string;
  slug: string;
  name: string;
  phoneNumber?: string;
  address?: string;
  bookingEnabled: boolean;
}

interface StepTwoProps {
  userId: string;
  sessionId: string;
  selectedType: string;
  setStep: (step: number) => void;
}

const EstablishmentCreationForm: React.FC<StepTwoProps> = ({
  userId,
  sessionId,
  selectedType,
  setStep,
}) => {
  const { setActiveEstablishment } = useEstablishment();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await apiPost<{ establishment: CurrentEstablishment }>(
        "/establishment",
        {
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          userId,
          sessionId,
          typeId: selectedType,
        }
      );

      const currentEstablishment = response.establishment;
      const establishment = currentEstablishment.establishment;

      await apiPost("/current-establishments/set", {
        userId,
        establishmentId: establishment.id,
        sessionId,
      });

      setActiveEstablishment(establishment);
      window.dispatchEvent(new Event("barbershop-changed"));
      router.refresh();

      setShowPopup(true);

      setTimeout(() => {
        setStep(3);
        router.push("/initial-setup?step=3");
      }, 1500);
    } catch (error) {
      console.error("Error creando establecimiento:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-white mb-2 tracking-tight">
        Vamos a darle vida a tu establecimiento
      </h2>
      <p className="text-gray-300 text-center mb-8 text-sm sm:text-base">
        Ingresa los datos principales con los que tus clientes te identificarán
      </p>

      <form
        className="flex flex-col gap-5"
        onSubmit={async (e) => {
          e.preventDefault();
          await handleSubmit();
        }}
      >
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider pl-1">
            Nombre comercial
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Ej: Peluquería Barber Studio"
            required
            className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all text-sm sm:text-base"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider pl-1">
            Dirección
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Ej: Av. Principal 1234, Córdoba"
            required
            className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all text-sm sm:text-base"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider pl-1">
            Número de contacto / WhatsApp
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            placeholder="Ej: +54 9 11 1234 5678"
            required
            className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all text-sm sm:text-base"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-500/50 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-pink-500/25 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Creando...</span>
            </>
          ) : (
            <span>Crear establecimiento</span>
          )}
        </button>
      </form>

      {/* Popup de Éxito Flotante */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in duration-200">
          <div className="bg-brandBlue border border-emerald-500/30 text-white rounded-2xl shadow-2xl p-6 flex items-center gap-4 max-w-sm w-full">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
              <FiCheckCircle className="text-2xl" />
            </div>
            <div>
              <p className="font-bold text-base text-white">¡Todo listo!</p>
              <p className="text-xs text-gray-300">Establecimiento creado con éxito.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstablishmentCreationForm;