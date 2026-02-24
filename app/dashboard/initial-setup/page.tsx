"use client";
import { useSearchParams } from "next/navigation";
import BarbershopSetupWizard from "@/app/components/dashboard/BarbershopSetupWizard";
import { useAuth } from "@/app/hooks/useAuth";

export default function BarbershopWizard() {
  const { user, refreshUser, router } = useAuth();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step"); // 👈 lee el query param
  const initialStep = stepParam ? parseInt(stepParam, 10) : 0;

  return (
   <div className="px-4">
     <BarbershopSetupWizard
      onFinish={async () => {
        await refreshUser();
        router.push("/dashboard");
      }}
      userName={user?.name || "Usuario"}
      userId={user?.id || ""}
      step={initialStep} // 👈 se pasa al wizard
    />
   </div>
  );
}