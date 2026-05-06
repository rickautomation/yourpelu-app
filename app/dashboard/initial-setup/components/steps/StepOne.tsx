"use client";
import { apiGet } from "@/app/lib/apiGet";
import React, { useEffect, useState } from "react";

interface StepOneProps {
  user: User;
  setStep: (step: number) => void;
  selectedType: string | null;
  setSelectedType: (type: string) => void;
}

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

type EstablishmentType = {
  id: string;
  name: string;
  description: string;
};

const StepOne: React.FC<StepOneProps> = ({
  user,
  setStep,
  selectedType,
  setSelectedType,
}) => {
  const [types, setTypes] = useState<EstablishmentType[]>([]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const fetchedTypes =
          await apiGet<EstablishmentType[]>(`/establishment-types`);
        setTypes(fetchedTypes);
      } catch (error) {
        console.error("Error al obtener tipos de establecimiento:", error);
      }
    };

    fetchTypes();
  }, []);

  return (
    <div className="px-4 py-3">
      <h2 className="text-lg text-center font-bold mb-4">
        Elige el tipo de establecimiento
      </h2>

      <div className="flex flex-col gap-3">
        {types.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setSelectedType(t.id); // 👈 actualiza estado en el padre
              setStep(2);
            }}
            className={`bg-darkBrandBlue shadow-lg text-white px-4 py-4 rounded hover:bg-pink-500 transition-colors font-semibold ${
              selectedType === t.id ? "ring-2 ring-pink-400" : ""
            }`}
          >
            <p>{t.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StepOne;
