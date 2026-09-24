"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSchedules } from "@/app/hooks/useSchedules";

interface User {
  id: string;
  name: string;
  lastname: string;
  phoneNumber: string;
  email: string;
  rol: string;
}

interface StepSixProps {
  setStep: (step: number) => void;
  user: User;
}

const SelectScheduleDays: React.FC<StepSixProps> = ({ setStep }) => {
  const router = useRouter();
  const { addDays, isSubmitting } = useSchedules();

  const daysOfWeek = [
    "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo",
  ];

  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const selectWeekdays = () => {
    setSelectedDays(["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]);
  };

  const handleAddScheduleDays = async () => {
    try {
      const dayMap: Record<string, number> = {
        Lunes: 1, Martes: 2, Miércoles: 3, Jueves: 4, Viernes: 5, Sábado: 6, Domingo: 0,
      };

      const days = selectedDays.map((d) => dayMap[d]);
      await addDays(days);

      setStep(7);
      router.push("/initial-setup?step=7");
    } catch (error: any) {
      console.error("Error agregando días de atención:", error);
      alert(error.message || "No se pudieron guardar los días de atención");
    }
  };

  return (
    <div className="max-w-lg mx-auto text-center py-2">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
        Selecciona los días de atención
      </h2>
      <p className="text-gray-300 mb-6 text-sm sm:text-base leading-relaxed">
        Elige los días en los que tu establecimiento estará abierto al público
      </p>

      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={selectWeekdays}
          className="text-xs text-pink-400 hover:text-pink-300 font-medium transition-colors cursor-pointer underline underline-offset-4"
        >
          Seleccionar Lunes a Viernes
        </button>
      </div>

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