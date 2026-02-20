"use client";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { FiMenu, FiUsers, FiPlusCircle, FiCalendar } from "react-icons/fi";
import { useUserBarbershops } from "../hooks/useUserBarbershops";
import { apiPost } from "../lib/apiPost";

export default function BottomNav({
  onToggleSidebar,
  sessionId,
}: {
  onToggleSidebar?: () => void;
  sessionId?: string;
}) {
  const { user } = useAuth();
  const { activeBarbershop, barbershops, setActiveBarbershop } = useUserBarbershops(user);

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-700 flex justify-around items-center py-2 z-50">
      <button
        onClick={onToggleSidebar}
        className="flex items-center justify-center w-10 h-10 border-2 border-pink-600 rounded-md hover:bg-gray-800 focus:outline-none"
      >
        <FiMenu className="w-6 h-6 text-pink-600" />
      </button>

      <Link
        href="/dashboard/clientes"
        className="flex items-center justify-center text-pink-600"
      >
        <FiUsers className="w-10 h-10" />
      </Link>

      <Link
        href="/dashboard/cortes"
        className="flex items-center justify-center text-white"
      >
        <FiPlusCircle className="w-10 h-10 text-pink-600" />
      </Link>

      <Link
        href="/dashboard/turnos"
        className="flex items-center justify-center text-pink-600"
      >
        <FiCalendar className="w-10 h-10" />
      </Link>

      <Link
        href="/dashboard/perfil"
        className="flex flex-col items-center text-white"
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
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
      </Link>
    </nav>
  );
}
