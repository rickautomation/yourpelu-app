"use client";
import { createContext, useContext, ReactNode } from "react";
import { useUserEstablishment } from "@/app/hooks/useUserEstablishment";
import { useAuth } from "@/app/hooks/useAuth";

type EstablishmentContextType = ReturnType<typeof useUserEstablishment>;

const EstablishmentContext = createContext<EstablishmentContextType | undefined>(undefined);

export function EstablishmentProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const establishmentState = useUserEstablishment(user);

  return (
    <EstablishmentContext.Provider value={establishmentState}>
      {children}
    </EstablishmentContext.Provider>
  );
}

export function useEstablishment() {
  const ctx = useContext(EstablishmentContext);
  if (!ctx) throw new Error("useEstablishment debe usarse dentro de EstablishmentProvider");
  return ctx;
}
