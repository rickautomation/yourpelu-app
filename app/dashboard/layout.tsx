"use client";
import { useState } from "react";
import Navbar from "../components/NavBar";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white relative">
      {/* Navbar */}
      <div className="z-50 relative">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      <div className="flex-1 relative">
        {/* Overlay: clic fuera cierra */}
        {sidebarOpen && (
          <div
            className="fixed top-14 left-64 h-[calc(100%-56px)] w-[calc(100%-16rem)] z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        {sidebarOpen && (
          <aside
            className="
              fixed top-14 left-0 h-[calc(100%-56px)] w-64
              bg-gray-900 p-6 flex flex-col gap-4 z-40
              transform transition-transform duration-300 delay-200
              translate-x-0
            "
          >
            <nav className="flex flex-col gap-2">
              {/* Bloque negocio */}
              <Link
                href="/dashboard/barberia"
                onClick={() => setSidebarOpen(false)}
              >
                🏢 Barbería
              </Link>
              <Link
                href="/dashboard/barberos"
                onClick={() => setSidebarOpen(false)}
              >
                💈 Barberos
              </Link>

               <Link
                href="/dashboard/barbershop-profile-settings"
                onClick={() => setSidebarOpen(false)}
              >
                🖼️ Barbershop Feed
              </Link>

              <hr className="border-gray-700 my-2" />

              {/* Bloque servicios y operaciones */}
              <Link
                href="/dashboard/servicios"
                onClick={() => setSidebarOpen(false)}
              >
                💇 Servicios
              </Link>
              <Link
                href="/dashboard/cortes"
                onClick={() => setSidebarOpen(false)}
              >
                ✂️ Cortes
              </Link>
              <Link
                href="/dashboard/haircut-styles"
                onClick={() => setSidebarOpen(false)}
              >
                💇‍♂️ Estilos
              </Link>
              <Link
                href="/dashboard/coloraciones"
                onClick={() => setSidebarOpen(false)}
              >
                🎨 Coloraciones
              </Link>
              <Link
                href="/dashboard/insumos"
                onClick={() => setSidebarOpen(false)}
              >
                🧴 Insumos
              </Link>

              <hr className="border-gray-700 my-2" />

              {/* Bloque agenda y clientes */}
              <Link
                href="/dashboard/turnos"
                onClick={() => setSidebarOpen(false)}
              >
                📅 Turnos
              </Link>
              <Link
                href="/dashboard/clientes"
                onClick={() => setSidebarOpen(false)}
              >
                👥 Clientes
              </Link>

              <hr className="border-gray-700 my-2" />

              {/* Bloque reportes */}
              <Link
                href="/dashboard/reportes"
                onClick={() => setSidebarOpen(false)}
              >
                📊 Reportes
              </Link>

              <hr className="border-gray-700 my-2" />

              {/* Bloque perfil y configuración */}
              <Link
                href="/dashboard/perfil"
                onClick={() => setSidebarOpen(false)}
              >
                🧑‍🦱 Perfil
              </Link>
              <Link
                href="/dashboard/configuracion"
                onClick={() => setSidebarOpen(false)}
              >
                ⚙️ Configuración
              </Link>
            </nav>
          </aside>
        )}

        {/* Main */}
        <main className="p-6 relative z-20">{children}</main>
      </div>
    </div>
  );
}
