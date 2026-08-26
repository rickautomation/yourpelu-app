"use client";

import { useEstablishment } from "@/app/context/EstablishmentContext";
import { useAuth } from "@/app/hooks/useAuth";
import { apiPost } from "@/app/lib/apiPost";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RiBriefcase2Line, RiTeamLine } from "react-icons/ri";
import { MdAttachMoney } from "react-icons/md";
import { useNavigation } from "@/app/lib/useNavegation";
import { LuChartNoAxesCombined } from "react-icons/lu";
import { IoAddSharp } from "react-icons/io5";
import AdminMenu from "./components/AdminMenu";
import StaffMenu from "./components/StaffMenu";

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

export default function MenuPage({
  setSidebarOpen,
  sidebarOpen,
}: {
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
}) {
  const { user } = useAuth();
  const { establishments, activeEstablishment, setActiveEstablishment } =
    useEstablishment();
  const [showSelector, setShowSelector] = useState(false);
  const { goTo } = useNavigation();

  const router = useRouter();

  console.log("menu user: ", user);

  const handleSelectEstablishment = async (shop: Establishment) => {
    try {
      await apiPost("/current-establishments/set", {
        userId: user?.id,
        establishmentId: shop.id,
      });

      // 👇 actualizar estado local
      setActiveEstablishment(shop);
      setShowSelector(false);

      // 👇 notificar al resto de la app
      window.dispatchEvent(new Event("barbershop-changed"));
      //   router.refresh();
    } catch (err) {
      console.error("Error cambiando barbería activa", err);
    }
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full w-full
        bg-darkBrandBlue px-3 py-4 flex flex-col gap-3
        transform transition-transform duration-500 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        z-40
      `}
    >
      <nav className="flex flex-col gap-2 px-3">
        <div className="text-center">
          <div className="text-xl font-bold w-full flex items-center justify-center gap-1 pt-4 pb-6">
            <Link
              href="/workspace"
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
          {(user?.rol === "admin" || user?.rol === "user") &&
            establishments.length > 1 && (
              <>
                {/* Botón para abrir/cerrar selector */}
                <button
                  className="flex items-center justify-between w-full px-4 py-2 text-2xl font-semibold bg-luminiBrandBlue text-white rounded-md hover:bg-pink-600 transition"
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
                  <div className="grid grid-cols-2 gap-2 py-2 w-full">
                    {establishments.map((shop) => (
                      <button
                        key={shop.id}
                        className={`text-center px-2 py-6 hover:bg-gray-700 border border-b border-gray-600 rounded-md w-full h-20 ${
                          activeEstablishment?.id === shop.id
                            ? "bg-luminiBrandBlue text-pink-400"
                            : "text-white"
                        }`}
                        onClick={() => handleSelectEstablishment(shop)}
                      >
                        <p className="font-bold">{shop.name}</p>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

          {/* menú según rol */}
          {!showSelector && (
            <>
              {user?.rol === "admin" && (
                <AdminMenu setSidebarOpen={setSidebarOpen} />
              )}
              {user?.rol === "staff" && (
                <StaffMenu setSidebarOpen={setSidebarOpen} />
              )}
            </>
          )}

          <button className="fixed bottom-20 right-6 p-2 rounded-full bg-pink-500 text-white shadow-md shadow-black hover:bg-pink-600 transition-colors">
            <IoAddSharp className="text-3xl " />
          </button>
        </div>
      </nav>
    </aside>
  );
}
