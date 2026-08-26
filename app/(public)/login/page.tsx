"use client";

import { View } from "@/app/types";
import { useState } from "react";
import { apiPost } from "@/app/lib/apiPost";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaLock, FaUser, FaSignInAlt, FaSpinner, FaCut } from "react-icons/fa";

interface Props {
  setView?: React.Dispatch<React.SetStateAction<View>>;
}

export default function LoginPage({ setView }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const data = await apiPost<{ ok: boolean }>("/auth/login", {
        identifier: form.identifier.trim(),
        password: form.password,
      });

      if (data.ok) {
        setMessage({
          text: "¡Ingreso exitoso! Redirigiendo...",
          isError: false,
        });
        setTimeout(() => {
          // Usar window.location en lugar de router.push en flujos de login
          window.location.href = "/workspace";
        }, 300);
      }
    } catch (err: any) {
      console.error("Error de autenticación:", err);
      setMessage({
        text: err.message || "Credenciales inválidas. Intenta nuevamente.",
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 animate-slideIn">
      {/* Encabezado descriptivo */}
      <div className="text-center max-w-md mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">¡Hola de nuevo!</h1>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          Iniciá sesión para acceder a tu panel. Con Your
          <span className="text-pink-400 font-semibold">Pelu</span> gestionás
          turnos, clientes y servicios en un solo lugar.
        </p>
      </div>

      {/* Tarjeta de Formulario */}
      <div className="w-full max-w-md p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Campo Identificador */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Teléfono o Email
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-gray-400 text-sm">
                <FaUser />
              </span>
              <input
                type="text"
                placeholder="ejemplo@correo.com o teléfono"
                value={form.identifier}
                onChange={(e) =>
                  setForm({ ...form, identifier: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900/50 border border-pink-600/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
                required
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Contraseña
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-gray-400 text-sm">
                <FaLock />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900/50 border border-pink-600/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
                required
              />
            </div>
          </div>

          {/* Alerta de feedback */}
          {message && (
            <div
              className={`p-3 rounded-xl text-xs font-medium text-center border ${
                message.isError
                  ? "bg-red-950/40 border-red-500/40 text-red-300"
                  : "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Botón de Enviar */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-2 w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
              loading
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-pink-600 hover:bg-pink-700 text-white shadow-pink-600/30"
            }`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin text-base" />
                <span>Ingresando...</span>
              </>
            ) : (
              <>
                <FaSignInAlt />
                <span>Iniciar Sesión</span>
              </>
            )}
          </button>
        </form>

        {/* Registro Footer */}
        <div className="mt-6 pt-5 border-t border-pink-600/20 text-center">
          <p className="text-xs text-gray-400">
            ¿Aún no tenés una cuenta?{" "}
            <Link
              href="/register"
              className="text-pink-400 hover:text-pink-300 font-semibold hover:underline transition"
            >
              Registrate acá
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
