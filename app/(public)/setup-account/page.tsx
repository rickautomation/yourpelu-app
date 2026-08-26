"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "../../lib/apiPost";
import { apiGet } from "@/app/lib/apiGet";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";

export default function SetupAccountPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<{
    name: string;
    lastname: string;
    establishments: string[];
  } | null>(null);
  
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    setToken(t);

    if (t) {
      apiGet<{ name: string; lastname: string; establishments: string[] }>(
        `/user/for-setup/${t}`
      )
        .then((data) => setUserData(data))
        .catch((err) =>
          setMessage({
            text: err.message || "Error al obtener la información del usuario.",
            isError: true,
          })
        )
        .finally(() => setInitialLoading(false));
    } else {
      setMessage({
        text: "Enlace inválido o sin token de activación.",
        isError: true,
      });
      setInitialLoading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!token) {
      setMessage({ text: "Token no encontrado en la URL", isError: true });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ text: "Las contraseñas no coinciden", isError: true });
      return;
    }

    setLoading(true);

    try {
      const data = await apiPost<{ message: string }>("/user/setup-account", {
        token,
        password,
      });

      const isSuccess = data.message.toLowerCase().includes("correctamente") || data.message.toLowerCase().includes("éxito");
      
      setMessage({
        text: data.message || "Contraseña guardada con éxito.",
        isError: !isSuccess,
      });

      if (isSuccess) {
        setTimeout(() => {
          router.push("/workspace");
        }, 1500);
      }
    } catch (err: any) {
      console.error("Error al activar la cuenta:", err);
      setMessage({
        text: err.message || "Error al guardar la contraseña. Intenta nuevamente.",
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 animate-slideIn">
      {/* Encabezado descriptivo */}
      <div className="text-center max-w-md mb-6">
        {initialLoading ? (
          <div className="flex items-center justify-center gap-2 text-gray-300">
            <FaSpinner className="animate-spin text-lg text-pink-400" />
            <span>Cargando datos de invitación...</span>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white mb-2">
              ¡Hola <span className="text-pink-400">{userData?.name || "usuario"}</span>!
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Establecé tu nueva contraseña para activar tu cuenta en{" "}
              <span className="text-pink-400 font-semibold">
                {userData?.establishments?.[0] || "tu establecimiento"}
              </span>
              .
            </p>
          </>
        )}
      </div>

      {/* Tarjeta de Formulario */}
      <div className="w-full max-w-md p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Nueva Contraseña */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Nueva Contraseña
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-gray-400 text-sm">
                <FaLock />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-gray-900/50 border border-pink-600/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-gray-400 hover:text-white transition"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Repetir Contraseña
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-gray-400 text-sm">
                <FaLock />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-gray-900/50 border border-pink-600/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 text-gray-400 hover:text-white transition"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
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
            disabled={loading || initialLoading || !token}
            className={`mt-2 w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
              loading || initialLoading || !token
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-pink-600 hover:bg-pink-700 text-white shadow-pink-600/30"
            }`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin text-base" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <FaCheckCircle />
                <span>Guardar contraseña</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}