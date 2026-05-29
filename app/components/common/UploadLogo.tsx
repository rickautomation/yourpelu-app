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
  timeRanges: TimeRange[]; // 👈 agregar esta propiedad
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
    logoUploaded?: boolean;
  }>({
    logoFile: undefined,
    logoUploaded: false,
  });
  const [showPopup, setShowPopup] = useState(false);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.logoFile) return;

    const fd = new FormData();
    fd.append("logo", formData.logoFile);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/establishment/${activeEstablishment?.id}/upload-logo`,
        {
          method: "POST",
          body: fd,
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}`);
      }

      setFormData({ ...formData, logoUploaded: true });
      setShowPopup(true);

      // 👇 tipamos la respuesta
      const response = await apiGet<Establishment>(`/establishment/${activeEstablishment?.id}`);
      setActiveEstablishment(response);

      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
    } catch (err: any) {
      alert(err.message || "Error al subir logo");
    }
  };

  return (
    <div className="mt-4 text-center">
      {!formData.logoUploaded ? (
        <form className="flex flex-col gap-4 mb-6" onSubmit={handleUpload}>
          <div className="relative w-full h-32 border-2 border-dashed border-gray-600 rounded flex items-center justify-center bg-luminiBrandBlue overflow-hidden">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  logoFile: e.target.files?.[0],
                })
              }
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {!formData.logoFile ? (
              <div className="flex flex-col items-center justify-center gap-2 text-pink-500">
                <MdUploadFile className="text-5xl pointer-events-none" />
                <p>Subir Logo</p>
              </div>
            ) : (
              <img
                src={URL.createObjectURL(formData.logoFile)}
                alt="Vista previa del logo"
                className="absolute inset-0 w-full h-full object-contain rounded pointer-events-none"
              />
            )}
          </div>

          <button
            type="submit"
            className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors font-semibold mt-4"
          >
            Guardar
          </button>
        </form>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-lg mb-4 leading-relaxed">
            Lo siguiente es configurar los servicios que vas a ofrecer en tu{" "}
            <span className="font-semibold text-rose-400">
              {activeEstablishment?.type?.name}
            </span>
            .
          </p>
          <p className="text-md mb-4 text-gray-200">
            Podés hacerlo utilizando las{" "}
            <span className="font-semibold">plantillas disponibles </span>
            para ahorrar tiempo, o crear tus propios servicios desde cero según
            las necesidades de tu negocio.
          </p>

          <button
            onClick={() => {
              setStep(5);
              router.push("/dashboard/initial-setup?step=5");
            }}
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors font-semibold"
          >
            Configurar servicios
          </button>
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-70 flex items-center justify-center z-50">
          <div className="border border-green-500 bg-darkBrandBlue text-white rounded-lg shadow-lg p-6 flex items-center space-x-3">
            <FiCheckCircle className="text-green-400 text-3xl" />
            <span className="font-semibold">
              Establecimiento creado con éxito!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadLogo;
