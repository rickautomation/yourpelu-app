"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/app/lib/apiPost";
import { useEstablishment } from "@/app/context/EstablishmentContext";

interface UserProfile {
  id: string;
  avatarUrl?: string;
  bio?: string;
  birthDate?: string;
  address?: string;
}

interface User {
  id: string;
  name: string;
  lastname: string;
  phoneNumber: string;
  email: string;
  rol: string;
  userProfile?: UserProfile;
}

interface StepFiveProps {
  setStep: (step: number) => void;
  user: User;
}

const BookingEnabled: React.FC<StepFiveProps> = ({ setStep, user }) => {
  const router = useRouter();
  const { activeEstablishment, reload } = useEstablishment();

  const [bookingEnabled, setBookingEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  async function enableBooking(establishmentId: string) {
    return apiPost(`/establishment/${establishmentId}/enable-booking`, {});
  }

  const handleConfirm = async () => {
    const establishmentId = activeEstablishment?.id;

    if (!establishmentId) {
      alert("Todavía no se creó el establecimiento");
      return;
    }

    try {
      setLoading(true);

      if (bookingEnabled === true) {
        await enableBooking(establishmentId);
        reload();
      }

      setStep(6);
      router.push("/initial-setup?step=6");
    } catch (error) {
      console.error("Error al guardar preferencia de turnos:", error);
      alert("Ocurrió un error al guardar la preferencia.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto text-center px-4 py-4">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
        ¿Deseas manejar turnos desde la app?
      </h2>
      <p className="text-gray-300 mb-8 text-sm sm:text-base leading-relaxed">
        Habilita la reserva en línea para permitir que tus clientes agenden citas automáticamente.
      </p>

      {/* Opciones Si / No */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          type="button"
          onClick={() => setBookingEnabled(true)}
          className={`py-4 px-6 rounded-2xl border font-bold transition-all text-base sm:text-lg flex flex-col items-center justify-center gap-1 cursor-pointer ${
            bookingEnabled === true
              ? "bg-pink-500/20 border-pink-500 text-white shadow-lg shadow-pink-500/10 scale-[1.02]"
              : "bg-white/5 border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/10"
          }`}
        >
          <span>Sí, habilitar</span>
          <span className="text-xs font-normal text-gray-400">
            Reservas en línea activas
          </span>
        </button>

        <button
          type="button"
          onClick={() => setBookingEnabled(false)}
          className={`py-4 px-6 rounded-2xl border font-bold transition-all text-base sm:text-lg flex flex-col items-center justify-center gap-1 cursor-pointer ${
            bookingEnabled === false
              ? "bg-pink-500/20 border-pink-500 text-white shadow-lg shadow-pink-500/10 scale-[1.02]"
              : "bg-white/5 border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/10"
          }`}
        >
          <span>No por ahora</span>
          <span className="text-xs font-normal text-gray-400">
            Solo gestión interna
          </span>
        </button>
      </div>

      {/* Botón Continuar */}
      <button
        onClick={handleConfirm}
        disabled={bookingEnabled === null || loading}
        className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-500/40 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-pink-500/25 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Guardando...</span>
          </>
        ) : (
          <span>Continuar</span>
        )}
      </button>
    </div>
  );
};

export default BookingEnabled;