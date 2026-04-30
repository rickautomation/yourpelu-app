"use client";
import Link from "next/link";
import { useAuth } from "../lib/useAuth";
import { useState, useRef, useEffect } from "react";
import { apiPost } from "../lib/apiPost";
import Image from "next/image";

type Barbershop = {
  id: string;
  name: string;
  address?: string;
};

type EstablishmentType = {
  id: string;
  name: string;
  description: string;
};

type Establishment = {
  id: string;
  name: string;
  address?: string;
  type?: EstablishmentType;
  profile?: Profile;
};

type Profile = {
  id: string;
  lema?: string | null;
  description?: string | null;
  openingHours?: string | null;
  openingHours2?: string | null;
  adressCoordinates?: string | null;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  images: string[];
};

export default function Navbar({
  onToggleSidebar,
  activeEstablishment,
  setActiveEstablishment,
  establishments,
  userId,
  sessionId,
  sidebarOpen,
}: {
  onToggleSidebar?: () => void;
  activeEstablishment?: Establishment | null;
  setActiveEstablishment: (shop: Establishment) => void;
  establishments?: Establishment[];
  userId?: string;
  sessionId?: string;
  sidebarOpen?: boolean;
}) {
  const { isAuthenticated, user } = useAuth();
  const [showSelector, setShowSelector] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelectEstablishment = async (shop: Establishment) => {
    try {
      await apiPost("/current-estabishment/set", {
        userId,
        establishmentId: shop.id,
        sessionId,
      });
      setActiveEstablishment?.(shop);
      setShowSelector(false);
      window.dispatchEvent(new Event("establishment-changed"));
    } catch (err) {
      console.error("Error cambiando barbería activa", err);
    }
  };

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

  const getImageSrc = (url?: string | null) => {
    if (!url) return "";
    if (url.startsWith("http")) {
      return url;
    }
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  };

  // 👇 cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSelector(false);
      }
    };
    if (showSelector) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSelector]);

  return (
    <header className="w-full flex items-center justify-between text-white p-4 relative z-50">
      {/* Lado izquierdo: menú + logo */}
      <div className="flex items-center gap-1">
        <div className="text-xl font-bold">
          <Link
            href="/dashboard"
            className="hover:text-pink-400 transition-colors"
            onClick={() => {
              if (sidebarOpen && onToggleSidebar) {
                onToggleSidebar(); // 👈 solo lo cierra si está abierto
              }
            }}
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
      </div>

      {/* Lado derecho: barbería activa + avatar */}
      {isAuthenticated && (
        <div className="flex items-center gap-3 relative">
          {activeEstablishment &&
            !sidebarOpen &&
            (establishments?.length ?? 0) > 1 && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowSelector(!showSelector)}
                  className="px-1 text-lg font-semibold flex items-center gap-2 hover:bg-pink-600 hover:text-white transition"
                >
                  <Image
                    src={getImageSrc(activeEstablishment?.profile?.logoUrl)}
                    alt={`${activeEstablishment?.name} logo`}
                    width={30}
                    height={30}
                    className="rounded-md bg-white"
                    unoptimized
                  />
                  {activeEstablishment.name}
                  <svg
                    className={`w-4 h-4 transform transition-transform ${
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

                {showSelector && establishments && (
                  <div className="absolute mt-2 w-40 bg-exposeBrandBlue border border-gray-700 rounded-md shadow-lg z-50 right-0">
                    {establishments.map((shop) => (
                      <button
                        key={shop.id}
                        onClick={() => handleSelectBarbershop(shop)}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-700 ${
                          activeEstablishment?.id === shop.id
                            ? "bg-darkBrandBlue text-pink-400"
                            : "text-white"
                        }`}
                      >
                        <p className="font-bold">{shop.name}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
        </div>
      )}
    </header>
  );
}
