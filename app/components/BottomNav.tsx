"use client";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import {
  FiMenu,
  FiPlusCircle,
  FiCalendar,
  FiUser,
  FiLogOut,
  FiBookOpen,
  FiMessageSquare,
} from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOfferings } from "../hooks/useOfferings";
import { BiBarChart } from "react-icons/bi";
import { useUserEstablishment } from "../hooks/useUserEstablishment";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BottomNav({ onToggleSidebar, setSidebarOpen }: any) {
  const { user, logout } = useAuth();
  const { activeEstablishment } = useUserEstablishment(user);
  const { clientOfferings } = useOfferings(
    activeEstablishment?.id,
    activeEstablishment?.type?.id,
  );

  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupStep, setPopupStep] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const getAvatarSrc = (avatarUrl?: string) => {
    if (!avatarUrl) return "";
    if (avatarUrl.startsWith("http")) {
      return avatarUrl; // producción (Cloudinary)
    }
    return `${API_URL}${avatarUrl}`; // local
  };

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowPopup(false);
      }
    }
    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  // interceptar click en links protegidos
  const handleProtectedClick = (e: React.MouseEvent, href: string) => {
    if (!activeEstablishment) {
      e.preventDefault();
      setShowPopup(true);
      setPopupStep(1); // 👈 barbería no configurada
    } else if (clientOfferings.length === 0) {
      e.preventDefault();
      setShowPopup(true);
      setPopupStep(3); // 👈 barbería existe pero sin servicios
    } else {
      setSidebarOpen?.(false);
      router.push(href);
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 w-full bg-slate-900 border-t border-gray-700 flex justify-around items-center py-2 z-50">
        <button
          onClick={onToggleSidebar}
          className="flex items-center justify-center w-10 h-10 border-2 border-pink-600 rounded-md hover:bg-gray-800 focus:outline-none"
        >
          <FiMenu className="w-6 h-6 text-pink-600" />
        </button>

        {/* Turnos */}
        <Link
          href="/dashboard/appointments"
          onClick={(e) => handleProtectedClick(e, "/dashboard/turnos")}
          className="flex items-center justify-center text-pink-600"
        >
          <FiCalendar className="w-10 h-10" />
        </Link>

        {/* Cortes */}
        <Link
          href="/dashboard/offerings/add"
          onClick={(e) => handleProtectedClick(e, "/dashboard/offerings/add")}
          className="flex items-center justify-center text-pink-600"
        >
          <FiPlusCircle className="w-10 h-10" />
        </Link>

        <Link
          href="/dashboard/reportes"
          onClick={(e) => handleProtectedClick(e, "/dashboard/clientes")}
          className="flex items-center justify-center text-pink-600 border-2 rounded-lg"
        >
          <BiBarChart className="w-9 h-9" />
        </Link>

        {/* Avatar con menú */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col items-center text-white focus:outline-none"
          >
            {user?.userProfile?.avatarUrl ? (
              <img
                src={getAvatarSrc(user.userProfile.avatarUrl)}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover border border-gray-700"
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
          <div
            ref={popupRef}
            className="bg-gray-800 text-white p-6 rounded shadow-lg w-80 text-center"
          >
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
