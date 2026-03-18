"use client";
import { useState, useMemo, useEffect } from "react";
import { apiPost } from "@/app/lib/apiPost";
import { Barbershop } from "@/app/interfaces";
import NewOfferingFromTemplatePage from "@/app/dashboard/offerings/new/from-template/page";
import { useOfferings } from "@/app/hooks/useOfferings";
import { useAuth } from "@/app/hooks/useAuth";
import { useUserBarbershops } from "@/app/hooks/useUserBarbershops";
import { WizardProvider } from "@/app/context/WizardContext";
import { useRouter } from "next/navigation";

interface WizardProps {
  onFinish?: () => void;
  userName: string;
  userId: string;
  step?: number; // 👈 nuevo prop
}

export default function BarbershopSetupWizard({
  userName,
  userId,
  step: initialStep = 0,
}: WizardProps) {
  const { user } = useAuth();
  const { activeBarbershop } = useUserBarbershops(user);

  const router = useRouter();

  const [step, setStep] = useState(initialStep); // Si ya se está renderizando, salta al paso 2
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
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
      const barberia = await apiPost<Barbershop>("/barbershops", {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        userId,
        sessionId,
      });
      console.log("Barbería creada:", barberia);
      // onFinish();
    } catch (error) {
      console.error("Error creando barbería:", error);
    }
  };

  return (
    <WizardProvider>
      <div className="text-white rounded-lg shadow-md">
        {step === 0 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Hola {userName}!</h2>
            <p className="mb-6">
              Vamos a configurar tu barbería completa. Completa los datos y la
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
                  ¡Bienvenido! Vamos a darle vida a tu barbería
                </h2>

                <div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Nombre de la barbería"
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
                  Crear Barbería
                </button>
              </form>
            ) : (
              <div className="mt-4 text-center">
                <p className="text-green-400 font-semibold mb-4">
                  Barbería creada con éxito ✅
                </p>
                <p className="mb-6">
                  Agrega los servicios que ofrecerás en tu barbería.
                </p>
                <button
                  onClick={() => {
                    if (setStep) {
                      setStep(2);
                    }
                    router.push("/dashboard/initial-setup?step=2");
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors font-semibold"
                >
                  Configurar servicios
                </button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <>
            <NewOfferingFromTemplatePage inWizard={true} />
          </>
        )}

        {step === 3 && (
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
                router.push("/dashboard");
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
