"use client";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import {
  FiMenu,
  FiUsers,
  FiPlusCircle,
  FiCalendar,
  FiUser,
  FiLogOut,
  FiBookOpen,
  FiMessageSquare,
} from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { useUserBarbershops } from "../hooks/useUserBarbershops";
import { useServices } from "../hooks/useServices";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BottomNav({ onToggleSidebar, setSidebarOpen }: any) {
  const { user, logout } = useAuth();
  const { activeBarbershop } = useUserBarbershops(user);
  const { ownServices } = useServices(activeBarbershop?.id);

  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupStep, setPopupStep] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // cerrar menú si se hace click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // interceptar click en links protegidos
  // interceptar click en links protegidos
  const handleProtectedClick = (e: React.MouseEvent, href: string) => {
    if (!activeBarbershop) {
      e.preventDefault();
      setShowPopup(true);
      setPopupStep(1); // 👈 barbería no configurada
    } else if (ownServices.length === 0) {
      e.preventDefault();
      setShowPopup(true);
      setPopupStep(2); // 👈 barbería existe pero sin servicios
    } else {
      setSidebarOpen?.(false);
      router.push(href);
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-700 flex justify-around items-center py-2 z-50">
        <button
          onClick={onToggleSidebar}
          className="flex items-center justify-center w-10 h-10 border-2 border-pink-600 rounded-md hover:bg-gray-800 focus:outline-none"
        >
          <FiMenu className="w-6 h-6 text-pink-600" />
        </button>

        {/* Clientes */}
        <Link
          href="/dashboard/clientes"
          onClick={(e) => handleProtectedClick(e, "/dashboard/clientes")}
          className="flex items-center justify-center text-pink-600"
        >
          <FiUsers className="w-10 h-10" />
        </Link>

        {/* Cortes */}
        <Link
          href="/dashboard/cortes"
          onClick={(e) => handleProtectedClick(e, "/dashboard/cortes")}
          className="flex items-center justify-center text-pink-600"
        >
          <FiPlusCircle className="w-10 h-10" />
        </Link>

        {/* Turnos */}
        <Link
          href="/dashboard/turnos"
          onClick={(e) => handleProtectedClick(e, "/dashboard/turnos")}
          className="flex items-center justify-center text-pink-600"
        >
          <FiCalendar className="w-10 h-10" />
        </Link>

        {/* Avatar con menú */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col items-center text-white focus:outline-none"
          >
            {user?.userProfile?.avatarUrl ? (
              <img
                src={`${API_URL}${user.userProfile.avatarUrl}`}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border border-gray-700"
              />
            ) : (
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-500 text-white font-bold">
                {user?.name && user?.lastname
                  ? `${user.name.charAt(0)}${user.lastname.charAt(0)}`
                  : "U"}
              </div>
            )}
          </button>

          {menuOpen && (
            <div className="absolute bottom-12 right-0 bg-gray-800 text-white rounded shadow-lg w-52">
              <Link
                href="/dashboard/perfil"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700"
              >
                <FiUser /> Perfil
              </Link>
              <Link
                href="/dashboard/tutoriales"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700"
              >
                <FiBookOpen /> Tutoriales
              </Link>
              <Link
                href="/dashboard/comentarios"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700"
              >
                <FiMessageSquare /> Enviar comentarios
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-700"
              >
                <FiLogOut /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 px-4">
          <div className="bg-gray-800 text-white p-6 rounded shadow-lg w-80 text-center">
            <p className="mb-4">
              Es necesario configurar una barbería y servicios antes de acceder.
            </p>
            <button
              onClick={() => {
                setShowPopup(false);
                if (popupStep === 1) {
                  router.push("/dashboard/initial-setup?step=1");
                } else if (popupStep === 2) {
                  router.push("/dashboard/initial-setup?step=2");
                }
              }}
              className="px-4 py-2 bg-pink-600 text-white rounded-md shadow hover:bg-pink-700 transition"
            >
              Configura tu barbería
            </button>
          </div>
        </div>
      )}
    </>
  );
}
