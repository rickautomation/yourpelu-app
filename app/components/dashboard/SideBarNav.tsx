"use client";
import { useState } from "react";
import Link from "next/link";
import { apiPost } from "@/app/lib/apiPost";
import { useServices } from "@/app/hooks/useServices";
import {
  FiHome,
  FiUsers,
  FiScissors,
  FiImage,
  FiSettings,
  FiCalendar,
  FiBarChart2,
  FiDroplet,
  FiBox,
  FiList,
  FiLayers,
} from "react-icons/fi";
import SidebarLink from "./SidebarLink";

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
  const { globalServices, ownServices } = useServices(activeBarbershop?.id);

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
    fixed top-0 left-0 h-full w-full
    bg-gray-900 px-3 py-4 flex flex-col gap-3 z-40
    transform transition-transform duration-300
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
                        <span className="text-3xl text-pink-600 font-semibold">
                          +
                        </span>
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

        {ownServices.length < 1 && (
          <div className="flex flex-col gap-2 mt-4 text-white text-center py-2 rounded">
            <SidebarLink
              href="/dashboard/initial-setup"
              setSidebarOpen={setSidebarOpen}
            >
              Empezar la configuración
            </SidebarLink>
          </div>
        )}

        {/* Links del sidebar */}
        {!showSelector && ownServices.length > 0 && (
          <>
            {userRole === "admin" && (
              <>
                <SidebarLink href="/dashboard" setSidebarOpen={setSidebarOpen}>
                  <FiHome className="inline w-5 h-5 mr-2" /> Home
                </SidebarLink>
                <SidebarLink
                  href="/dashboard/barberos"
                  setSidebarOpen={setSidebarOpen}
                >
                  <FiUsers className="inline w-5 h-5 mr-2" /> Barberos
                </SidebarLink>
                <SidebarLink
                  href="/dashboard/barbershop-profile-settings"
                  setSidebarOpen={setSidebarOpen}
                >
                  <FiImage className="inline w-5 h-5 mr-2" /> Feed
                </SidebarLink>
                <hr className="border-gray-700 my-2" />
              </>
            )}

            {(userRole === "admin" ||
              userRole === "barber" ||
              userRole === "user") && (
              <>
                <SidebarLink
                  href="/dashboard/servicios"
                  setSidebarOpen={setSidebarOpen}
                >
                  <FiList className="inline w-5 h-5 mr-2" /> Servicios
                </SidebarLink>
                <SidebarLink
                  href="/dashboard/cortes"
                  setSidebarOpen={setSidebarOpen}
                >
                  <FiScissors className="inline w-5 h-5 mr-2" /> Cortes
                </SidebarLink>
                <SidebarLink
                  href="/dashboard/haircut-styles"
                  setSidebarOpen={setSidebarOpen}
                >
                  <FiLayers className="inline w-5 h-5 mr-2" /> Estilos
                </SidebarLink>
                <SidebarLink
                  href="/dashboard/coloraciones"
                  setSidebarOpen={setSidebarOpen}
                >
                  <FiDroplet className="inline w-5 h-5 mr-2" /> Coloraciones
                </SidebarLink>
                <SidebarLink
                  href="/dashboard/insumos"
                  setSidebarOpen={setSidebarOpen}
                >
                  <FiBox className="inline w-5 h-5 mr-2" /> Insumos
                </SidebarLink>
                <hr className="border-gray-700 my-2" />
                <SidebarLink
                  href="/dashboard/turnos"
                  setSidebarOpen={setSidebarOpen}
                >
                  <FiCalendar className="inline w-5 h-5 mr-2" /> Turnos
                </SidebarLink>
                <SidebarLink
                  href="/dashboard/clientes"
                  setSidebarOpen={setSidebarOpen}
                >
                  <FiUsers className="inline w-5 h-5 mr-2" /> Clientes
                </SidebarLink>
                <hr className="border-gray-700 my-2" />
                <SidebarLink
                  href="/dashboard/reportes"
                  setSidebarOpen={setSidebarOpen}
                >
                  <FiBarChart2 className="inline w-5 h-5 mr-2" /> Reportes
                </SidebarLink>
                <hr className="border-gray-700 my-2" />
                <SidebarLink
                  href="/dashboard/settings"
                  setSidebarOpen={setSidebarOpen}
                >
                  <FiSettings className="inline w-5 h-5 mr-2" /> Configuración
                </SidebarLink>
              </>
            )}
          </>
        )}
      </nav>
    </aside>
  );
}
