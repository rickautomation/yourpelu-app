"use client";

import React, { useState } from "react";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { apiDelete } from "@/app/lib/apiDelete";
import { useRouter } from "next/navigation";
import { apiGet } from "@/app/lib/apiGet";

interface ActionButtonsProps {
  setStep: (step: number) => void;
}

const SchedulesConfirm: React.FC<ActionButtonsProps> = ({ setStep }) => {
  const { activeEstablishment, setActiveEstablishment } = useEstablishment();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  // Mapeo corregido: Soporta tanto 0 como 7 para Domingo
  const dayNames: Record<number, string> = {
    1: "Lunes",
    2: "Martes",
    3: "Miércoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado",
    7: "Domingo",
    0: "Domingo",
  };

  // Ordenar días: Lunes (1) a Domingo (7 u 0)
  const schedules = (activeEstablishment?.profile?.schedules || [])
    .filter((sch) => sch.timeRanges && sch.timeRanges.length > 0)
    .sort((a, b) => {
      const dayA = a.dayOfWeek === 0 ? 7 : a.dayOfWeek;
      const dayB = b.dayOfWeek === 0 ? 7 : b.dayOfWeek;
      return dayA - dayB;
    });

  const handleContinue = () => {
    if (setStep) {
      setStep(9);
    }
    router.push("/initial-setup?step=9");
  };

  const handleEdit = async () => {
    if (!activeEstablishment?.id) return;

    try {
      setIsDeleting(true);

      // Borrar horarios configurados
      await apiDelete<{ ok: boolean }>(
        `/establishment/${activeEstablishment.id}/schedules`
      );

      // Refrescar el estado del establecimiento en el contexto global
      const updatedEstablishment = await apiGet<any>(
        `/establishment/${activeEstablishment.id}`
      );
      setActiveEstablishment(updatedEstablishment);

      // Redirigir al paso 6 para seleccionar días nuevamente
      setStep(6);
      router.push("/initial-setup?step=6");
    } catch (err: any) {
      console.error(err);
      alert(`Error al borrar horarios: ${err.message || err}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto text-center py-2">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
        Confirma tus horarios
      </h2>
      <p className="text-gray-300 mb-6 text-sm sm:text-base leading-relaxed">
        Revisa los horarios asignados antes de finalizar la configuración
      </p>

      {/* Tarjeta de Resumen de Horarios */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 mb-8 text-left space-y-3 shadow-lg">
        {schedules.length === 0 ? (
          <p className="text-gray-400 text-center py-4 text-sm">
            No hay horarios configurados todavía.
          </p>
        ) : (
          schedules.map((sch) => (
            <div
              key={sch.id}
              className="flex items-center justify-between py-2 border-b border-white/5 last:border-none"
            >
              <span className="font-semibold text-white text-sm sm:text-base w-28">
                {dayNames[sch.dayOfWeek] || "Día"}
              </span>
              <div className="text-right text-pink-400 font-medium text-xs sm:text-sm">
                {sch.timeRanges
                  .map((tr) => `${tr.start} a ${tr.end}`)
                  .join(" y de ")}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Acciones */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={handleEdit}
          disabled={isDeleting}
          className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Limpiando...</span>
            </>
          ) : (
            <span>Editar</span>
          )}
        </button>

        <button
          type="button"
          onClick={handleContinue}
          disabled={isDeleting}
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-pink-500/25 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          <span>Continuar</span>
        </button>
      </div>
    </div>
  );
};

export default SchedulesConfirm;