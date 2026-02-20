"use client";
import Link from "next/link";
import { useAuth } from "../lib/useAuth";
import { Barbershop } from "../interfaces";
import { useState, useRef, useEffect } from "react";
import { apiPost } from "../lib/apiPost";
import Image from "next/image";

export default function Navbar({
  onToggleSidebar,
  activeBarbershop,
  setActiveBarbershop,
  barbershops,
  userId,
  sessionId,
  sidebarOpen,
}: {
  onToggleSidebar?: () => void;
  activeBarbershop?: Barbershop | null;
  setActiveBarbershop?: (shop: Barbershop) => void;
  barbershops?: Barbershop[];
  userId?: string;
  sessionId?: string;
  sidebarOpen?: boolean;
}) {
  const { isAuthenticated, user } = useAuth();
  const [showSelector, setShowSelector] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelectBarbershop = async (shop: Barbershop) => {
    try {
      await apiPost("/current-barbershops/set", {
        userId,
        barbershopId: shop.id,
        sessionId,
      });
      setActiveBarbershop?.(shop);
      setShowSelector(false);
      window.dispatchEvent(new Event("barbershop-changed"));
    } catch (err) {
      console.error("Error cambiando barbería activa", err);
    }
  };

  console.log("barbershops quantity: ", barbershops?.length)

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
    <header className="w-full flex items-center justify-between text-white px-4 py-2 relative z-50">
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
          {activeBarbershop && !sidebarOpen && (barbershops?.length ?? 0) > 1 && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowSelector(!showSelector)}
                className="px-1 py-2 border border-pink-300 rounded-md text-sm text-pink-300 font-semibold flex items-center gap-2 hover:bg-pink-600 hover:text-white transition"
              >
                {activeBarbershop.name}
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

              {showSelector && barbershops && (
                <div className="absolute mt-2 w-40 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 left-0">
                  {barbershops.map((shop) => (
                    <button
                      key={shop.id}
                      onClick={() => handleSelectBarbershop(shop)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-700 ${
                        activeBarbershop?.id === shop.id
                          ? "bg-gray-900 text-pink-400"
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
