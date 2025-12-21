"use client";

import { View } from "@/app/types";
import { useState } from "react";
import { apiPost } from "../lib/apiPost";
import { useRouter } from "next/navigation";

interface Props {
  setView: React.Dispatch<React.SetStateAction<View>>;
}

export default function LoginPage({ setView }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({ identifier: "", password: "" }); // 👈 usamos identifier
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      const data = await apiPost<{ ok: boolean; token?: string }>(
        "/auth/login",
        form
      );
      if (data.ok) {
        if (data.token) {
          localStorage.setItem("auth_token", data.token);
        }
        setMessage("Login exitoso ✅");
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.log("err: ", err)
      setMessage(err.message);
    }
  }

  async function handleFakeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      const data = await apiPost<{ ok: boolean; token?: string }>(
        "/auth/login",
        form
      );
      if (data.ok) {
        setMessage("Login exitoso ✅");
        router.push("/dashboard");
      }
    } catch (err: any) {
      setMessage(err.message);
    }
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 animate-slideIn px-4">
      {/* Logo más arriba */}
      <div className="absolute top-20 text-5xl font-bold">
        <button
          onClick={() => setView?.("home")}
          className="hover:text-pink-400 transition-colors"
        >
          Your<span className="text-pink-400">Pelu</span>
        </button>
      </div>

      {/* Texto de bienvenida */}
      <h2 className="text-2xl font-bold mb-2 mt-24">
        ¡Qué bueno tenerte de vuelta!
      </h2>
      <p className="text-gray-300 mb-6 text-center max-w-md">
        Iniciá sesión para acceder a tu panel de gestión. Con Your
        <span className="text-pink-400">Pelu</span> podés organizar turnos,
        clientes y cortes de manera simple y rápida, todo desde tu celular.
      </p>

      {/* Formulario */}
      <form
        onSubmit={handleFakeSubmit}
        className="w-full max-w-sm flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Teléfono o Email" // 👈 ahora puede ser cualquiera
          value={form.identifier}
          onChange={(e) => setForm({ ...form, identifier: e.target.value })}
          className="px-3 py-2 rounded bg-gray-800 text-white"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="px-3 py-2 rounded bg-gray-800 text-white"
          required
        />
        <button
          type="submit"
          className="border border-pink-400 px-4 py-2 rounded text-pink-400 hover:bg-pink-400 hover:text-white transition-colors"
        >
          Entrar
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}

      {/* Links inferiores */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setView?.("register")}
          className="text-sm text-gray-400 hover:text-pink-400"
        >
          Ir a Registro →
        </button>
        <button
          onClick={() => setView?.("home")}
          className="text-sm text-gray-400 hover:text-pink-400"
        >
          ← Volver
        </button>
      </div>
    </div>
  );
}
