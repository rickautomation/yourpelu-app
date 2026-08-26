"use client";

import Navbar from "../components/NavBar";
import BottomNavWorkspace from "./components/BottomNavWorkspace";
import MenuPage from "./menu/page";
import { useState, useMemo } from "react";
import { useSecureAuth } from "../hooks/useSecureAuth";
import { EstablishmentProvider } from "../context/EstablishmentContext";

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
      <div className="min-h-screen flex flex-col bg-brandBlue text-white relative px-1">
        {!sidebarOpen && (
          <Navbar
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            userId={user?.id}
            sessionId={sessionId}
            sidebarOpen={sidebarOpen}
          />
        )}

        <div className="flex-1 relative">
          {sidebarOpen && (
            <div
              className="fixed top-14 left-64 h-[calc(100%-56px)] w-[calc(100%-16rem)] z-30"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <MenuPage setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />

          <main className="relative z-20 pb-16">{children}</main>
        </div>

        {/* 👇 ahora usamos el BottomNavWorkspace nuevo */}
        <BottomNavWorkspace
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          setSidebarOpen={setSidebarOpen}
        />
      </div>
    </EstablishmentProvider>
  );
}
