// app/context/WizardContext.tsx
"use client";
import { createContext, useContext, useState } from "react";

interface WizardContextType {
  step: number;
  setStep: (step: number) => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState(0);

  return (
    <WizardContext.Provider value={{ step, setStep }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard debe usarse dentro de WizardProvider");
  }
  return context;
}