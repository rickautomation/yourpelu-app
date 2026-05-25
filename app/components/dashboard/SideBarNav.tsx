"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { apiPost } from "@/app/lib/apiPost";
import { useOfferings } from "@/app/hooks/useOfferings";
import { useEstablishment } from "@/app/context/EstablishmentContext";

import {
  FiUsers,
  FiImage,
  FiSettings,
  FiCalendar,
  FiList,
  FiPlusCircle,
} from "react-icons/fi";
import SidebarLink from "./SidebarLink";
import { BiMaleFemale } from "react-icons/bi";
import { MdOutlineAddHomeWork } from "react-icons/md";

type Establishment = {
  id: string;
  name: string;
  address?: string;
  type?: EstablishmentType;
  slug: string;
  bookingEnabled: boolean;
};

type EstablishmentType = {
  id: string;
  name: string;
  description: string;
};

type UserRole = "admin" | "staff" | "client" | "user";

export default function SidebarNav({
  setSidebarOpen,
  userRole,
  userId,
  sessionId,
}: {
  setSidebarOpen: (open: boolean) => void;
  userRole: UserRole;
  userId: string;
  sessionId: string;
}) {
  const { establishments, activeEstablishment, setActiveEstablishment } =
    useEstablishment();
  const { clientOfferings, loading } = useOfferings(
    activeEstablishment?.id,
    activeEstablishment?.type?.id,
  );

  const [showSelector, setShowSelector] = useState(false);

  const router = useRouter();

  const handleSelectEstablishment = async (shop: Establishment) => {
    try {
      await apiPost("/current-establishments/set", {
        userId,
        establishmentId: shop.id,
        sessionId,
      });

      // 👇 actualizar estado local
      setActiveEstablishment(shop);
      setShowSelector(false);

      // 👇 notificar al resto de la app
      window.dispatchEvent(new Event("barbershop-changed"));
      router.refresh();
    } catch (err) {
      console.error("Error cambiando barbería activa", err);
    }
  };

  return (
    <aside
      className="
    fixed top-0 left-0 h-full w-full
    bg-darkBrandBlue px-3 py-4 flex flex-col gap-3 z-40
    transform transition-transform duration-300
    translate-x-0
  "
    >
      <nav className="flex flex-col gap-2 px-3">
        <div className="text-center">
          <div className="text-xl font-bold w-full flex items-center justify-center gap-1 pt-4 pb-6">
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
                className="h-16 w-auto"
              />
            </Link>
          </div>
          {(userRole === "admin" || userRole === "user") &&
            establishments.length > 0 && (
              <>
                {/* Botón para abrir/cerrar selector */}
                <button
                  className="flex items-center justify-between w-full px-4 py-2 text-2xl font-semibold bg-exposeBrandBlue text-white rounded-md hover:bg-pink-600 transition"
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
                      strokeWidth={4}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown selector */}
                {showSelector && (
                  <>
                    <div className="rounded-b-md bg-exposeBrandBlue border border-gray-700 shadow-lg">
                      {establishments.map((shop) => (
                        <button
                          key={shop.id}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-700 border border-b border-gray-600 ${
                            activeEstablishment?.id === shop.id
                              ? "bg-brandBlue text-pink-400"
                              : "text-white"
                          }`}
                          onClick={() => handleSelectEstablishment(shop)}
                        >
                          <p className="font-bold">{shop.name}</p>
                          <p className="text-sm text-gray-400">
                            {shop.address}
                          </p>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
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
          </div>
        )}

        {/* Links del sidebar */}
        {!showSelector && clientOfferings.length > 0 && (
          <div className="flex flex-col gap-3 mt-4 text-exposeBrandBlue">
            {userRole === "admin" && (
              <>
                <div className="flex gap-3">
                  <SidebarLink
                    href="/dashboard/staff"
                    setSidebarOpen={setSidebarOpen}
                    className="basis-1/2 flex items-center text-end justify-start gap-2 rounded-md p-4 text-xl transition-colors cursor-pointer"
                  >
                    <FiUsers className="w-8 h-8" />
                    <p>Team</p>
                  </SidebarLink>

                  <SidebarLink
                    href="/dashboard/barbershop-profile-settings"
                    setSidebarOpen={setSidebarOpen}
                    className="basis-1/2 flex items-center justify-start gap-2 rounded-md p-4 text-xl transition-colors cursor-pointer"
                  >
                    <FiImage className="w-8 h-8" />
                    <p>Feed</p>
                  </SidebarLink>
                </div>
              </>
            )}

            {(userRole === "admin" ||
              userRole === "staff" ||
              userRole === "user") && (
              <>
                <div className="flex justify-between gap-3">
                  <SidebarLink
                    href="/dashboard/offerings"
                    setSidebarOpen={setSidebarOpen}
                    className="basis-1/2 flex items-center justify-start gap-2 rounded-md p-4 text-lg transition-colors cursor-pointer"
                  >
                    <FiList className="inline w-8 h-8" />
                    <div>
                      <p>Servicios</p>
                    </div>
                  </SidebarLink>
                  <SidebarLink
                    href="/dashboard/offerings/add"
                    setSidebarOpen={setSidebarOpen}
                    className="basis-1/2 flex items-center justify-start gap-2 rounded-md p-4 text-lg transition-colors cursor-pointer"
                  >
                    <FiPlusCircle className="inline w-8 h-8" />
                    <p>Registrar </p>
                  </SidebarLink>
                </div>

                <div className="flex justify-between gap-3">
                  <SidebarLink
                    href="/dashboard/appointments"
                    setSidebarOpen={setSidebarOpen}
                    className="basis-1/2 flex items-center justify-start gap-2 rounded-md p-4 text-xl transition-colors cursor-pointer"
                  >
                    <FiCalendar className="inline w-8 h-8" />
                    <p>Turnos</p>
                  </SidebarLink>
                  <SidebarLink
                    href="/dashboard/clientes"
                    setSidebarOpen={setSidebarOpen}
                    className="basis-1/2 flex items-center justify-start gap-2 rounded-md p-4 text-xl transition-colors cursor-pointer"
                  >
                    <BiMaleFemale className="w-8 h-8" />
                    <p>Clientes</p>
                  </SidebarLink>
                </div>

                <div className="flex justify-start">
                  <SidebarLink
                    href="/dashboard/settings"
                    setSidebarOpen={setSidebarOpen}
                    className="flex items-center justify-start gap-2 rounded-md p-4 text-xl transition-colors cursor-pointer"
                    style={{ width: "calc(50% - 0.375rem)" }}
                  >
                    <FiSettings className="inline w-8 h-8" />
                    <p>Config</p>
                  </SidebarLink>
                </div>
              </>
            )}
          </div>
        )}
      </nav>

      {userRole === "admin" && (
        <button
          onClick={() => {
            router.push("/dashboard/initial-setup?step=1");
            setSidebarOpen(false);
          }}
          className="fixed bottom-20 right-6 p-2 rounded-md bg-pink-500 text-white  shadow-md shadow-black hover:bg-pink-600 transition-colors"
        >
          <MdOutlineAddHomeWork className="text-3xl" />
        </button>
      )}
    </aside>
  );
}
