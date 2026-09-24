"use client";

import React, { useEffect } from "react";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { useRouter } from "next/navigation";
import { useSchedules } from "@/app/hooks/useSchedules";

interface SchedulesConfirmProps {
  setStep?: (step: number) => void;
}

const SchedulesConfirm: React.FC<SchedulesConfirmProps> = ({ setStep }) => {
  const { activeEstablishment } = useEstablishment();
  const router = useRouter();
  const { schedules, isLoading, isDeleting, fetchSchedulesByEstablishment, clearSchedules } = useSchedules();

  const dayNames: Record<number, string> = {
    1: "Lunes",
    2: "Martes",
    3: "Miércoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado",
    0: "Domingo",
  };

  useEffect(() => {
    if (activeEstablishment?.id) {
      fetchSchedulesByEstablishment(activeEstablishment.id);
    }
  }, [activeEstablishment?.id, fetchSchedulesByEstablishment]);

  // CORRECCIÓN: Ordenamos todos los schedules que devolvió la API (que son los días seleccionados)
  const sortedSchedules = [...schedules].sort((a, b) => {
    const dayA = a.dayOfWeek === 0 ? 7 : a.dayOfWeek;
    const dayB = b.dayOfWeek === 0 ? 7 : b.dayOfWeek;
    return dayA - dayB;
  });

  const handleContinue = () => {
    if (setStep) setStep(8); // Siguiente paso (donde configuras los timeRanges)
    router.push("/initial-setup?step=8");
  };

  const handleEdit = async () => {
    if (!activeEstablishment?.id) return;

    try {
      // Borra los horarios usando el endpoint DELETE /schedules/establishment/:establishmentId
      await clearSchedules();

      // Vuelve al paso 6 para seleccionar los días nuevamente
      if (setStep) setStep(6);
      router.push("/initial-setup?step=6");
    } catch (err: any) {
      console.error(err);
      alert(`Error al reiniciar horarios: ${err.message || err}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto text-center py-2">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
        Confirma tus días de atención
      </h2>
      <p className="text-gray-300 mb-6 text-sm sm:text-base leading-relaxed">
        Revisa los días seleccionados antes de configurar sus horarios
      </p>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 mb-8 text-left space-y-3 shadow-lg">
        {sortedSchedules.length === 0 ? (
          <p className="text-gray-400 text-center py-4 text-sm">
            No hay días seleccionados todavía.
          </p>
        ) : (
          sortedSchedules.map((sch) => (
            <div
              key={sch.id || sch.dayOfWeek}
              className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-none"
            >
              <span className="font-semibold text-white text-sm sm:text-base">
                {dayNames[sch.dayOfWeek] || "Día"}
              </span>
              <span className="text-emerald-400 font-medium text-xs sm:text-sm bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                Seleccionado
              </span>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={handleEdit}
          disabled={isDeleting}
          className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 text-sm"
        >
          {isDeleting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Reiniciando...</span>
            </>
          ) : (
            <span>Cambiar días</span>
          )}
        </button>

        <button
          type="button"
          onClick={handleContinue}
          disabled={isDeleting || sortedSchedules.length === 0}
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-pink-500/25 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed text-sm"
        >
          <span>Continuar</span>
        </button>
      </div>
    </div>
  );
};

export default SchedulesConfirm;