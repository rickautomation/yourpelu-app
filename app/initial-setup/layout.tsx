"use client";

import { useSecureAuth } from "../hooks/useSecureAuth";
import { EstablishmentProvider } from "../context/EstablishmentContext";
import Image from "next/image";

export default function InitialSetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useSecureAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-brandBlue">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <EstablishmentProvider>
      <div className="min-h-screen flex flex-col bg-brandBlue text-white">
        {/* Header / Nav unificado */}
        <header className="p-4 flex justify-center bg-brandBlue select-none">
          <Image
            src="/yourpelu-logo.png"
            alt="Yourpelu Logo"
            width={68}
            height={68}
            className="h-10 w-auto"
            priority
          />
        </header>

        {/* Contenido principal sin espacios o bordes indeseados */}
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </EstablishmentProvider>
  );
}