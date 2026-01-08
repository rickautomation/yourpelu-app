"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { useUserBarbershops } from "@/app/hooks/useUserBarbershops";
import LogoUploader from "./components/LogoUploader";
import CarouselUploader from "./components/CarouselUploader";
import LocationSelector from "./components/LocationSelector";
import BarbershopInfoForm from "./components/BarbershopInfoForm";
import BarbershopProfileCard from "./components/BarbershopProfileCard";

export default function BarbershopProfileSettingsPage() {
  const { user, loading, isUnauthorized, router } = useAuth();
  const { activeBarbershop } = useUserBarbershops(user);

  const [logo, setLogo] = useState<File | null>(null);
  const [carouselImages, setCarouselImages] = useState<File[]>([]);
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [info, setInfo] = useState<{
    lema?: string;
    descripcion?: string;
    contacto?: string;
    horario?: string;
    name?: string;
    address?: string;
  }>({
    name: activeBarbershop?.name || "",
    address: activeBarbershop?.address || "",
    contacto: activeBarbershop?.phoneNumber || "",
  });

  const [success, setSuccess] = useState(false);

  console.log("activeBarbershop", activeBarbershop);

  useEffect(() => {
    if (activeBarbershop) {
      setInfo((prev) => ({
        name: activeBarbershop.name || "",
        address: activeBarbershop.address || "",
        contacto: activeBarbershop.phoneNumber || "",
        lema: prev.lema || "",
        descripcion: prev.descripcion || "",
        horario: prev.horario || "",
      }));
    }
  }, [activeBarbershop]);

  const handleFinalSubmit = async () => {
    if (!activeBarbershop?.id) return;

    const formData = new FormData();
    formData.append("barbershopId", activeBarbershop.id);

    if (info.lema) formData.append("lema", info.lema);
    if (info.descripcion) formData.append("descripcion", info.descripcion);
    if (info.contacto) formData.append("contacto", info.contacto);
    if (info.horario) formData.append("horario", info.horario);

    if (location?.lat && location?.lng) {
      formData.append("lat", location.lat.toString());
      formData.append("lng", location.lng.toString());
    }

    if (logo) formData.append("logo", logo);
    carouselImages.forEach((file) => formData.append("carousel", file));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${activeBarbershop.id}/setup-feed`,
        {
          method: "POST",
          body: formData,
          credentials: "include", // 👈 necesario para enviar la cookie auth_token
        }
      );

      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      const data = await res.json();

      setSuccess(true);
    } catch (err) {
      console.error("Error al configurar barbería:", err);
      alert("Hubo un error al configurar la barbería ❌");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (isUnauthorized) {
    router.push("/login");
    return null;
  }

  if (success) {
    return <div className="p-6 text-center">✔️ Configuración finalizada</div>;
  }

  return (
    <div className="flex flex-col space-y-6 text-center p-6">
      {activeBarbershop?.profile ? (
        // 👉 Renderizar perfil si ya existe
        <BarbershopProfileCard barbershop={activeBarbershop} />
      ) : (
        <>
          {step === 1 && <BarbershopInfoForm info={info} setInfo={setInfo} />}

          {step === 2 && (
            <LocationSelector
              location={location}
              setLocation={setLocation}
              defaultAddress={activeBarbershop?.address}
            />
          )}

          {step === 3 && <LogoUploader logo={logo} setLogo={setLogo} />}

          {step === 4 && (
            <CarouselUploader
              carouselImages={carouselImages}
              setCarouselImages={setCarouselImages}
            />
          )}

          {step === 5 && (
            <div className="p-6 bg-gray-800 text-white rounded-lg space-y-4">
              <h2 className="text-xl font-bold mb-4">Confirmación</h2>
              <p>
                <strong>Contacto:</strong> {info.contacto}
              </p>
              <p>
                <strong>Horario:</strong> {info.horario}
              </p>
              <p>
                <strong>Dirección:</strong> {info.address}
              </p>
              {location && (
                <p>
                  <strong>Ubicación:</strong> Lat {location.lat}, Lng{" "}
                  {location.lng}
                </p>
              )}
              <p>
                <strong>Logo:</strong> {logo ? logo.name : "No cargado"}
              </p>
              <p>
                <strong>Carrusel:</strong> {carouselImages.length} imágenes
              </p>

              <button
                onClick={handleFinalSubmit}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
              >
                Finalizar y enviar 🚀
              </button>
            </div>
          )}

          {/* Navegación */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setStep((s) => Math.min(5, s + 1))}
              disabled={
                (step === 1 && (!info.contacto || !info.horario)) || // validación paso 1
                (step === 2 && !location) ||
                (step === 3 && !logo) ||
                (step === 4 && carouselImages.length === 0)
              }
              className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}
