"use client";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { WizardProvider } from "@/app/context/WizardContext";
import { useRouter, useSearchParams } from "next/navigation";
import SelectEstablishmentType from "./common/SelectEstablishmentType";
import EstablishmentCreationForm from "./common/EstablishmentCreationForm";
import ActsStaffToggle from "./common/ActsStaffToggle";
import UploadLogo from "./common/UploadLogo";
import BookingEnabled from "./common/BookingEnabled";
import SelectScheduleDays from "./common/SelectScheduleDays";
import SchedulesSetup from "./common/SchedulesSetup";
import SchedulesConfirm from "./common/SchedulesConfirm";
import FinalStep from "./common/FinalStep";
import TimeRangesConfirm from "./common/TimeRangesConfirm";

interface WizardProps {
  onFinish?: () => void;
  userName: string;
  userId: string;
  step?: number;
  initialType?: string | null;
}

export default function EstablishmentSetupWizard({
  userName,
  userId,
  step: initialStep = 0,
  initialType,
  onFinish,
}: WizardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estado sincronizado con la URL para soportar las flechas de navegación del navegador
  const [step, setStep] = useState(initialStep);
  const [selectedType, setSelectedType] = useState<string | null>(initialType ?? null);

  // Sincronizar el paso y el tipo cuando el usuario usa el botón "Atrás" o "Adelante" del navegador
  useEffect(() => {
    const stepParam = searchParams.get("step");
    const typeParam = searchParams.get("type");

    if (stepParam) {
      const parsedStep = parseInt(stepParam, 10);
      if (!isNaN(parsedStep) && parsedStep !== step) {
        setStep(parsedStep);
      }
    } else if (!stepParam && step !== 0) {
      setStep(0);
    }

    if (typeParam && typeParam !== selectedType) {
      setSelectedType(typeParam);
    }
  }, [searchParams]);

  const sessionId = useMemo(() => {
    return typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : String(Date.now());
  }, []);

  console.log("user: ", user);

  return (
    <WizardProvider>
      <div className="text-white px-6">
        {step === 0 && (
          <div className="max-w-lg mx-auto text-center py-4">
            {/* Icono de bienvenida plano */}
            <div className="w-16 h-16 bg-pink-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-pink-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.25M12 21.75V12m0 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 0v9.75"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 21v-9a3.75 3.75 0 0 1 3.75-3.75h10.5A3.75 3.75 0 0 1 21 12v9"
                />
              </svg>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight text-white">
              ¡Hola <span className="text-pink-500">{userName}</span>!
            </h2>

            <p className="text-gray-300 mb-8 text-base sm:text-lg leading-relaxed max-w-md mx-auto">
              Vamos a configurar tu establecimiento. Completa los datos
              iniciales y lo crearemos en el sistema en unos pocos pasos.
            </p>

            <button
              onClick={() => {
                setStep(1);
                router.push("/initial-setup?step=1");
              }}
              className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-pink-500/25 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              Empezar
            </button>
          </div>
        )}

        {step === 1 && user && (
          <SelectEstablishmentType
            user={user}
            setStep={setStep}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />
        )}

        {step === 2 && user && selectedType && (
          <EstablishmentCreationForm
            userId={user.id}
            sessionId={sessionId}
            selectedType={selectedType}
            setStep={setStep}
          />
        )}

        {step === 3 && user && (
          <ActsStaffToggle user={user} setStep={setStep} />
        )}

        {step === 4 && user && <UploadLogo setStep={setStep} user={user} />}

        {step === 5 && user && <BookingEnabled setStep={setStep} user={user} />}

        {step === 6 && user && (
          <SelectScheduleDays setStep={setStep} user={user} />
        )}

        {step === 7 && user && <SchedulesConfirm setStep={setStep} />}

        {step === 8 && user && <SchedulesSetup setStep={setStep} />}

        {step === 9 && user && <TimeRangesConfirm setStep={setStep} />}

        {step === 10 && user && <FinalStep />}
      </div>
    </WizardProvider>
  );
}