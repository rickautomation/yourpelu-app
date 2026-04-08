"use client";

import { useState, useEffect, use } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import LogoUploader from "./components/LogoUploader";
import CarouselUploader from "./components/CarouselUploader";
import LocationSelector from "./components/LocationSelector";
import BarbershopInfoForm from "./components/BarbershopInfoForm";
import BarbershopProfileCard from "./components/BarbershopProfileCard";
import { useUserEstablishment } from "@/app/hooks/useUserEstablishment";

export default function BarbershopProfileSettingsPage() {
  const { user, loading, isUnauthorized, router } = useAuth();

  const {activeEstablishment} = useUserEstablishment(user)

  const [logo, setLogo] = useState<File | null>(null);
  const [carouselImages, setCarouselImages] = useState<File[]>([]);
  const [step, setStep] = useState(0); 
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [info, setInfo] = useState<{
    lema?: string;
    descripcion?: string;
    contacto?: string;
    horario1?: string;
    horario2?: string;
    name?: string;
    address?: string;
  }>({
    name: activeEstablishment?.name || "",
    address: activeEstablishment?.address || "",
    contacto: activeEstablishment?.phoneNumber || "",
  });

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (activeEstablishment) {
      setInfo((prev) => ({
        name: activeEstablishment.name || "",
        address: activeEstablishment.address || "",
        contacto: activeEstablishment.phoneNumber || "",
        lema: prev.lema || "",
        descripcion: prev.descripcion || "",
        horario1: prev.horario1 || "",
        horario2: prev.horario2 || "",
      }));
    }
  }, [activeEstablishment]);

  const handleFinalSubmit = async () => {
    if (!activeEstablishment?.id) return;

    const formData = new FormData();
    formData.append("barbershopId", activeEstablishment.id);

    if (info.lema) formData.append("lema", info.lema);
    if (info.descripcion) formData.append("descripcion", info.descripcion);
    if (info.contacto) formData.append("contacto", info.contacto);
    if (info.horario1) formData.append("horario1", info.horario1);

    if (location?.lat && location?.lng) {
      formData.append("lat", location.lat.toString());
      formData.append("lng", location.lng.toString());
    }

    if (logo) formData.append("logo", logo);
    carouselImages.forEach((file) => formData.append("carousel", file));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${activeEstablishment.id}/setup-feed`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      const data = await res.json();

      setSuccess(true);
    } catch (err) {
      console.error("Error al configurar barbería:", err);
      alert("Hubo un error al configurar la barbería ❌");
    }
  };

  const handleCancel = () => {
  setStep(0);
  setInfo({
    lema: "",
    descripcion: "",
    contacto: activeEstablishment?.phoneNumber || "",
    horario1: "",
    horario2: "",
    name: activeEstablishment?.name || "",
    address: activeEstablishment?.address || "",
  });
  setLogo(null);
  setCarouselImages([]);
  setLocation(null);
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
    <div className="flex flex-col text-center">
      {activeEstablishment?.profile ? (
        <BarbershopProfileCard barbershop={activeEstablishment} />
      ) : (
        <>
          {/* Paso 0: Introducción */}
          {step === 0 && (
            <div className="space-y-4 px-4 py-4">
              <h3 className="text-2xl font-semibold">
                ¿Listo para configurar el Feed de <strong className="text-pink-600">"{activeEstablishment?.name}"</strong>?
              </h3>

              <p className="text-gray-400">
                El Feed es como una <strong>mini‑web</strong> de tu barbería:
                tus clientes podrán ver <strong>información</strong>,{" "}
                <strong>ubicación</strong>,<strong>logo</strong>,{" "}
                <strong>fotos</strong> y <strong>horarios</strong>{" "}
                desde cualquier dispositivo.
              </p>

              <ul className="px-6 text-left list-disc list-inside space-y-1 text-lg">
                <li>📋 Datos básicos</li>
                <li>📍 Ubicación</li>
                <li>🎨 Logo</li>
                <li>🖼️ Imágenes</li>
              </ul>

              <div className="px-6 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Empezar configuración 🚀
                </button>
              </div>
            </div>
          )}
          {step === 1 && <BarbershopInfoForm info={info} setInfo={setInfo} />}

          {step === 2 && (
            <LocationSelector
              location={location}
              setLocation={setLocation}
              defaultAddress={activeEstablishment?.address}
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
            <div className="p-6 text-white rounded-lg space-y-6">
              {/* Título mejorado */}
              <h2 className="text-2xl font-bold mb-4">
                Revisión final de{" "}
                <span className="text-pink-500">{activeEstablishment?.name}</span>
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Verifica que toda la información esté correcta antes de publicar
                tu feed. Este perfil será la carta de presentación digital de tu
                barbería.
              </p>

              {/* Resumen de datos */}
              <div className="bg-gray-800 p-4 rounded-lg space-y-2 text-start">
                <p>
                  <strong className="text-pink-500">📞 Contacto:</strong>{" "}
                  {info.contacto}
                </p>
                <p>
                  <strong className="text-pink-500">🕒 Horario:</strong>{" "}
                  {info.horario1}
                </p>
                {info.horario2 && (
                  <p>
                    <strong className="text-pink-500">
                      ➕ Horario adicional:
                    </strong>{" "}
                    {info.horario2}
                  </p>
                )}
                <p>
                  <strong className="text-pink-500">📍 Dirección:</strong>{" "}
                  {info.address}
                </p>
                {location && (
                  <p>
                    <strong className="text-pink-500">🌍 Ubicación:</strong> Lat{" "}
                    {location.lat}, Lng {location.lng}
                  </p>
                )}
                <p>
                  <strong className="text-pink-500">🎨 Logo:</strong>{" "}
                  {logo ? logo.name : "No cargado"}
                </p>
                <p>
                  <strong className="text-pink-500">🖼️ Carrusel:</strong>{" "}
                  {carouselImages.length} imágenes
                </p>
              </div>

              {/* Botones finales */}
              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={handleFinalSubmit}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  ✅ Finalizar y publicar
                </button>
                <button
                  onClick={handleCancel} // 👈 vuelve al inicio o cancela
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
                >
                  ❌ Cancelar configuración
                </button>
              </div>
            </div>
          )}

          {/* Navegación */}
          {step > 0 && step < 5 && (
            <div className="flex justify-between mt-2 px-6">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setStep((s) => Math.min(5, s + 1))}
                disabled={
                  (step === 1 && (!info.contacto || !info.horario1)) ||
                  (step === 2 && !location) ||
                  (step === 3 && !logo) ||
                  (step === 4 && carouselImages.length === 0)
                }
                className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
