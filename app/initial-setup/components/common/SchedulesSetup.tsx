"use client";

import { useEstablishment } from "@/app/context/EstablishmentContext";
import React, { useEffect, useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import CustomTimeInput from "./CustomTimeInput";
import { useRouter } from "next/navigation";
import { useSchedules } from "@/app/hooks/useSchedules";

interface StepSevenProps {
  setStep?: (step: number) => void;
}

const SchedulesSetup: React.FC<StepSevenProps> = ({ setStep }) => {
  const { activeEstablishment } = useEstablishment();
  const router = useRouter();
  const { schedules, isLoading, isSubmitting, fetchSchedulesByEstablishment, updateDayIntervals } = useSchedules();

  const dayNames: Record<number, string> = {
    1: "Lunes", 2: "Martes", 3: "Miércoles", 4: "Jueves", 5: "Viernes", 6: "Sábado", 0: "Domingo",
  };

  const [showPopup, setShowPopup] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [mode, setMode] = useState<"continuo" | "dividido">("continuo");

  const [schedule, setSchedule] = useState<{
    start1?: string; end1?: string; start2?: string; end2?: string;
  }>({});

  // Cargar los horarios desde la nueva API al montar o cambiar de establecimiento
  useEffect(() => {
    if (activeEstablishment?.id) {
      fetchSchedulesByEstablishment(activeEstablishment.id);
    }
  }, [activeEstablishment?.id, fetchSchedulesByEstablishment]);

  // Ordenar los horarios de Lunes a Domingo
  const sortedSchedules = [...schedules].sort((a, b) => {
    const dayA = a.dayOfWeek === 0 ? 7 : a.dayOfWeek;
    const dayB = b.dayOfWeek === 0 ? 7 : b.dayOfWeek;
    return dayA - dayB;
  });

  const pendingSchedules = sortedSchedules.filter(
    (sch) => !sch.timeRanges || sch.timeRanges.length === 0
  );

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const selectAllPendingDays = () => {
    const pendingNames = pendingSchedules.map((sch) => dayNames[sch.dayOfWeek]);
    setSelectedDays(pendingNames);
  };

  const applySchedule = async () => {
    if (selectedDays.length === 0) {
      alert("Selecciona al menos un día");
      return;
    }

    if (mode === "continuo" && (!schedule.start1 || !schedule.end1)) {
      alert("Completa el horario de inicio y fin");
      return;
    }
    if (mode === "dividido" && (!schedule.start1 || !schedule.end1 || !schedule.start2 || !schedule.end2)) {
      alert("Completa todos los rangos del horario dividido");
      return;
    }

    const intervals: { start: string; end: string }[] = [];
    if (schedule.start1 && schedule.end1) {
      intervals.push({ start: schedule.start1, end: schedule.end1 });
    }
    if (mode === "dividido" && schedule.start2 && schedule.end2) {
      intervals.push({ start: schedule.start2, end: schedule.end2 });
    }

    try {
      for (const day of selectedDays) {
        const scheduleEntity = sortedSchedules.find((sch) => dayNames[sch.dayOfWeek] === day);
        if (!scheduleEntity) continue;

        await updateDayIntervals(scheduleEntity.dayOfWeek, intervals);
      }

      setShowPopup(true);
      setSelectedDays([]);
      setSchedule({});

      setTimeout(() => {
        setShowPopup(false);
      }, 1200);
    } catch (err: any) {
      console.error(err);
      alert(`Error al guardar horarios: ${err.message || err}`);
    }
  };

  // Validar si ya están todos configurados para avanzar de paso
  useEffect(() => {
    if (sortedSchedules.length > 0 && sortedSchedules.every((sch) => sch.timeRanges?.length > 0)) {
      if (setStep) setStep(9);
      router.push("/initial-setup?step=9");
    }
  }, [sortedSchedules, setStep, router]);

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
        Configura los horarios
      </h2>
      <p className="text-gray-300 mb-6 text-sm sm:text-base leading-relaxed">
        Asigna el rango horario a los días de atención seleccionados
      </p>

      {pendingSchedules.length > 0 && (
        <div className="flex justify-end mb-3">
          <button
            type="button"
            onClick={selectAllPendingDays}
            className="text-xs text-pink-400 hover:text-pink-300 font-medium transition-colors cursor-pointer underline underline-offset-4"
          >
            Seleccionar todos los días pendientes
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {sortedSchedules.map((sch) => {
          const isConfigured = sch.timeRanges && sch.timeRanges.length > 0;
          const dayLabel = dayNames[sch.dayOfWeek] || "Día";
          const isSelected = selectedDays.includes(dayLabel);

          return (
            <button
              key={sch.id || sch.dayOfWeek}
              type="button"
              onClick={() => !isConfigured && toggleDay(dayLabel)}
              disabled={isConfigured}
              className={`py-3 px-4 rounded-xl border font-semibold text-sm transition-all cursor-pointer flex flex-col items-center justify-center gap-1 select-none ${
                isConfigured
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 opacity-60 cursor-not-allowed"
                  : isSelected
                  ? "bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/20 scale-[1.02]"
                  : "bg-white/5 border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/10"
              }`}
            >
              <span>{dayLabel}</span>
              {isConfigured && (
                <span className="text-[10px] font-normal text-emerald-400">Configurado</span>
              )}
            </button>
          );
        })}
      </div>

      {pendingSchedules.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setMode("continuo")}
              className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                mode === "continuo"
                  ? "bg-pink-500/20 border-pink-500 text-white shadow-md"
                  : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              Horario continuo
            </button>
            <button
              type="button"
              onClick={() => setMode("dividido")}
              className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                mode === "dividido"
                  ? "bg-pink-500/20 border-pink-500 text-white shadow-md"
                  : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              Horario dividido
            </button>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex gap-3 w-full bg-white/5 border border-white/10 p-3 rounded-xl items-center justify-center">
              <CustomTimeInput
                value={schedule.start1 || ""}
                onChange={(val) => setSchedule({ ...schedule, start1: val })}
              />
              <span className="text-gray-400 font-medium">a</span>
              <CustomTimeInput
                value={schedule.end1 || ""}
                onChange={(val) => setSchedule({ ...schedule, end1: val })}
              />
            </div>

            {mode === "dividido" && (
              <div className="flex gap-3 w-full bg-white/5 border border-white/10 p-3 rounded-xl items-center justify-center">
                <CustomTimeInput
                  value={schedule.start2 || ""}
                  onChange={(val) => setSchedule({ ...schedule, start2: val })}
                />
                <span className="text-gray-400 font-medium">a</span>
                <CustomTimeInput
                  value={schedule.end2 || ""}
                  onChange={(val) => setSchedule({ ...schedule, end2: val })}
                />
              </div>
            )}
          </div>

          <button
            onClick={applySchedule}
            disabled={isSubmitting || selectedDays.length === 0}
            className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-500/40 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-pink-500/25 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Guardando horarios...</span>
              </>
            ) : (
              <span>Aplicar a días seleccionados</span>
            )}
          </button>
        </>
      )}

      {showPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-brandBlue border border-emerald-500/30 text-white rounded-2xl shadow-2xl p-6 flex items-center gap-4 max-w-sm w-full">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
              <FiCheckCircle className="text-2xl" />
            </div>
            <div className="text-left">
              <p className="font-bold text-base text-white">Horarios guardados</p>
              <p className="text-xs text-gray-300">Se asignaron los rangos correctamente.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulesSetup;