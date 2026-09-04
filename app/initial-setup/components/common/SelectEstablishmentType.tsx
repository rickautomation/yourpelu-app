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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const fetchedTypes =
          await apiGet<EstablishmentType[]>(`/establishment-types`);
        setTypes(fetchedTypes);
      } catch (error) {
        console.error("Error al obtener tipos de establecimiento:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTypes();
  }, []);

  const handleSelect = (typeId: string) => {
    setSelectedType(typeId);
    setStep(2);
    router.push(`/initial-setup?step=2&type=${typeId}`);
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-white mb-2 tracking-tight">
        Selecciona el tipo de establecimiento
      </h2>
      <p className="text-gray-300 text-center mb-6 text-sm sm:text-base">
        Elige la opción que mejor describa la actividad de tu negocio
      </p>

      {/* State Loading (Skeleton) */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 w-full bg-white/5 animate-pulse rounded-2xl border border-white/5"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {types.map((t) => {
            const isSelected = selectedType === t.id;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelect(t.id)}
                className={`group w-full text-left p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer border backdrop-blur-sm ${
                  isSelected
                    ? "bg-pink-500/10 border-pink-500 shadow-lg shadow-pink-500/10 ring-1 ring-pink-500"
                    : "bg-white/5 border-white/10 hover:border-pink-500/50 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-bold text-base sm:text-lg text-white group-hover:text-pink-400 transition-colors">
                      {t.name}
                    </p>
                  </div>

                  {/* Indicador visual / Flecha */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "bg-pink-500 text-white"
                        : "bg-white/10 text-gray-400 group-hover:bg-pink-500/20 group-hover:text-pink-400"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SelectEstablishmentType;