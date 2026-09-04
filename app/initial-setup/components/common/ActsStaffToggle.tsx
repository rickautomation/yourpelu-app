"use client";

import React, { useState } from "react";
import { apiPatch } from "@/app/lib/apiPatch";
import { useRouter } from "next/navigation";
import { useEstablishment } from "@/app/context/EstablishmentContext";

interface User {
  id: string;
  name: string;
  lastname: string;
  phoneNumber: string;
  email: string;
  rol: string;
}

interface UserStaffEstablishment {
  id: string;
  userId: string;
  establishmentId: string;
  actsAsStaff: boolean;
}

interface StaffToggleProps {
  user: User;
  setStep: (step: number) => void;
}

const ActsStaffToggle: React.FC<StaffToggleProps> = ({ user, setStep }) => {
  const [isStaff, setIsStaff] = useState(true);
  const [loading, setLoading] = useState(false);

  const { activeEstablishment } = useEstablishment();
  const router = useRouter();

  const handleConfirm = async () => {
    if (!activeEstablishment) {
      alert("No hay establecimiento activo");
      return;
    }

    try {
      setLoading(true);
      const response = await apiPatch<UserStaffEstablishment>(
        `/user-staff-establishments/${user.id}/${activeEstablishment.id}`,
        {
          actsAsStaff: isStaff,
        }
      );

      setIsStaff(response.actsAsStaff);

      // Avanzar al paso 4
      setStep(4);
      router.push("/initial-setup?step=4");
    } catch (error) {
      console.error("Error actualizando estado de staff:", error);
      alert("No se pudo actualizar el estado de staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto text-center">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
        ¿Atenderás clientes en este local?
      </h2>

      <p className="text-gray-300 mb-8 text-sm sm:text-base leading-relaxed">
        Indica si tu usuario también figurará en la agenda de turnos como parte del equipo de <strong className="text-white font-semibold">staff</strong>, además de administrar la plataforma.
      </p>

      {/* Switch / Toggle estilizado */}
      <div className="flex flex-col items-center gap-6 mb-10">
        <div
          onClick={() => setIsStaff(!isStaff)}
          className="flex items-center gap-4 cursor-pointer select-none group"
        >
          <div
            className={`w-16 h-9 flex items-center rounded-full p-1 transition-colors duration-200 ${
              isStaff ? "bg-pink-500" : "bg-white/20"
            }`}
          >
            <div
              className={`bg-white w-7 h-7 rounded-full shadow-md transform transition-transform duration-200 ${
                isStaff ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </div>

          <span
            className={`text-xl font-bold tracking-wide transition-colors ${
              isStaff ? "text-pink-400" : "text-gray-400"
            }`}
          >
            {isStaff ? "SÍ, Atenderé clientes" : "NO, Solo administraré"}
          </span>
        </div>
      </div>

      {/* Botón de confirmación */}
      <button
        onClick={handleConfirm}
        disabled={loading}
        className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-500/50 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-pink-500/25 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Guardando preferencia...</span>
          </>
        ) : (
          <span>Confirmar y continuar</span>
        )}
      </button>
    </div>
  );
};

export default ActsStaffToggle;