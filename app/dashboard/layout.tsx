"use client";
import Navbar from "../components/NavBar";
import ButtonNav from "../components/BottomNav";
import SidebarNav from "../components/dashboard/SideBarNav";
import { useState, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { useUserEstablishment } from "../hooks/useUserEstablishment";

type UserRole = "admin" | "staff" | "client" | "user";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, router} = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    activeEstablishment,
    establishments,
    setActiveEstablishment,
    loading: shopsLoading,
  } = useUserEstablishment(user);

  const role: UserRole =
    user?.rol === "admin" ||
    user?.rol === "staff" ||
    user?.rol === "client" ||
    user?.rol === "user"
      ? user.rol
      : "client";

  const sessionId = useMemo(() => {
    return typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : String(Date.now());
  }, []);

  if (loading || shopsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

   if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-brandBlue text-white">
        <p className="text-xl mb-4">No autorizado</p>
        <button
          onClick={() => router.push("/login")}
          className="px-4 py-2 bg-pink-600 rounded hover:bg-pink-700 transition-colors"
        >
          Iniciar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brandBlue text-white relative">
      {!sidebarOpen && (
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          activeEstablishment={activeEstablishment}
          setActiveEstablishment={setActiveEstablishment}
          establishments={establishments}
          userId={user.id}
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

        {sidebarOpen && (
          <SidebarNav
            establishments={establishments}
            activeEstablishment={activeEstablishment}
            setActiveEstablishment={setActiveEstablishment}
            setSidebarOpen={setSidebarOpen}
            userRole={role}
            userId={user.id}
            sessionId={sessionId}
          />
        )}

        <main className="relative z-20 pb-16">{children}</main>
      </div>

      <ButtonNav
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sessionId={sessionId}
        setSidebarOpen={setSidebarOpen}
      />
    </div>
  );
}
