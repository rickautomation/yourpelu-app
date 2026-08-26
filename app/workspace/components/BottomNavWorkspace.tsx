"use client";
import Link from "next/link";
import { useSecureAuth } from "@/app/hooks/useSecureAuth";
import { useUserProfile } from "@/app/hooks/useUserProfile"; // 👈 nuevo hook
import {
  FiMenu,
  FiCalendar,
  FiUser,
  FiLogOut,
  FiPlusCircle,
} from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { BiBarChart } from "react-icons/bi";
import AddOptionsModal from "./AddOptionsModal";
import { MdAttachMoney } from "react-icons/md";
import { LuChartNoAxesCombined } from "react-icons/lu";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BottomNavWorkspace({
  onToggleSidebar,
  setSidebarOpen,
}: any) {
  const { user, logout } = useSecureAuth();

  // 👇 traemos el perfil con el hook nuevo
  const { profile } = useUserProfile(user?.id);
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); // 👈 nuevo estado
  const menuRef = useRef<HTMLDivElement>(null);

  const getAvatarSrc = (avatarUrl?: string) => {
    if (!avatarUrl) return "";
    if (avatarUrl.startsWith("http")) return avatarUrl;
    return `${API_URL}${avatarUrl}`;
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
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-darkBrandBlue border-t border-gray-700 flex justify-around items-center px-2 py-2 z-50 text-pink-500">
      <button
        onClick={onToggleSidebar}
        className="flex items-center justify-center w-10 h-10 border-4 border-pink-500 rounded-md hover:bg-gray-800 focus:outline-none"
      >
        <FiMenu className="w-6 h-6" />
      </button>

      {/* Ejemplo: Turnos en workspace */}
      <Link
        href="/workspace/finance"
        onClick={() => setSidebarOpen?.(false)}
        className="flex items-center justify-center border-4 rounded-lg"
      >
        <MdAttachMoney className="w-8 h-8" />
      </Link>

      {user?.rol === "admin" ? (
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center"
        >
          <FiPlusCircle className="w-10 h-10" />
        </button>
      ) : (
        <Link
          href="/workspace/commercial/offerings/add"
          onClick={() => setSidebarOpen?.(false)}
          className="flex items-center justify-center"
        >
          <FiPlusCircle className="w-10 h-10" />
        </Link>
      )}

      <Link
        href="/workspace/metrics"
        onClick={() => setSidebarOpen?.(false)}
        className="flex items-center justify-center border-4 rounded-lg"
      >
        <LuChartNoAxesCombined className="w-8 h-8" />
      </Link>

      {/* Avatar con menú */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col items-center text-white focus:outline-none"
        >
          {profile?.avatarUrl ? (
            <img
              src={getAvatarSrc(profile.avatarUrl)}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover border border-gray-700"
            />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center border border-pink-600 rounded-full bg-luminiBrandBlue text-white font-bold">
              {user?.name && user?.lastname
                ? `${user.name.charAt(0)}${user.lastname.charAt(0)}`
                : "U"}
            </div>
          )}
        </button>

        {menuOpen && (
          <div className="absolute bottom-full right-0 mb-2 bg-exposeBrandBlue text-lg text-white rounded shadow-lg w-72">
            <Link
              href="/workspace/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 p-4 border border-t border-gray-700 hover:bg-gray-700"
            >
              <FiUser /> Perfil
            </Link>
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full text-left p-4 border border-t border-gray-700 hover:bg-gray-700"
            >
              <FiLogOut /> Cerrar sesión
            </button>
          </div>
        )}
      </div>

      {/* 👇 renderiza el modal si es admin y se activó */}
      {showAddModal && (
        <AddOptionsModal
          onClose={() => setShowAddModal(false)}
          setSidebarOpen={setSidebarOpen}
        />
      )}
    </nav>
  );
}
