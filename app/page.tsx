"use client";

import { useState } from "react";

import RegisterPage from "./register/page";
import LoginPage from "./login/page";
import Image from "next/image";

export default function Home() {
  const [view, setView] = useState<"home" | "login" | "register">("home");

  return (
    <section className="min-h-screen flex flex-col bg-gray-950 text-white relative overflow-hidden">
      <div className="bg-gray-950 pt-10">
        <Image
          src="/yourpelu-logo.png"
          alt="Yourpelu Logo"
          width={150}
          height={150}
          className="mx-auto h-24 w-auto"
        />
      </div>
      <div className="mt-8 flex items-center justify-center px-6">
        {view === "home" && (
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
