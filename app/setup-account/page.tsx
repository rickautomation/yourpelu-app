"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // 👈 importar router
import { apiPost } from "../lib/apiPost";

export default function SetupAccountPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter(); // 👈 inicializar router

  // Leer token de la URL
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await apiPost<{ message: string }>("/user/setup-account", {
        token,
        password,
      });
      setMessage(data.message);

      // 👇 si activación correcta, redirigir al login después de 2s
      if (data.message.includes("correctamente")) {
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 gap-4 p-4">
      <div className="text-5xl font-bold">
        Your<span className="text-pink-400">Pelu</span>
      </div>
      <div className="text-center max-w-md">
        <h1 className="text-2xl text-white mb-2">¡Bienvenido!</h1>
        <p className="text-gray-300">
          Por favor, establece tu nueva contraseña para activar tu cuenta.
        </p>
      </div>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition-colors font-semibold"
          >
            Guardar contraseña
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-sm font-semibold ${
              message.includes("correctamente")
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}