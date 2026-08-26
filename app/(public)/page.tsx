"use client";

import { useRouter } from "next/navigation";
import { FaCut, FaUserPlus, FaSignInAlt } from "react-icons/fa";

export default function Home() {
  const router = useRouter();

  return (
    <section className="flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden animate-slideIn">
      <div className="text-center max-w-md w-full">
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
          Gestioná tu establecimiento desde el celular: turnos, clientes y servicios en un solo lugar.
        </p>

        {/* Tarjeta de Acciones */}
        <div className="w-full rounded-2xl border border-pink-600/40 bg-luminiBrandBlue p-6 sm:p-8 shadow-xl">
          <p className="text-xs text-gray-300 mb-6 leading-relaxed">
            Registrate gratis o iniciá sesión para empezar a organizar tu negocio de forma simple y rápida.
          </p>

          <div className="flex flex-col gap-3.5 w-full">
            <button
              onClick={() => router.push("/register")}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-pink-600 hover:bg-pink-700 text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30"
            >
              <FaUserPlus className="text-base" />
              <span>Crear cuenta</span>
            </button>

            <button
              onClick={() => router.push("/login")}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gray-900/50 hover:bg-pink-600/20 border border-pink-600/40 text-pink-300 hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
            >
              <FaSignInAlt className="text-base" />
              <span>Iniciar sesión</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}