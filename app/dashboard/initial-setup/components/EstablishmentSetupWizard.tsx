"use client";
import { useState, useMemo, use } from "react";
import NewOfferingFromTemplatePage from "@/app/dashboard/offerings/new/from-template/page";
import { useAuth } from "@/app/hooks/useAuth";
import { WizardProvider } from "@/app/context/WizardContext";
import { useRouter } from "next/navigation";
import SelectEstablishmentType from "@/app/components/common/SelectEstablishmentType";
import EstablishmentCreationForm from "@/app/components/common/EstablishmentCreationForm";
import ActsStaffToggle from "@/app/components/common/ActsStaffToggle";
import UploadLogo from "@/app/components/common/UploadLogo";
import BookingEnabled from "@/app/components/common/BookingEnabled";
import SelectScheduleDays from "@/app/components/common/SelectScheduleDays";
import SchedulesSetup from "@/app/components/common/SchedulesSetup";

interface WizardProps {
  onFinish?: () => void;
  userName: string;
  userId: string;
  step?: number; // 👈 nuevo prop
  initialType?: string | null ;
}

export default function EstablishmentSetupWizard({
  userName,
  userId,
  step: initialStep = 0,
  initialType
}: WizardProps) {
  const { user } = useAuth();

  const router = useRouter();

  const [step, setStep] = useState(initialStep); // Si ya se está renderizando, salta al paso 2

  const [selectedType, setSelectedType] = useState<string | null>(initialType ?? null);

  const sessionId = useMemo(() => {
    return typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : String(Date.now());
  }, []);

  console.log("user: ", user)
  console.log("selectedType: ", selectedType)
  console.log("step: ", step)

  return (
    <WizardProvider>
      <div className="text-white px-6 py-3">
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

        {step === 3 && user && <ActsStaffToggle user={user} setStep={setStep}/>}

        {step === 4 && user && <UploadLogo setStep={setStep} user={user} />}

        {step === 5 && (
          <>
            <NewOfferingFromTemplatePage inWizard={true} setStep={setStep} />
          </>
        )}

        {step === 6 && user && <BookingEnabled setStep={setStep} user={user} />}

        {step === 7 && user && <SelectScheduleDays setStep={setStep} user={user} />}

        {step === 8 && user && <SchedulesSetup setStep={setStep} />}

        {step === 9 && (
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
