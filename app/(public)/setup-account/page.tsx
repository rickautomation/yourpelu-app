"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "../../lib/apiPost";
import { apiGet } from "@/app/lib/apiGet";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SetupAccountPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<{
    name: string;
    lastname: string;
    establishments: string[];
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    setToken(t);

    if (t) {
      apiGet<{ name: string; lastname: string; establishments: string[] }>(
        `/user/for-setup/${t}`,
      )
        .then((data) => setUserData(data))
        .catch((err) => setMessage(err.message));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage("Token no encontrado en la URL");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      setTimeout(() => setMessage(""), 2000); // 👈 limpiar después de 2s
      return;
    }

    try {
      const data = await apiPost<{ message: string }>("/user/setup-account", {
        token,
        password,
      });
      setMessage(data.message);

      if (data.message.includes("correctamente")) {
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  // 👇 funciones para mostrar por 2 segundos
  const togglePasswordVisibility = () => {
    setShowPassword(true);
    setTimeout(() => setShowPassword(false), 2000);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(true);
    setTimeout(() => setShowConfirmPassword(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 h-full">
      <div className="text-center max-w-md">
        <h1 className="text-2xl text-white mb-2">
          ¡Bienvenido <span className="text-pink-600">{userData?.name}</span>!
        </h1>
        <p className="text-gray-300">
          Por favor, establece tu nueva contraseña para activar tu cuenta en{" "}
          <span className="text-pink-600 text-lg">
            {userData?.establishments[0]}
          </span>
          .
        </p>
      </div>
      <div className="w-full max-w-md text-lg text-center">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input contraseña */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-ligthBrandBlue text-white focus:outline-none focus:ring-2 focus:ring-pink-400 pr-10"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-2 text-gray-400 hover:text-white"
            >
              {showPassword ? <FaEyeSlash size={26} /> : <FaEye size={26} />}
            </button>
          </div>

          {/* Confirmar contraseña */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repetir contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-ligthBrandBlue text-white focus:outline-none focus:ring-2 focus:ring-pink-400 pr-10"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-2 top-2 text-gray-400 hover:text-white"
            >
              {showConfirmPassword ? (
                <FaEyeSlash size={26} />
              ) : (
                <FaEye size={26} />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 text-white mt-4 py-2 rounded hover:bg-pink-600 transition-colors font-semibold"
          >
            Guardar contraseña
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-lg font-semibold ${
              message.includes("correctamente")
                ? "text-green-400"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
