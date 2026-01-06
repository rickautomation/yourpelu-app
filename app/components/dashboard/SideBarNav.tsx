"use client";
import { useState } from "react";
import Link from "next/link";
import { apiPost } from "@/app/lib/apiPost"; // 👈 importar helper

type Barbershop = {
  id: string;
  name: string;
  address?: string;
};

type UserRole = "admin" | "barber" | "client" | "user";

export default function SidebarNav({
  barbershops,
  activeBarbershop,
  setActiveBarbershop,
  setSidebarOpen,
  userRole,
  userId, 
  sessionId, 
}: {
  barbershops: Barbershop[];
  activeBarbershop: Barbershop | null;
  setActiveBarbershop: (shop: Barbershop) => void;
  setSidebarOpen: (open: boolean) => void;
  userRole: UserRole;
  userId: string;
  sessionId: string;
}) {
  const [showSelector, setShowSelector] = useState(false);

  const handleSelectBarbershop = async (shop: Barbershop) => {
    try {
      // 👇 persistir barbería activa en backend
      await apiPost("/current-barbershops/set", {
        userId,
        barbershopId: shop.id,
        sessionId,
      });

      // 👇 actualizar estado local
      setActiveBarbershop(shop);
      setShowSelector(false);

      // 👇 notificar al resto de la app
      window.dispatchEvent(new Event("barbershop-changed"));
    } catch (err) {
      console.error("Error cambiando barbería activa", err);
    }
  };

  return (
    <aside
      className="
        fixed top-14 left-0 h-[calc(100%-56px)] w-full
        bg-gray-900 px-6 py-2 flex flex-col gap-4 z-40
        transform transition-transform duration-300 delay-200
        translate-x-0
      "
    >
      <nav className="flex flex-col gap-2 px-3">
        <div className="text-center">
          {(userRole === "admin" || userRole === "user") &&
            (barbershops.length > 0 ? (
              <>
                {/* Botón para abrir/cerrar selector */}
                <button
                  className="flex items-center justify-between w-full px-4 py-2 text-lg font-semibold text-pink-600 border border-pink-600 rounded-md hover:bg-pink-600 hover:text-white transition"
                  onClick={() => setShowSelector(!showSelector)}
                >
                  {activeBarbershop?.name || "Seleccionar barbería"}
                  <svg
                    className={`w-5 h-5 ml-2 transform transition-transform ${
                      showSelector ? "rotate-180" : "rotate-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown solo si showSelector está activo */}
                {/* Dropdown selector */}
                {showSelector && (
                  <>
                    <div className="mt-2 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                      {barbershops.map((shop) => (
                        <button
                          key={shop.id}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-700 ${
                            activeBarbershop?.id === shop.id
                              ? "bg-gray-900 text-pink-400"
                              : "text-white"
                          }`}
                          onClick={() => handleSelectBarbershop(shop)}
                        >
                          <p className="font-bold">{shop.name}</p>
                          <p className="text-sm text-gray-400">
                            {shop.address}
                          </p>
                        </button>
                      ))}
                    </div>

                    {/* Botón Nueva Barbería separado */}
                    <div className="mt-3">
                      <Link
                        href="/dashboard/barbershops/new"
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center justify-start gap-2 w-full px-4 py-1 border border-pink-600 rounded-md text-xl font-semibold text-white hover:bg-pink-600 hover:text-white transition"
                      >
                        <span className="text-3xl text-pink-600 font-semibold">+</span>
                        Nueva Barbería
                      </Link>
                    </div>
                  </>
                )}
              </>
            ) : (
              // 👇 Si no hay barberías, mostrar solo el botón Nueva Barbería
              <Link
                href="/dashboard/barbershops/new"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-start gap-2 w-full px-4 py-1 border border-pink-600 rounded-md text-xl font-semibold"
              >
                <span className="text-3xl text-pink-600 font-semibold">+</span>
                Nueva Barbería
              </Link>
            ))}
        </div>

        {/* Links del sidebar */}
        {!showSelector && (
          <>
            {/* Solo admin */}
            {userRole === "admin" && (
              <>
              <Link
                  href="/dashboard/panel"
                  onClick={() => setSidebarOpen(false)}
                >
                  🏠 Panel
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
                  🖼️ Feed
                </Link>
                <hr className="border-gray-700 my-2" />
              </>
            )}

            {/* Admin y barber */}
            {(userRole === "admin" || userRole === "barber" || userRole === "user") && (
              <>
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
                <Link
                  href="/dashboard/reportes"
                  onClick={() => setSidebarOpen(false)}
                >
                  📊 Reportes
                </Link>
                <hr className="border-gray-700 my-2" />
                 <Link
                  href="/dashboard/settings"
                  onClick={() => setSidebarOpen(false)}
                >
                  ⚙️ Configuración
                </Link>
              </>
            )}
          </>
        )}
      </nav>
    </aside>
  );
}
