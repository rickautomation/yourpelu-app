"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/app/lib/apiPost";
import { useUserEstablishment } from "@/app/hooks/useUserEstablishment";

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

const StepFive: React.FC<StepFiveProps> = ({ setStep, user }) => {
  const router = useRouter();
  const { activeEstablishment } = useUserEstablishment(user);

  console.log("active :", activeEstablishment)

  const [bookingEnabled, setBookingEnabled] = useState<boolean | null>(null);

  async function enableBooking(establishmentId: string) {
    return apiPost(`/establishment/${establishmentId}/enable-booking`, {});
  }

  return (
    <div className="text-center p-4">
      <h2 className="text-xl font-semibold mb-4">
        ¿Deseas manejar turnos desde la app?
      </h2>

      <div className="flex justify-center gap-4">
        <button
          type="button"
          onClick={() => setBookingEnabled(true)}
          className={`border border-pink-600 px-6 py-2 rounded font-medium transition-colors
            ${bookingEnabled === true ? "bg-pink-600 text-white" : ""}`}
        >
          Sí
        </button>
        <button
          type="button"
          onClick={async () => {
            setBookingEnabled(false);
            setStep(8);
            router.push("/dashboard/initial-setup?step=8");
          }}
          className={`border border-pink-600 px-6 py-2 rounded font-medium transition-colors
            ${bookingEnabled === false ? "bg-pink-600 text-white" : ""}`}
        >
          No
        </button>
      </div>

      <div className="p-4 mt-8">
        <button
          className="bg-pink-600 px-8 py-2 rounded text-lg"
          onClick={async () => {
              const establishmentId = activeEstablishment?.id;

              if (establishmentId) {
                await enableBooking(establishmentId);
                setStep(6);
                router.push("/dashboard/initial-setup?step=6");
              } else {
                alert("Todavía no se creó el establecimiento");
              }
          }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default StepFive;
