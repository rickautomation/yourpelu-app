"use client";
import { useState, useMemo } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { WizardProvider } from "@/app/context/WizardContext";
import { useRouter } from "next/navigation";
import SelectEstablishmentType from "./common/SelectEstablishmentType";
import EstablishmentCreationForm from "./common/EstablishmentCreationForm";
import ActsStaffToggle from "./common/ActsStaffToggle";
import UploadLogo from "./common/UploadLogo";
import BookingEnabled from "./common/BookingEnabled";
import SelectScheduleDays from "./common/SelectScheduleDays";
import SchedulesSetup from "./common/SchedulesSetup";
import SchedulesConfirm from "./SchedulesConfirm";
import FinalStep from "./common/FinalStep";

interface WizardProps {
  onFinish?: () => void;
  userName: string;
  userId: string;
  step?: number; // 👈 nuevo prop
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

  const [step, setStep] = useState(initialStep); // Si ya se está renderizando, salta al paso 2

  const [selectedType, setSelectedType] = useState<string | null>(
    initialType ?? null,
  );

  const sessionId = useMemo(() => {
    return typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : String(Date.now());
  }, []);

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
              onClick={() => setStep(1)}
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
            selectedType={selectedType} // 👈 ahora siempre es string
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

        {step === 7 && user && <SchedulesSetup setStep={setStep} />}

        {step === 8 && user && <SchedulesConfirm setStep={setStep} />}

        {step === 9 && user && <FinalStep onFinish={onFinish} />}
      </div>
    </WizardProvider>
  );
}
