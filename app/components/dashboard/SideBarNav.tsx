"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiPost } from "@/app/lib/apiPost";

import {
  FiUsers,
  FiImage,
  FiSettings,
  FiCalendar,
  FiBarChart2,
  FiBox,
  FiList,
  FiPlusCircle,
  FiDollarSign,
  FiShoppingCart,
  FiLayers,
  FiGrid,
} from "react-icons/fi";
import SidebarLink from "./SidebarLink";
import Image from "next/image";
import { useOfferings } from "@/app/hooks/useOfferings";
import {
  IoAnalyticsSharp,
  IoChatboxEllipsesOutline,
  IoGiftOutline,
} from "react-icons/io5";
import { BiMaleFemale } from "react-icons/bi";

type Barbershop = {
  id: string;
  name: string;
  address?: string;
};

type Establishment = {
  id: string;
  name: string;
  address?: string;
  type?: EstablishmentType
};

type EstablishmentType = {
  id: string;
  name: string;
  description: string;
};

type UserRole = "admin" | "staff" | "client" | "user";

export default function SidebarNav({
  establishments,
  activeEstablishment,
  setActiveEstablishment,
  setSidebarOpen,
  userRole,
  userId,
  sessionId,
}: {
  establishments: Establishment[];              // 👈 antes barbershops
  activeEstablishment: Establishment | null;   // 👈 antes activeBarbershop
  setActiveEstablishment: (shop: Establishment) => void;
  setSidebarOpen: (open: boolean) => void;
  userRole: UserRole;
  userId: string;
  sessionId: string;
}) {
  const { clientOfferings, loading } = useOfferings(activeEstablishment?.id, activeEstablishment?.type?.id);

  const [showSelector, setShowSelector] = useState(false);

  const router = useRouter();

  const handleSelectBarbershop = async (shop: Barbershop) => {
    try {
      await apiPost("/current-establishments/set", {
        userId,
        barbershopId: shop.id,
        sessionId,
      });

      // 👇 actualizar estado local
      setActiveEstablishment(shop);
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
    bg-slate-900 px-3 py-4 flex flex-col gap-3 z-40
    transform transition-transform duration-300
    translate-x-0
  "
    >
      <nav className="flex flex-col gap-2 px-3">
        <div className="text-center">
          <div className="text-xl font-bold w-full flex items-center justify-center gap-1 pb-2">
            <Link
              href="/dashboard"
              onClick={() => setSidebarOpen(false)}
              className="hover:text-pink-400 transition-colors"
            >
              <Image
                src="/yourpelu-logo.png"
                alt="Yourpelu Logo"
                width={68}
                height={68}
                className="h-10 w-auto"
              />
            </Link>
          </div>
          {(userRole === "admin" || userRole === "user") &&
            (establishments.length > 0 ? (
              <>
                {/* Botón para abrir/cerrar selector */}
                <button
                  className="flex items-center justify-between w-full px-4 py-2 text-lg font-semibold text-pink-600 border border-pink-600 rounded-md hover:bg-pink-600 hover:text-white transition"
                  onClick={() => setShowSelector(!showSelector)}
                >
                  {activeEstablishment?.name || "Seleccionar barbería"}
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
                      {establishments.map((shop) => (
                        <button
                          key={shop.id}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-700 ${
                            activeEstablishment?.id === shop.id
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
                        href="/dashboard/initial-setup?step=1"
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center justify-start gap-2 w-full px-4 py-1 border border-pink-600 rounded-md text-xl font-semibold text-white hover:bg-pink-600 hover:text-white transition"
                      >
                        <span className="text-3xl text-pink-600 font-semibold">
                          +
                        </span>
                        Nuevo establecimiento
                      </Link>
                    </div>
                  </>
                )}
              </>
            ) : (
              // 👇 Si no hay barberías, mostrar solo el botón Nueva Barbería
              <Link
                href="/dashboard/initial-setup?step=1"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-start gap-2 w-full px-4 py-1 border border-pink-600 rounded-md text-xl font-semibold"
              >
                <span className="text-3xl text-pink-600 font-semibold">+</span>
                Nuevo establecimiento
              </Link>
            ))}
        </div>

        {loading && (
          <div className="flex justify-center items-center mt-4">
            <svg
              className="animate-spin h-6 w-6 text-pink-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <span className="ml-2 text-pink-600 text-sm">Cargando...</span>
          </div>
        )}

        {/* Links del sidebar */}
        {!showSelector && clientOfferings.length > 0 && (
          <div className="flex flex-col gap-2 mt-4 text-pink-600">
            {userRole === "admin" && (
              <>
                <div className="flex justify-between">
                  <SidebarLink
                    href="/dashboard/staff"
                    setSidebarOpen={setSidebarOpen}
                  >
                    <div className="flex w-26  border rounded-md p-2 px-2 py-4 items-end text-xs text-end">
                      <FiUsers className="inline w-8 h-8 mr-1" />
                      <p>Team</p>
                    </div>
                  </SidebarLink>
                  <SidebarLink
                    href="/dashboard/barbershop-profile-settings"
                    setSidebarOpen={setSidebarOpen}
                  >
                    <div className="flex w-26  border rounded-md p-2 px-2 py-4 items-end text-xs text-end">
                      <FiImage className="inline w-8 h-8 mr-2" />
                      <p>Feed</p>
                    </div>
                  </SidebarLink>
                  <SidebarLink
                    href="/dashboard/chat"
                    setSidebarOpen={setSidebarOpen}
                  >
                    <div className="flex w-26  border rounded-md p-2 px-2 py-4 items-end text-xs text-end">
                      <IoChatboxEllipsesOutline className="inline w-8 h-8 mr-2" />
                      <p>Chat</p>
                    </div>
                  </SidebarLink>
                </div>
              </>
            )}

            {(userRole === "admin" ||
              userRole === "staff" ||
              userRole === "user") && (
              <>
                <div className="flex justify-between">
                  <SidebarLink
                    href="/dashboard/offerings"
                    setSidebarOpen={setSidebarOpen}
                  >
                    <div className="flex w-26  border rounded-md px-2 py-4 items-end text-xs text-center">
                      <FiList className="inline w-8 h-8 mr-2" />
                      <div className="text-start">
                        <p>Lista de </p>
                        <p>Servicios</p>
                      </div>
                    </div>
                  </SidebarLink>
                  <SidebarLink
                    href="/dashboard/offerings/categories"
                    setSidebarOpen={setSidebarOpen}
                  >
                    <div className="flex w-26  border rounded-md p-2 px-2 py-4 items-end text-xs text-end">
                      <FiGrid className="inline w-8 h-8 mr-2" />
                      <div className="text-start">
                        <p>Catego_</p>
                        <p>rias</p>
                      </div>
                    </div>
                  </SidebarLink>
                  <SidebarLink
                    href="/dashboard/offerings/add"
                    setSidebarOpen={setSidebarOpen}
                  >
                    <div className="flex w-26  border rounded-md p-2 px-2 py-4 items-end text-xs text-end">
                      <FiPlusCircle className="inline w-8 h-8 mr-2" />
                      <div>
                        <p>Registrar </p>
                        <p>Servicio</p>
                      </div>
                    </div>
                  </SidebarLink>
                </div>

                <div className="flex justify-between">
                  <SidebarLink
                    href="/dashboard/appointments"
                    setSidebarOpen={setSidebarOpen}
                  >
                    <div className="flex w-26  border rounded-md p-2 px-2 py-4 items-end text-xs text-end">
                      <FiCalendar className="inline w-8 h-8 mr-2" />
                      <p>Turnos</p>
                    </div>
                  </SidebarLink>
                  <SidebarLink
                    href="/dashboard/clientes"
                    setSidebarOpen={setSidebarOpen}
                  >
                    <div className="flex w-26  border rounded-md p-2 px-2 py-4 items-end text-xs text-end">
                      <BiMaleFemale className="w-8 h-8 mr-2" />
                      <p>Clientes</p>
                    </div>
                  </SidebarLink>
                  <SidebarLink
                    href="/dashboard/promotions"
                    setSidebarOpen={setSidebarOpen}
                  >
                    <div className="flex w-26  border rounded-md p-2 px-2 py-4 items-end text-xs text-end">
                      <IoGiftOutline className="inline w-8 h-8 mr-2" />
                      <div>
                        <p>Promo</p>
                        <p>ciones</p>
                      </div>
                    </div>
                  </SidebarLink>
                </div>

                <div className="flex justify-between">
                  <SidebarLink
                    href="/dashboard/insumos"
                    setSidebarOpen={setSidebarOpen}
                  >
                    <div className="flex w-26  border rounded-md p-2 px-2 py-4 items-end text-xs text-end">
                      <FiBox className="inline w-8 h-8 mr-2" />
                      <p>Insumos</p>
                    </div>
                  </SidebarLink>
                  <SidebarLink
                    href="/dashboard/insumos/sell"
                    setSidebarOpen={setSidebarOpen}
                  >
                    <div className="flex w-26  border rounded-md p-2 px-2 py-4 items-end text-xs">
                      <FiShoppingCart className="inline w-10 h-8 mr-2" />
                      <p>Vender insumos</p>
                    </div>
                  </SidebarLink>
                  <SidebarLink
                    href="/dashboard/insumos/stock"
                    setSidebarOpen={setSidebarOpen}
                  >
                    <div className="flex w-26  border rounded-md p-2 px-2 py-4 items-end text-xs text-end">
                      <FiLayers className="inline w-8 h-8 mr-2" />
                      <p>Inventario</p>
                    </div>
                  </SidebarLink>
                </div>

                <div className="flex justify-between">
                  <SidebarLink
                    href="/dashboard/reportes"
                    setSidebarOpen={setSidebarOpen}
                  >
                    <div className="flex w-26  border rounded-md p-2 px-2 py-4 items-end text-xs text-end">
                      <FiBarChart2 className="inline w-8 h-8 mr-2" />
                      <p>Reportes</p>
                    </div>
                  </SidebarLink>
                  <SidebarLink
                    href="/dashboard/analitycs"
                    setSidebarOpen={setSidebarOpen}
                  >
                    <div className="flex w-26 border rounded-md p-2 px-2 py-4 items-end text-xs text-end">
                      <IoAnalyticsSharp className="inline w-8 h-8 mr-2" />
                      <p>Analytics</p>
                    </div>
                  </SidebarLink>
                  <SidebarLink
                    href="/dashboard/cash-closing"
                    setSidebarOpen={setSidebarOpen}
                  >
                    <div className="flex w-26 border rounded-md p-2 px-2 py-4 items-end text-xs text-start">
                      <FiDollarSign className="inline w-8 h-8 mr-2" />
                      <p>Cierre de caja</p>
                    </div>
                  </SidebarLink>
                </div>

                <div className="flex justify-end">
                  <SidebarLink
                    href="/dashboard/settings"
                    setSidebarOpen={setSidebarOpen}
                  >
                    <div className="flex w-26  border rounded-md p-2 px-2 py-4 items-end text-xs text-end">
                      <FiSettings className="inline w-8 h-8 mr-2" />
                      <p>Config</p>
                    </div>
                  </SidebarLink>
                </div>
              </>
            )}
          </div>
        )}

        {!loading && clientOfferings && clientOfferings.length < 1 && (
          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={() => {
                setSidebarOpen(false);
                router.push("/dashboard/initial-setup?step=3");
              }}
              className="px-4 py-2 bg-pink-600 text-white rounded-md shadow hover:bg-pink-700 transition"
            >
              Configura tu establecimiento
            </button>
          </div>
        )}
      </nav>
    </aside>
  );
}
