"use client";
import React, { useState } from "react";
import { apiPatch } from "@/app/lib/apiPatch";
import { useRouter } from "next/navigation";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { useUserEstablishment } from "@/app/hooks/useUserEstablishment";

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

  console.log("active: ", activeEstablishment);

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
        },
      );

      setIsStaff(response.actsAsStaff);

      // 👇 Avanzamos siempre al paso 4
      setStep(4);
      router.push("/dashboard/initial-setup?step=4");
    } catch (error) {
      console.error("Error actualizando staff status:", error);
      alert("No se pudo actualizar el estado de staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 text-center">
      <p className="text-lg text-white font-medium">
        ¿Quieres que tu cuenta funcione además de administrador como parte del{" "}
        <strong>staff</strong> en este establecimiento?
      </p>

      {/* Toggle más grande */}
      <label className="flex items-center gap-3 cursor-pointer justify-center">
        <div
          onClick={() => setIsStaff(!isStaff)}
          className={`w-16 h-8 flex items-center rounded-full p-1 transition-colors ${
            isStaff ? "bg-green-500" : "bg-gray-400"
          }`}
        >
          <div
            className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
              isStaff ? "translate-x-8" : "translate-x-0"
            }`}
          />
        </div>
        <span className="text-xl font-semibold">{isStaff ? "SI" : "NO"}</span>
      </label>

      {/* Botón de confirmación */}
      <button
        onClick={handleConfirm}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Confirmar"}
      </button>
    </div>
  );
};

export default ActsStaffToggle;
