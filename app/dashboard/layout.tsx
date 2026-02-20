"use client";
import Navbar from "../components/NavBar";
import ButtonNav from "../components/BottomNav";
import SidebarNav from "../components/dashboard/SideBarNav";
import { useState, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { useUserBarbershops } from "../hooks/useUserBarbershops";

type UserRole = "admin" | "barber" | "client" | "user";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    activeBarbershop,
    barbershops,
    setActiveBarbershop,
    loading: shopsLoading,
  } = useUserBarbershops(user);

  const role: UserRole =
    user?.rol === "admin" ||
    user?.rol === "barber" ||
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
    return <div className="p-6 text-white">Cargando...</div>;
  }

  if (!user) {
    return <div className="p-6 text-white">No autorizado</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white relative">
      {!sidebarOpen && (
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          activeBarbershop={activeBarbershop}
          setActiveBarbershop={setActiveBarbershop}
          barbershops={barbershops}
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
            barbershops={barbershops}
            activeBarbershop={activeBarbershop}
            setActiveBarbershop={setActiveBarbershop}
            setSidebarOpen={setSidebarOpen}
            userRole={role}
            userId={user.id}
            sessionId={sessionId}
          />
        )}

        <main className="relative z-20">{children}</main>
      </div>

      <ButtonNav
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sessionId={sessionId}
      />
    </div>
  );
}
