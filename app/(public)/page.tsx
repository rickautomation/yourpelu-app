"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <section className="min-h-screen flex flex-col bg-gray-950 text-white relative overflow-hidden">
      <div className="mt-8 flex items-center justify-center px-6">
        <div className="text-center animate-fadeIn max-w-md">
          <p className="text-gray-300">
            Gestioná tu peluquería desde el celular: turnos, clientes y cortes
            en un solo lugar.
          </p>
          <p className="text-gray-400 mb-8 text-sm">
            Registrate gratis o iniciá sesión para empezar a organizar tu
            negocio.
          </p>
          <div className="flex flex-col gap-4 w-full max-w-xs mx-auto mt-6">
            <button
              onClick={() => router.push("/register")}
              className="border border-pink-400 px-4 py-2 rounded text-pink-400 hover:bg-pink-400 hover:text-white transition-colors"
            >
              Crear cuenta
            </button>
            <button
              onClick={() => router.push("/login")}
              className="border border-pink-400 px-4 py-2 rounded text-pink-400 hover:bg-pink-400 hover:text-white transition-colors"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}