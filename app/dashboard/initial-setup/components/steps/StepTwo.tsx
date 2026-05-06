"use client";
import { apiPost } from "@/app/lib/apiPost";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export interface Establishment {
  id: string;
  name: string;
  phoneNumber?: string;
  address?: string;
}

interface StepTwoProps {
  userId: string;
  sessionId: string;
  selectedType: string;
  setStep: (step: number) => void;
}

const StepTwo: React.FC<StepTwoProps> = ({
  userId,
  sessionId,
  selectedType,
  setStep,
}) => {
  const router = useRouter();

  const [formData, setFormData] = useState<{
    name: string;
    address: string;
    phoneNumber: string;
    id?: string;
    logoFile?: File;
    logoUploaded?: boolean;
  }>({
    name: "",
    address: "",
    phoneNumber: "",
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await apiPost<{ establishment: Establishment }>(
        "/establishment",
        {
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          userId,
          sessionId,
          typeId: selectedType,
        },
      );

      const establishment = response.establishment;
      console.log("Establecimiento creado:", establishment);

      await apiPost("/current-establishments/set", {
        userId,
        barbershopId: establishment.id,
        sessionId,
      });

      router.refresh();

      setFormData((prev) => ({ ...prev, id: establishment.id }));
      setSuccess(true);
    } catch (error) {
      console.error("Error creando barbería:", error);
    }
  };

  return (
    <div className="px-4 py-3">
      {!success ? (
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            await handleSubmit();
          }}
        >
          <h2 className="text-xl text-center font-bold mb-4">
            Vamos a darle vida a tu establecimiento
          </h2>

          <div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Nombre"
              required
              className="px-3 py-2 rounded bg-luminiBrandBlue text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Dirección o ciudad"
              required
              className="px-3 py-2 rounded bg-luminiBrandBlue text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <input
              type="text"
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              placeholder="Número de contacto"
              required
              className="px-3 py-2 rounded bg-luminiBrandBlue text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <button
            type="submit"
            className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors font-semibold"
          >
            Crear establecimiento
          </button>
        </form>
      ) : (
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold text-green-400">
            Establecimiento creado con éxito ✅
          </p>
          <button
            type="submit"
            className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors font-semibold mt-8"
            onClick={async () => {
              setStep(3);
              router.push("/dashboard/initial-setup?step=3");
            }}
          >
            Continuar
          </button>
        </div>
      )}
    </div>
  );
};

export default StepTwo;
