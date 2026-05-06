"use client";
import React, { useState } from "react";
import { MdUploadFile } from "react-icons/md";
import { useRouter } from "next/navigation";
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

interface StepThreeProps {
  setStep: (step: number) => void;
  user: User;
}

const StepThree: React.FC<StepThreeProps> = ({ setStep, user }) => {
  const router = useRouter();
  const { activeEstablishment } = useUserEstablishment(user);

  const [formData, setFormData] = useState<{
    logoFile?: File;
    logoUploaded?: boolean;
  }>({
    logoFile: undefined,
    logoUploaded: false,
  });

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

      alert("Logo subido con éxito ✅");
      setFormData({ ...formData, logoUploaded: true });
    } catch (err: any) {
      alert(err.message || "Error al subir logo");
    }
  };

  return (
    <div className="mt-4 text-center p-4">
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
          <p className="text-lg mb-4">
            ¡Logo agregado con éxito! Ahora vamos a configurar los servicios que
            ofrecerás.
          </p>

          <button
            onClick={() => {
              setStep(4);
              router.push("/dashboard/initial-setup?step=4");
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors font-semibold"
          >
            Configurar servicios
          </button>
        </div>
      )}
    </div>
  );
};

export default StepThree;
