// NavBar.tsx
"use client";
import Link from "next/link";
import { useAuth } from "../lib/useAuth";

export default function Navbar({
  onToggleSidebar,
}: {
  onToggleSidebar?: () => void;
}) {
  const { isAuthenticated } = useAuth();

  return (
    <header className="w-full flex items-center justify-between bg-gray-900 text-white px-4 py-3">
      <div className="flex items-center gap-3">
        {isAuthenticated && onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md hover:bg-gray-800 focus:outline-none"
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
        <div className="text-lg font-bold">
          <Link
            href="/dashboard"
            className="hover:text-pink-400 transition-colors"
          >
            Your<span className="text-pink-400">Pelu</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
