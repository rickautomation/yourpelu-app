"use client";
import { useUserEstablishment } from "@/app/hooks/useUserEstablishment";
import { apiPost } from "@/app/lib/apiPost";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

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

interface StepSevenProps {
  setStep: (step: number) => void;
  user: User;
}

const StepSeven: React.FC<StepSevenProps> = ({ setStep, user }) => {
  const router = useRouter();
  const { activeEstablishment } = useUserEstablishment(user);

  console.log("schedules in seven: ", activeEstablishment?.profile?.schedules);

  // Mapeo de número → nombre de día
  const dayNames: Record<number, string> = {
    0: "Domingo",
    1: "Lunes",
    2: "Martes",
    3: "Miércoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado",
  };

  const dayMap: Record<string, number> = {
    Domingo: 0,
    Lunes: 1,
    Martes: 2,
    Miércoles: 3,
    Jueves: 4,
    Viernes: 5,
    Sábado: 6,
  };

  const applySchedule = async () => {
    if (selectedDays.length === 0) {
      alert("Selecciona al menos un día");
      return;
    }

    // construir intervalos
    const intervals: { start: string; end: string }[] = [];
    if (schedule.start1 && schedule.end1) {
      intervals.push({ start: schedule.start1, end: schedule.end1 });
    }
    if (schedule.start2 && schedule.end2) {
      intervals.push({ start: schedule.start2, end: schedule.end2 });
    }

    try {
      // enviar para cada día seleccionado
      for (const day of selectedDays) {
        const scheduleEntity = schedules.find(
          (sch) => dayNames[sch.dayOfWeek] === day,
        );
        if (!scheduleEntity) continue;

        await apiPost(`/establishment/${scheduleEntity.id}/time-ranges`, {
          intervals,
        });
      }

      alert("Horarios guardados correctamente");

      // 👇 refresca el componente y vuelve a cargar los datos
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      alert(`Error al guardar horarios: ${err.message}`);
    }
  };

  const schedules = (activeEstablishment?.profile?.schedules || []).sort(
    (a, b) => {
      const order = [1, 2, 3, 4, 5, 6, 0]; // Lunes primero, Domingo último
      return order.indexOf(a.dayOfWeek) - order.indexOf(b.dayOfWeek);
    },
  );

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [mode, setMode] = useState<"continuo" | "dividido">("continuo");

  const [schedule, setSchedule] = useState<{
    start1?: string;
    end1?: string;
    start2?: string;
    end2?: string;
  }>({});

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  return (
    <div className="text-center p-4">
      {schedules.some(
        (sch) => !sch.timeRanges || sch.timeRanges.length === 0,
      ) && (
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {schedules.map((sch) => {
            const isDisabled = sch.timeRanges && sch.timeRanges.length > 0;
            const dayLabel = dayNames[sch.dayOfWeek];

            return (
              <button
                key={sch.id}
                type="button"
                onClick={() => !isDisabled && toggleDay(dayLabel)}
                disabled={isDisabled}
                className={`border min-w-25 rounded p-2 text-center text-lg font-medium transition-colors
          ${selectedDays.includes(dayLabel) ? "bg-pink-600 text-white" : "border-pink-600 text-pink-600"}
          ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
              >
                {dayLabel}
              </button>
            );
          })}
        </div>
      )}

      {/* Selector de modo: solo si no están todos los días con horarios */}
      {schedules.some(
        (sch) => !sch.timeRanges || sch.timeRanges.length === 0,
      ) && (
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setMode("continuo")}
            className={`p-2 rounded border border-pink-600 font-semibold transition-colors
        ${mode === "continuo" ? "bg-pink-600 text-white" : "text-pink-600"}
      `}
          >
            Horario continuo
          </button>
          <button
            onClick={() => setMode("dividido")}
            className={`px-4 py-2 rounded border border-pink-600 font-semibold transition-colors
        ${mode === "dividido" ? "bg-pink-600 text-white" : "text-pink-600"}
      `}
          >
            Horario dividido
          </button>
        </div>
      )}

      {/* Inputs según modo: solo si faltan días sin horarios */}
      {schedules.some(
        (sch) => !sch.timeRanges || sch.timeRanges.length === 0,
      ) &&
        (mode === "continuo" ? (
          <div className="flex gap-4 w-full max-w-md mx-auto mb-6 p-3">
            <input
              type="time"
              value={schedule.start1 || ""}
              onChange={(e) =>
                setSchedule({ ...schedule, start1: e.target.value })
              }
              className="border rounded px-3 py-2 flex-1 focus:ring-2 focus:ring-pink-500"
            />
            <input
              type="time"
              value={schedule.end1 || ""}
              onChange={(e) =>
                setSchedule({ ...schedule, end1: e.target.value })
              }
              className="border rounded px-3 py-2 flex-1 focus:ring-2 focus:ring-pink-500"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full max-w-md mx-auto mb-6 p-3">
            <div className="flex gap-4 w-full">
              <input
                type="time"
                value={schedule.start1 || ""}
                onChange={(e) =>
                  setSchedule({ ...schedule, start1: e.target.value })
                }
                className="border rounded px-3 py-2 flex-1 focus:ring-2 focus:ring-pink-500"
              />
              <input
                type="time"
                value={schedule.end1 || ""}
                onChange={(e) =>
                  setSchedule({ ...schedule, end1: e.target.value })
                }
                className="border rounded px-3 py-2 flex-1 focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div className="flex gap-4 w-full">
              <input
                type="time"
                value={schedule.start2 || ""}
                onChange={(e) =>
                  setSchedule({ ...schedule, start2: e.target.value })
                }
                className="border rounded px-3 py-2 flex-1 focus:ring-2 focus:ring-pink-500"
              />
              <input
                type="time"
                value={schedule.end2 || ""}
                onChange={(e) =>
                  setSchedule({ ...schedule, end2: e.target.value })
                }
                className="border rounded px-3 py-2 flex-1 focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>
        ))}

      {/* Botón aplicar solo si hay días sin horarios */}
      {schedules.some(
        (sch) => !sch.timeRanges || sch.timeRanges.length === 0,
      ) && (
        <button
          onClick={applySchedule}
          className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700 transition-colors"
        >
          Aplicar a días seleccionados
        </button>
      )}

      <div className="mt-6 text-left max-w-md mx-auto px-2">
        {schedules
          .filter((sch) => sch.timeRanges && sch.timeRanges.length > 0)
          .map((sch) => (
            <div key={sch.id} className="mb-2 flex items-center">
              <p className="font-semibold w-24">{dayNames[sch.dayOfWeek]}</p>
              <p className="text-sm">
                {sch.timeRanges
                  .map((tr) => `${tr.start} a ${tr.end}`)
                  .join(" y de ")}
              </p>
            </div>
          ))}
      </div>

      {/* Botón continuar si todos los días tienen horarios */}
      {schedules.length > 0 &&
        schedules.every(
          (sch) => sch.timeRanges && sch.timeRanges.length > 0,
        ) && (
          <div className="mt-6 flex gap-4 w-full max-w-md mx-auto px-2">
            <button className="flex-1 bg-pink-600 text-white px-6 py-2 rounded font-semibold hover:bg-pink-700 transition-colors">
              Editar
            </button>
            <button
              onClick={() => setStep(8)} // 👈 avanza al siguiente paso
              className="flex-1 bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
            >
              Continuar
            </button>
          </div>
        )}
    </div>
  );
};

export default StepSeven;
