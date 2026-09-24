"use client";

import React, { useEffect, useState } from "react";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { useRouter } from "next/navigation";
import { useSchedules } from "@/app/hooks/useSchedules";
import CustomTimeInput from "./CustomTimeInput";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";

interface TimeRangesConfirmProps {
  setStep?: (step: number) => void;
}

const TimeRangesConfirm: React.FC<TimeRangesConfirmProps> = ({ setStep }) => {
  const { activeEstablishment } = useEstablishment();
  const router = useRouter();
  const { 
    schedules, 
    isLoading, 
    isSubmitting, 
    fetchSchedulesByEstablishment, 
    updateDayIntervals 
  } = useSchedules();

  const dayNames: Record<number, string> = {
    1: "Lunes",
    2: "Martes",
    3: "Miércoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado",
    0: "Domingo",
  };

  // Estados para el Modal/Pop-up de edición
  const [editingSchedule, setEditingSchedule] = useState<any | null>(null);
  const [editMode, setEditMode] = useState<"continuo" | "dividido">("continuo");
  const [editForm, setEditForm] = useState<{
    start1?: string; end1?: string; start2?: string; end2?: string;
  }>({});

  useEffect(() => {
    if (activeEstablishment?.id) {
      fetchSchedulesByEstablishment(activeEstablishment.id);
    }
  }, [activeEstablishment?.id, fetchSchedulesByEstablishment]);

  // Filtrar y ordenar los días que ya tienen timeRanges configurados
  const configuredSchedules = [...schedules]
    .filter((sch) => sch.timeRanges && sch.timeRanges.length > 0)
    .sort((a, b) => {
      const dayA = a.dayOfWeek === 0 ? 7 : a.dayOfWeek;
      const dayB = b.dayOfWeek === 0 ? 7 : b.dayOfWeek;
      return dayA - dayB;
    });

  // Viajar al paso final (10)
  const handleFinalContinue = () => {
    if (setStep) setStep(10);
    router.push("/initial-setup?step=10");
  };

  // Abrir el Pop-up y configurar el estado inicial según el día seleccionado
  const openEditModal = (sch: any) => {
    setEditingSchedule(sch);
    const ranges = sch.timeRanges || [];
    
    if (ranges.length > 1) {
      setEditMode("dividido");
      setEditForm({
        start1: ranges[0]?.start || "",
        end1: ranges[0]?.end || "",
        start2: ranges[1]?.start || "",
        end2: ranges[1]?.end || "",
      });
    } else {
      setEditMode("continuo");
      setEditForm({
        start1: ranges[0]?.start || "",
        end1: ranges[0]?.end || "",
        start2: "",
        end2: "",
      });
    }
  };

  // Guardar los cambios desde el Pop-up
  const saveModalChanges = async () => {
    if (!editingSchedule) return;

    if (editMode === "continuo" && (!editForm.start1 || !editForm.end1)) {
      alert("Completa el horario de inicio y fin");
      return;
    }
    if (editMode === "dividido" && (!editForm.start1 || !editForm.end1 || !editForm.start2 || !editForm.end2)) {
      alert("Completa todos los rangos del horario dividido");
      return;
    }

    const intervals: { start: string; end: string }[] = [];
    if (editForm.start1 && editForm.end1) {
      intervals.push({ start: editForm.start1, end: editForm.end1 });
    }
    if (editMode === "dividido" && editForm.start2 && editForm.end2) {
      intervals.push({ start: editForm.start2, end: editForm.end2 });
    }

    try {
      await updateDayIntervals(editingSchedule.dayOfWeek, intervals);
      setEditingSchedule(null);
    } catch (err: any) {
      console.error(err);
      alert(`Error al actualizar el rango horario: ${err.message || err}`);
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
    <div className="max-w-lg mx-auto text-center relative">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
        Confirma tus horarios
      </h2>
      <p className="text-gray-300 mb-3 text-sm sm:text-base leading-relaxed">
        Revisa los rangos horarios establecidos o modifícalos antes de finalizar
      </p>

      {/* Listado principal con horarios debajo */}
      <div className="bg-white/5 border border-white/10 rounded-2xl px-4 sm:p-5 mb-4 text-left space-y-2 shadow-lg">
        {configuredSchedules.length === 0 ? (
          <p className="text-gray-400 text-center py-4 text-sm">
            No hay horarios seteados todavía.
          </p>
        ) : (
          configuredSchedules.map((sch) => {
            const dayLabel = dayNames[sch.dayOfWeek] || "Día";

            return (
              <div
                key={sch.id || sch.dayOfWeek}
                className="py-3.5 border-b border-white/5 last:border-none flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  {/* Nombre del día */}
                  <span className="font-semibold text-white text-base sm:text-lg">
                    {dayLabel}
                  </span>

                  {/* Botón para abrir el pop-up de edición */}
                  <button
                    type="button"
                    onClick={() => openEditModal(sch)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-pink-400 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <FiEdit2 size={13} />
                    <span>Modificar</span>
                  </button>
                </div>

                {/* Horarios debajo del día */}
                <div className="text-gray-300 text-sm font-medium pl-1">
                  {sch.timeRanges
                    .map((tr: any) => `${tr.start} a ${tr.end}`)
                    .join(" y de ")}
                </div>
              </div>
            );
          })
        )}
      </div>

      <button
        type="button"
        onClick={handleFinalContinue}
        disabled={configuredSchedules.length === 0}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-pink-500/25 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
      >
        <span>Confirmar Horarios</span>
      </button>

      {/* Pop-up / Modal de Edición */}
      {editingSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-6">
          <div className="bg-luminiBrandBlue border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-left space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-xs text-pink-400 font-semibold uppercase tracking-wider">
                  Editando horario
                </span>
                <h3 className="text-xl font-bold text-white">
                  {dayNames[editingSchedule.dayOfWeek]}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingSchedule(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Selector de Modo (Continuo / Dividido) */}
            <div className="flex gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={() => setEditMode("continuo")}
                className={`flex-1 text-xs py-2 rounded-xl border font-medium transition-colors cursor-pointer ${
                  editMode === "continuo"
                    ? "bg-pink-500 border-pink-500 text-white shadow-md shadow-pink-500/20"
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                Continuo
              </button>
              <button
                type="button"
                onClick={() => setEditMode("dividido")}
                className={`flex-1 text-xs py-2 rounded-xl border font-medium transition-colors cursor-pointer ${
                  editMode === "dividido"
                    ? "bg-pink-500 border-pink-500 text-white shadow-md shadow-pink-500/20"
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                Dividido
              </button>
            </div>

            {/* Campos de hora */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-2 items-center justify-center">
                <CustomTimeInput
                  value={editForm.start1 || ""}
                  onChange={(val) => setEditForm({ ...editForm, start1: val })}
                />
                <span className="text-gray-400 text-xs font-medium">a</span>
                <CustomTimeInput
                  value={editForm.end1 || ""}
                  onChange={(val) => setEditForm({ ...editForm, end1: val })}
                />
              </div>

              {editMode === "dividido" && (
                <div className="flex gap-2 items-center justify-center">
                  <CustomTimeInput
                    value={editForm.start2 || ""}
                    onChange={(val) => setEditForm({ ...editForm, start2: val })}
                  />
                  <span className="text-gray-400 text-xs font-medium">a</span>
                  <CustomTimeInput
                    value={editForm.end2 || ""}
                    onChange={(val) => setEditForm({ ...editForm, end2: val })}
                  />
                </div>
              )}
            </div>

            {/* Botones de acción del Modal */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingSchedule(null)}
                className="flex-1 py-2.5 px-4 text-xs font-semibold bg-white/10 text-gray-300 rounded-xl hover:bg-white/15 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={saveModalChanges}
                disabled={isSubmitting}
                className="flex-1 py-2.5 px-4 text-xs font-semibold bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md shadow-pink-500/20"
              >
                <FiCheck size={15} />
                <span>Guardar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeRangesConfirm;