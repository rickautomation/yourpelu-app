// page.tsx
"use client";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import EstablishmentSetupWizard from "./components/EstablishmentSetupWizard";

export default function InitialSetupPage() {
  const { user, refreshUser, router } = useAuth();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step");
  const typeParam = searchParams.get("type");

  const initialStep = stepParam ? parseInt(stepParam, 10) : 0;
  const initialType: string | null = typeParam ?? null;

  return (
    <div>
      <EstablishmentSetupWizard
        onFinish={async () => {
          await refreshUser();
          router.push("/workspace");
          router.refresh(); // 👈 Revalida el Router Cache de Next.js en producción
        }}
        userName={user?.name || "Usuario"}
        userId={user?.id || ""}
        step={initialStep}
        initialType={initialType}
      />
    </div>
  );
}