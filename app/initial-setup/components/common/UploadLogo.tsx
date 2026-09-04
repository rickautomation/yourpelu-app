"use client";

import React, { useState } from "react";
import { MdUploadFile } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { FiCheckCircle } from "react-icons/fi";
import { apiGet } from "@/app/lib/apiGet";

type Establishment = {
  id: string;
  name: string;
  address?: string;
  phoneNumber?: string;
  bookingEnabled: boolean;
  profile?: ProfileData;
  type?: EstablishmentType;
  slug: string;
  bookingLink?: string;
};

type ProfileData = {
  id: string;
  lema?: string;
  description?: string;
  openingHours?: string;
  adressCoordinates?: string;
  logoUrl?: string;
  websiteUrl?: string | null;
  images?: EstablishmentImage[];
  schedules?: Schedule[];
};

type EstablishmentImage = { id: string; imageUrl: string };

interface TimeRange {
  id: string;
  start: string;
  end: string;
}

interface Schedule {
  id: string;
  dayOfWeek: number;
  timeRanges: TimeRange[];
}

type EstablishmentType = {
  id: string;
  name: string;
  description: string;
};

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

interface StepThreeProps {
  setStep: (step: number) => void;
  user: User;
}

const UploadLogo: React.FC<StepThreeProps> = ({ setStep, user }) => {
  const router = useRouter();
  const { activeEstablishment, setActiveEstablishment } = useEstablishment();

  const [formData, setFormData] = useState<{
    logoFile?: File;
  }>({
    logoFile: undefined,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleNextStep = () => {
    setStep(5);
    router.push("/initial-setup?step=5");
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.logoFile || !activeEstablishment?.id) return;

    const fd = new FormData();
    fd.append("logo", formData.logoFile);

    try {
      setIsUploading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/establishment/${activeEstablishment.id}/upload-logo`,
        {
          method: "POST",
          body: fd,
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}`);
      }

      setShowPopup(true);

      const response = await apiGet<Establishment>(
        `/establishment/${activeEstablishment.id}`
      );
      setActiveEstablishment(response);

      setTimeout(() => {
        setShowPopup(false);
        handleNextStep();
      }, 1500);
    } catch (err: any) {
      alert(err.message || "Error al subir logo");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto text-center px-4 py-4">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
        Imagen e identidad
      </h2>
      <p className="text-gray-300 mb-6 text-sm sm:text-base">
        Sube el logotipo de tu establecimiento para personalizar tu perfil público
      </p>

      <form className="flex flex-col gap-6" onSubmit={handleUpload}>
        <div className="relative w-full h-44 border-2 border-dashed border-white/20 hover:border-pink-500/50 rounded-2xl flex items-center justify-center bg-white/5 overflow-hidden transition-colors group cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData({
                ...formData,
                logoFile: e.target.files?.[0],
              })
            }
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />

          {!formData.logoFile ? (
            <div className="flex flex-col items-center justify-center gap-2 text-pink-500 group-hover:scale-105 transition-transform">
              <MdUploadFile className="text-5xl" />
              <p className="font-semibold text-sm text-white">
                Haz clic o arrastra tu logo aquí
              </p>
              <p className="text-xs text-gray-400">PNG, JPG o WEBP</p>
            </div>
          ) : (
            <div className="relative w-full h-full p-4 flex items-center justify-center">
              <img
                src={URL.createObjectURL(formData.logoFile)}
                alt="Vista previa del logo"
                className="max-h-full max-w-full object-contain rounded-xl"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={!formData.logoFile || isUploading}
            className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-500/40 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-pink-500/25 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Subiendo logo...</span>
              </>
            ) : (
              <span>Guardar y continuar</span>
            )}
          </button>

          <button
            type="button"
            onClick={handleNextStep}
            className="text-gray-400 hover:text-white text-sm font-medium py-2 transition-colors cursor-pointer"
          >
            Omitir por ahora
          </button>
        </div>
      </form>

      {/* Popup de Confirmación Flotante */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in duration-200">
          <div className="bg-brandBlue border border-emerald-500/30 text-white rounded-2xl shadow-2xl p-6 flex items-center gap-4 max-w-sm w-full">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
              <FiCheckCircle className="text-2xl" />
            </div>
            <div className="text-left">
              <p className="font-bold text-base text-white">Logo subido</p>
              <p className="text-xs text-gray-300">
                Se guardó la imagen correctamente.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadLogo;