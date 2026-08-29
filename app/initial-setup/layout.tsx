"use client";

import { useState, useMemo } from "react";
import { useSecureAuth } from "../hooks/useSecureAuth";
import { EstablishmentProvider } from "../context/EstablishmentContext";
import Image from "next/image";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, router } = useSecureAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sessionId = useMemo(() => {
    return typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : String(Date.now());
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <EstablishmentProvider>
      <div className="p-4 bg-brandBlue flex justify-center">
        <Image
          src="/yourpelu-logo.png"
          alt="Yourpelu Logo"
          width={68}
          height={68}
          className="h-10 w-auto"
        />
      </div>
      <div className="min-h-screen flex flex-col bg-brandBlue text-white relative px-1">
        <main className="relative z-20 pt-10">{children}</main>
      </div>
    </EstablishmentProvider>
  );
}
