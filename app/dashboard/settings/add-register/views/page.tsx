"use client";

import { useEstablishment } from "@/app/context/EstablishmentContext";
import { apiPatch } from "@/app/lib/apiPatch";
import { useState } from "react";
import { FiCheckCircle, FiChevronLeft, FiChevronRight } from "react-icons/fi";

// types.ts
export interface EstablishmentSettings {
  id: string;
  public_feed: boolean;
  appointments_from_feed: boolean;
  appointments_from_page: boolean;
  clients_in_offerings: boolean;
  cash_closure_enabled: boolean;
  cash_closure_daily: boolean;
  cash_closure_daily_time?: string;
  cash_closure_weekly: boolean;
  cash_closure_weekly_day?: string;
  cash_closure_monthly: boolean;
  registerView: "default" | "alternative";
  establishmentId: string;
}

export default function RegisterViews() {
  const { activeEstablishment } = useEstablishment();

  const images = [
    {
      src: "/AddRegisterDefaultView.png",
      alt: "Vista Default",
      value: "default",
    },
    {
      src: "/AddRegisterAlternativeView.png",
      alt: "Vista Alternativa",
      value: "alternative",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedView, setSelectedView] = useState<string | null>(null);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleChoose = async () => {
    try {
      const updated = await apiPatch<EstablishmentSettings>(
        `/establishments/${activeEstablishment?.id}/settings`,
        {
          registerView: images[currentIndex].value,
        },
      );

      setSelectedView(updated.registerView);
      setShowModal(true);

      // ⏱️ Mostrar modal 1 segundo y luego recargar
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar la vista");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <h1 className="text-2xl font-bold text-white">Elige una vista</h1>

      {/* Carrusel con botones afuera */}
      <div className="flex justify-center items-center space-x-6 p-6">
        {/* Botón izquierda */}
        <button
          onClick={prevSlide}
          className="bg-ligthBrandBlue text-white p-3 rounded-full shadow-lg hover:bg-gray-200"
        >
          <FiChevronLeft size={32} />
        </button>

        {/* Imagen */}
        <img
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className="w-[600px] h-[400px] object-contain border shadow-lg"
        />

        {/* Botón derecha */}
        <button
          onClick={nextSlide}
          className="bg-ligthBrandBlue text-white p-3 rounded-full shadow-lg hover:bg-gray-200"
        >
          <FiChevronRight size={32} />
        </button>
      </div>

      {/* Botón elegir debajo */}
      <button
        onClick={handleChoose}
        className="bg-pink-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-pink-600"
      >
        Elegir
      </button>

      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-darkBrandBlue rounded-lg shadow-lg p-6 text-center border border-green-500">
            <div className="flex justify-center mb-4">
             <FiCheckCircle className="text-green-400 text-3xl" />
            </div>
            <h2 className="text-xl font-bold mb-2">¡Vista actualizada!</h2>
            <p>
              Seleccionaste la vista <strong>{selectedView}</strong>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
