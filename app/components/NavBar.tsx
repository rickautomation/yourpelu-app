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
    <header className="w-full flex items-center justify-between bg-gray-900 text-white px-4 py-2 relative">
      {/* Lado izquierdo: menú + logo */}
      <div className="flex items-center gap-1">
        {isAuthenticated && onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-1 border border-gray-700 rounded-md hover:bg-gray-800 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}
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
              width={64}
              height={64}
              className="h-7 w-auto"
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
                className="p-1 border border-pink-300 rounded-md text-sm text-pink-300 font-semibold flex items-center gap-2 hover:bg-pink-600 hover:text-white transition"
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

          {/* Avatar o iniciales */}
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="User Avatar"
              className="w-6 h-6 rounded-full border border-gray-700"
            />
          ) : (
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-500 text-white font-bold">
              {user?.name && user?.lastname
                ? `${user.name.charAt(0)}${user.lastname.charAt(0)}`
                : "U"}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
