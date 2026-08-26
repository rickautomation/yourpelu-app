"use client";

import { View } from "@/app/types";
import { useState } from "react";
import { apiPost } from "../../lib/apiPost";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaUserPlus,
  FaSpinner,
} from "react-icons/fa";

interface Props {
  setView?: React.Dispatch<React.SetStateAction<View>>;
}

export default function RegisterPage({ setView }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    lastname: "",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const payload = {
        name: form.name.trim(),
        lastname: form.lastname.trim(),
        phoneNumber: form.phoneNumber.trim(),
        email: form.email.trim(),
        password: form.password,
      };

      const data = await apiPost<{ ok: boolean }>("/auth/register", payload);

      if (data.ok) {
        setMessage({ text: "¡Registro exitoso! Redirigiendo...", isError: false });
        setTimeout(() => {
          router.push("/workspace");
        }, 1000);
      }
    } catch (err: any) {
      console.error("Error en registro:", err);
      setMessage({
        text: err.message || "No se pudo completar el registro. Intenta nuevamente.",
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-6 animate-slideIn">
      {/* Encabezado descriptivo */}
      <div className="text-center max-w-md mb-4">
        <h1 className="text-2xl font-bold text-white mb-2">Creá tu cuenta</h1>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          Registrate para empezar a gestionar tu local. Con Your
          <span className="text-pink-400 font-semibold">Pelu</span> organizás turnos,
          clientes y servicios de manera simple y rápida.
        </p>
      </div>

      {/* Tarjeta de Formulario */}
      <div className="w-full max-w-md px-6 py-2 sm:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          
          {/* Nombre y Apellido en grilla de 2 columnas en pantallas medianas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Campo Nombre */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                Nombre
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-gray-400 text-sm">
                  <FaUser />
                </span>
                <input
                  type="text"
                  placeholder="María"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900/50 border border-pink-600/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
                  required
                />
              </div>
            </div>

            {/* Campo Apellido */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                Apellido
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-gray-400 text-sm">
                  <FaUser />
                </span>
                <input
                  type="text"
                  placeholder="Gómez"
                  value={form.lastname}
                  onChange={(e) => setForm({ ...form, lastname: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900/50 border border-pink-600/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
                  required
                />
              </div>
            </div>
          </div>

          {/* Campo Teléfono */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Teléfono
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-gray-400 text-sm">
                <FaPhone />
              </span>
              <input
                type="tel"
                placeholder="1112345678"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900/50 border border-pink-600/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
                required
              />
            </div>
          </div>

          {/* Campo Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Email
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-gray-400 text-sm">
                <FaEnvelope />
              </span>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                <span>Registrando...</span>
              </>
            ) : (
              <>
                <FaUserPlus />
                <span>Registrarse</span>
              </>
            )}
          </button>
        </form>

        {/* Login Footer */}
        <div className="mt-6 pt-5 border-t border-pink-600/20 text-center">
          <p className="text-xs text-gray-400">
            ¿Ya tenés una cuenta?{" "}
            <Link
              href="/login"
              className="text-pink-400 hover:text-pink-300 font-semibold hover:underline transition"
            >
              Iniciá sesión acá
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}