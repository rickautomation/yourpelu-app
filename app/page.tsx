"use client";

import { useState } from "react";

import RegisterPage from "./register/page";
import LoginPage from "./login/page";

export default function Home() {
  const [view, setView] = useState<"home" | "login" | "register">("home");

  return (
    <section className="min-h-screen flex flex-col bg-gray-950 text-white relative overflow-hidden">
      {/* Navbar siempre visible */}
      <nav className="w-full bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="text-lg font-bold">
          Your<span className="text-pink-400">Pelu</span>
        </div>
      </nav>

      {/* Contenido dinámico */}
      <div className="flex-1 flex items-center justify-center px-6">
        {view === "home" && (
          <div className="text-center animate-fadeIn max-w-md">
            <h1 className="text-3xl font-bold mb-4">
              Bienvenido a <span className="text-pink-400">Your Pelu</span>
            </h1>
            <p className="text-gray-300 mb-6">
              Gestioná tu peluquería desde el celular: turnos, clientes y cortes
              en un solo lugar.
            </p>
            <p className="text-gray-400 mb-8 text-sm">
              Registrate gratis o iniciá sesión para empezar a organizar tu
              negocio.
            </p>
            <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
              <button
                onClick={() => setView("register")}
                className="border border-pink-400 px-4 py-2 rounded text-pink-400 hover:bg-pink-400 hover:text-white transition-colors"
              >
                Crear cuenta
              </button>
              <button
                onClick={() => setView("login")}
                className="border border-pink-400 px-4 py-2 rounded text-pink-400 hover:bg-pink-400 hover:text-white transition-colors"
              >
                Iniciar sesión
              </button>
            </div>
          </div>
        )}

        {view === "login" && <LoginPage setView={setView} />}
        {view === "register" && <RegisterPage setView={setView} />}
      </div>
    </section>
  );
}
