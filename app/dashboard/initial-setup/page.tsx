"use client";
import { useState, useMemo } from "react";
import { apiPost } from "@/app/lib/apiPost";
import { Barbershop } from "@/app/interfaces";
import ServicesPage from "@/app/dashboard/servicios/page";
import { useServices } from "@/app/hooks/useServices";
import { useAuth } from "@/app/hooks/useAuth";
import BarbershopSetupWizard from "@/app/components/dashboard/BarbershopSetupWizard";

interface WizardProps {
  onFinish: () => void;
  userName: string;
  userId: string;
  isRendering?: boolean;
}

export default function BarbershopWizard({
  userName,
  userId,
}: WizardProps) {
  const [step, setStep] = useState(2);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
  });
  const { user, loading, router, refreshUser } = useAuth();
  const [success, setSuccess] = useState(false);
  const [hasServices, setHasServices] = useState<boolean | null>(null);

  const { ownServices } = useServices();

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
        userId: user?.id || userId,
        sessionId,
      });
      console.log("Barbería creada:", barberia);
      // onFinish();
    } catch (error) {
      console.error("Error creando barbería:", error);
    }
  };

  return (
    <div className="px-4 py-2">
      <BarbershopSetupWizard
        onFinish={async () => {
          await refreshUser();
          router.push("/dashboard");
        }}
        userName={user?.name || "Usuario"}
        userId={user?.id || ""}
        isRendering={true}
      />
    </div>
  );
}
