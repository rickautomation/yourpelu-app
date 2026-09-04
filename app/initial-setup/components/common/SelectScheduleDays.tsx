"use client";

import { useEstablishment } from "@/app/context/EstablishmentContext";
import { apiPost } from "@/app/lib/apiPost";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { apiGet } from "@/app/lib/apiGet";

type Establishment = {
  id: string;
  name: string;
  address?: string;
  phoneNumber?: string;
  bookingEnabled: boolean;
  profile?: ProfileData;
  type?: EstablishmentType;
  slug: string;
  bookingLink?: string;
};

type ProfileData = {
  id: string;
  lema?: string;
  description?: string;
  openingHours?: string;
  adressCoordinates?: string;
  logoUrl?: string;
  websiteUrl?: string | null;
  images?: EstablishmentImage[];
  schedules?: Schedule[];
};

type EstablishmentImage = { id: string; imageUrl: string };

interface TimeRange {
  id: string;
  start: string;
  end: string;
}

interface Schedule {
  id: string;
  dayOfWeek: number;
  timeRanges: TimeRange[];
}

type EstablishmentType = {
  id: string;
  name: string;
  description: string;
};

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

interface StepSixProps {
  setStep: (step: number) => void;
  user: User;
}

const SelectScheduleDays: React.FC<StepSixProps> = ({ setStep, user }) => {
  const router = useRouter();
  const { activeEstablishment, setActiveEstablishment } = useEstablishment();

  const daysOfWeek = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const selectWeekdays = () => {
    setSelectedDays(["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]);
  };

  const handleAddScheduleDays = async () => {
    if (!activeEstablishment?.profile?.id) {
      alert("Todavía no se creó el establecimiento");
      return;
    }

    try {
      setIsSubmitting(true);

      const dayMap: Record<string, number> = {
        Lunes: 1,
        Martes: 2,
        Miércoles: 3,
        Jueves: 4,
        Viernes: 5,
        Sábado: 6,
        Domingo: 7,
      };

      const days = selectedDays.map((d) => dayMap[d]);
      await addScheduleDays(activeEstablishment.profile.id, days);

      const response = await apiGet<Establishment>(
        `/establishment/${activeEstablishment.id}`
      );
      setActiveEstablishment(response);

      setStep(7);
      router.push("/initial-setup?step=7");
    } catch (error) {
      console.error("Error agregando días de atención:", error);
      alert("No se pudieron guardar los días de atención");
    } finally {
      setIsSubmitting(false);
    }
  };

  async function addScheduleDays(profileId: string, days: number[]) {
    return apiPost(`/establishment/${profileId}/schedule-days`, { days });
  }

  return (
    <div className="max-w-lg mx-auto text-center py-2">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
        Selecciona los días de atención
      </h2>
      <p className="text-gray-300 mb-6 text-sm sm:text-base leading-relaxed">
        Elige los días en los que tu establecimiento estará abierto al público
      </p>

      {/* Botón rápido Lunes a Viernes */}
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={selectWeekdays}
          className="text-xs text-pink-400 hover:text-pink-300 font-medium transition-colors cursor-pointer underline underline-offset-4"
        >
          Seleccionar Lunes a Viernes
        </button>
      </div>

      {/* Grid de días */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {daysOfWeek.map((day) => {
          const isSelected = selectedDays.includes(day);
          return (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`py-3.5 px-4 rounded-xl border font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 select-none ${
                isSelected
                  ? "bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/20 scale-[1.02]"
                  : "bg-white/5 border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/10"
              }`}
            >
              <span>{day}</span>
            </button>
          );
        })}
      </div>

      {/* Botón Guardar */}
      <button
        onClick={handleAddScheduleDays}
        disabled={isSubmitting || selectedDays.length === 0}
        className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-500/40 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-pink-500/25 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Guardando días...</span>
          </>
        ) : (
          <span>Continuar</span>
        )}
      </button>
    </div>
  );
};

export default SelectScheduleDays;