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

interface StepSixProps {
  setStep: (step: number) => void;
  user: User;
}

const StepSix: React.FC<StepSixProps> = ({ setStep, user }) => {
  const router = useRouter();
  const { activeEstablishment } = useUserEstablishment(user);

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

  const handleAddScheduleDays = async () => {
    if (activeEstablishment?.profile?.id) {
      // Mapeamos nombres de días a números (ej: lunes=1, domingo=7)
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
      router.refresh();

      setStep(7); // avanzar al siguiente paso
      router.push("/dashboard/initial-setup?step=7");
    } else {
      router.refresh();
      alert("Todavía no se creó el establecimiento");
    }
  };

  async function addScheduleDays(profileId: string, days: number[]) {
    return apiPost(`/establishment/${profileId}/schedule-days`, { days });
  }

  return (
    <div className="text-center p-4">
      <h2 className="text-xl font-semibold mb-4">
        Seleccioná los días de atención
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            onClick={() =>
              setSelectedDays((prev) =>
                prev.includes(day)
                  ? prev.filter((d) => d !== day)
                  : [...prev, day],
              )
            }
            className={`cursor-pointer border border-pink-600 text-pink-600 rounded p-4 font-medium transition-colors
              ${selectedDays.includes(day) ? "bg-pink-600 text-white" : ""}`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="flex justify-center p-4 mt-8">
        <button
          className="bg-pink-600 px-12 py-2 rounded text-lg"
          onClick={handleAddScheduleDays}
        >
          Hecho
        </button>
      </div>
    </div>
  );
};

export default StepSix;
