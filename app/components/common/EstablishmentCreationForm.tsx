"use client";
import { apiPost } from "@/app/lib/apiPost";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { FiCheckCircle } from "react-icons/fi";

interface CurrentEstablishment {
  id: string;              // id del current_establishment
  userId: string;
  establishmentId: string; // FK al establecimiento
  sessionId: string;
  createdAt: string;
  establishment: Establishment; // 👈 el objeto real del establecimiento
}

export interface Establishment {
  id: string;
  establishmentId?: string;
  slug: string; // 👈 faltaba
  name: string;
  phoneNumber?: string;
  address?: string;
  bookingEnabled: boolean;
}

interface StepTwoProps {
  userId: string;
  sessionId: string;
  selectedType: string;
  setStep: (step: number) => void;
}

const EstablishmentCreationForm: React.FC<StepTwoProps> = ({
  userId,
  sessionId,
  selectedType,
  setStep,
}) => {
  const { setActiveEstablishment } = useEstablishment();
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
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

const handleSubmit = async () => {
  try {
    const response = await apiPost<{ establishment: CurrentEstablishment }>(
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

    // 👇 acá response.establishment es un CurrentEstablishment
    const currentEstablishment = response.establishment;
    const establishment = currentEstablishment.establishment; // 👈 el objeto real

    console.log("Establecimiento creado:", establishment);

    await apiPost("/current-establishments/set", {
      userId,
      establishmentId: establishment.id, // 👈 usar el id del establecimiento
      sessionId,
    });

    setActiveEstablishment(establishment); // 👈 guardar el objeto correcto
    window.dispatchEvent(new Event("barbershop-changed"));
    router.refresh();

    setFormData((prev) => ({ ...prev, id: establishment.id }));

    setShowPopup(true);

    setTimeout(() => {
      setStep(3);
      router.push("/dashboard/initial-setup?step=3");
    }, 1500);
  } catch (error) {
    console.error("Error creando barbería:", error);
  }
};


  return (
    <div className="">
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

export default EstablishmentCreationForm;
