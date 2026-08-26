// app/dashboard/offerings/layout.tsx
"use client";
import { WizardProvider } from "@/app/context/WizardContext";

export default function OfferingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <WizardProvider>
      {children}
    </WizardProvider>
  );
}