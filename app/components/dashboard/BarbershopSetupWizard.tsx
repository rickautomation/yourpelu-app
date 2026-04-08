"use client";
import { useState, useMemo, useEffect } from "react";
import { apiPost } from "@/app/lib/apiPost";
import { Barbershop } from "@/app/interfaces";
import NewOfferingFromTemplatePage from "@/app/dashboard/offerings/new/from-template/page";
import { useAuth } from "@/app/hooks/useAuth";
import { WizardProvider } from "@/app/context/WizardContext";
import { useRouter } from "next/navigation";
import { apiGet } from "@/app/lib/apiGet";

interface WizardProps {
  onFinish?: () => void;
  userName: string;
  userId: string;
  step?: number; // 👈 nuevo prop
}

type EstablishmentType = {
  id: string;
  name: string;
  description: string;
};

export default function BarbershopSetupWizard({
  userName,
  userId,
  step: initialStep = 0,
}: WizardProps) {
  const { user } = useAuth();
  const [types, setTypes] = useState<EstablishmentType[]>([]);

  const router = useRouter();

  console.log("types: ", types);

  const [step, setStep] = useState(initialStep); // Si ya se está renderizando, salta al paso 2
  const [formData, setFormData] = useState<{
    name: string;
    address: string;
    phoneNumber: string;
    typeId: string;
    id?: string; // 👈 para guardar el id del establecimiento creado
    logoFile?: File; // 👈 para guardar el archivo del logo
    logoUploaded?: boolean;
  }>({
    name: "",
    address: "",
    phoneNumber: "",
    typeId: "",
  });
  const [success, setSuccess] = useState(false);

  const sessionId = useMemo(() => {
    return typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : String(Date.now());
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await apiPost<{ establishment: Barbershop }>(
        "/establishment",
        {
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          userId,
          sessionId,
          typeId: formData.typeId,
        },
      );

      const establishment = response.establishment;
      console.log("Establecimiento creado:", establishment);

      setFormData((prev) => ({ ...prev, id: establishment.id })); // 👈 guardar id
      setSuccess(true);
    } catch (error) {
      console.error("Error creando barbería:", error);
    }
  };

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const fetchedTypes =
          await apiGet<EstablishmentType[]>(`/establishment-types`);
        setTypes(fetchedTypes);
      } catch (err) {
        console.error("Error cargando tipos de establecimiento:", err);
      }
    };

    setStep(initialStep);
    loadTypes();
  }, [initialStep]);

  return (
    <WizardProvider>
      <div className="text-white rounded-lg shadow-md">
        {step === 0 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Hola {userName}!</h2>
            <p className="mb-6">
              Vamos a configurar tu establecimiento. Completa los datos y la
              crearemos en el sistema.
            </p>
            <button
              onClick={() => setStep(1)}
              className="bg-green-500 px-6 py-2 rounded font-semibold"
            >
              Empezar
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="px-4 py-3">
            <h2 className="text-lg text-center font-bold mb-4">
              Elige el tipo de establecimiento
            </h2>

            <div className="flex flex-col gap-3">
              {types.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setFormData({ ...formData, typeId: t.id });
                    setStep(2); // 👈 ahora pasa al formulario
                  }}
                  className="bg-slate-900 text-white px-4 py-4 rounded hover:bg-pink-500 transition-colors font-semibold"
                >
                  <p>{t.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="px-4 py-3">
            {!success ? (
              <form
                className="flex flex-col gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  await handleSubmit();
                  setSuccess(true); // 👈 activa el éxito
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
                    className="px-3 py-2 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Dirección o ciudad"
                    required
                    className="px-3 py-2 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleChange("phoneNumber", e.target.value)
                    }
                    placeholder="Número de contacto"
                    required
                    className="px-3 py-2 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors font-semibold"
                >
                  Continuar
                </button>
              </form>
            ) : (
              <div className="mt-4 text-center">
                <p className="text-green-400 font-semibold mb-4">
                  Establecimiento creado con éxito ✅
                </p>

                {/* 👇 Nuevo bloque para subir logo */}
                <form
                  className="flex flex-col gap-4 mb-6"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!formData.logoFile || !formData.id) return;

                    const fd = new FormData();
                    fd.append("logo", formData.logoFile);

                    try {
                      const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/establishment/${formData.id}/upload-logo`,
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
                      setFormData({ ...formData, logoUploaded: true }); // 👈 habilita el botón
                    } catch (err: any) {
                      alert(err.message || "Error al subir logo");
                    }
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        logoFile: e.target.files?.[0],
                      })
                    }
                    className="px-3 py-2 rounded bg-gray-800 text-white w-full"
                  />
                  <button
                    type="submit"
                    className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors font-semibold"
                  >
                    Subir Logo
                  </button>
                </form>

                {/* 👇 Botón para pasar a configurar servicios */}
                {formData.logoUploaded && (
                  <button
                    onClick={() => setStep(3)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors font-semibold"
                  >
                    Configurar servicios
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <>
            <NewOfferingFromTemplatePage inWizard={true} />
          </>
        )}

        {step === 4 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">¡Listo!</h2>
            <p className="mb-6">
              Has completado la configuración de tu barbería. Puedes empezar a
              gestionar tus servicios y barberos.
            </p>
            <p>
              ya puedes agregar barberos y gestionar tu barbería desde el menú
              de navegación.
            </p>

            <button
              onClick={() => {
                window.location.href = "/dashboard";
              }}
              className="mt-4 bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors font-semibold"
            >
              Terminar
            </button>
          </div>
        )}
      </div>
    </WizardProvider>
  );
}
