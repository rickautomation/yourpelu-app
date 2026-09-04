"use client";
import { apiGet } from "@/app/lib/apiGet";
import { useRouter } from "next/navigation";
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

const SelectEstablishmentType: React.FC<StepOneProps> = ({
  user,
  setStep,
  selectedType,
  setSelectedType,
}) => {
  const [types, setTypes] = useState<EstablishmentType[]>([]);
  const router = useRouter();

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
    <div className="">
      <h2 className="text-center font-bold mb-4">
        Selecciona el tipo de establecimiento
      </h2>

      <div className="flex flex-col gap-3">
        {types.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setSelectedType(t.id); // 👈 actualiza estado en el padre
              setStep(2);
              router.push(`/initial-setup?step=2&type=${t.id}`);
            }}
            className={`bg-luminiBrandBlue shadow-lg text-start text-white px-4 py-4 rounded hover:bg-pink-500 transition-colors space-y-1 ${
              selectedType === t.id ? "ring-2 ring-pink-400" : ""
            }`}
          >
            <p className="font-semibold text-pink-600">{t.name}</p>
            <p className="text-sm">{t.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectEstablishmentType;
