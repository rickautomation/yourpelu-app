"use client";
import { useState, useMemo, use } from "react";
import { apiPost } from "@/app/lib/apiPost";
import NewOfferingFromTemplatePage from "@/app/dashboard/offerings/new/from-template/page";
import { useAuth } from "@/app/hooks/useAuth";
import { WizardProvider } from "@/app/context/WizardContext";
import { useRouter } from "next/navigation";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import StepThree from "./steps/StepThree";
import StepFive from "./steps/StepFive";
import StepSix from "./steps/StepSix";
import StepSeven from "./steps/StepSeven";

interface WizardProps {
  onFinish?: () => void;
  userName: string;
  userId: string;
  step?: number; // 👈 nuevo prop
}

type Interval = { start: string; end: string };

type DaySchedule = {
  dayOfWeek: number; // 1 = lunes, 7 = domingo
  intervals: Interval[];
};

export default function EstablishmentSetupWizard({
  userName,
  userId,
  step: initialStep = 0,
}: WizardProps) {
  const { user } = useAuth();

  const router = useRouter();

  const [step, setStep] = useState(initialStep); // Si ya se está renderizando, salta al paso 2

  const [schedules, setSchedules] = useState<DaySchedule[]>([]);

  const [selectedType, setSelectedType] = useState<string | null>(null);

  const sessionId = useMemo(() => {
    return typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : String(Date.now());
  }, []);

  return (
    <WizardProvider>
      <div className="text-white">
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

        {step === 1 && user && (
          <StepOne
            user={user}
            setStep={setStep}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />
        )}

        {step === 2 && user && selectedType && (
          <StepTwo
            userId={user.id}
            sessionId={sessionId}
            selectedType={selectedType} // 👈 ahora siempre es string
            setStep={setStep}
          />
        )}

        {step === 3 && user && <StepThree setStep={setStep} user={user} />}

        {step === 4 && (
          <>
            <NewOfferingFromTemplatePage inWizard={true} setStep={setStep} />
          </>
        )}

        {step === 5 && user && <StepFive setStep={setStep} user={user} />}

        {step === 6 && user && <StepSix setStep={setStep} user={user} />}

        {step === 7 && user && <StepSeven setStep={setStep} user={user} />}

        {step === 8 && (
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
