"use client";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import EstablishmentSetupWizard from "./components/EstablishmentSetupWizard";

export default function BarbershopWizard() {
  const { user, refreshUser, router } = useAuth();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step"); // 👈 lee el query param
  const typeParam = searchParams.get("type");

  const initialStep = stepParam ? parseInt(stepParam, 10) : 0;
  const initialType: string | null = typeParam ?? null;

  return (
   <div className="">
     <EstablishmentSetupWizard
      onFinish={async () => {
        await refreshUser();
        router.push("/dashboard");
      }}
      userName={user?.name || "Usuario"}
      userId={user?.id || ""}
      step={initialStep} // 👈 se pasa al wizard
      initialType={initialType}
    />
   </div>
  );
}