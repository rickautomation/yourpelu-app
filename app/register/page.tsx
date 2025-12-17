"use client";

import { View } from "@/app/types";
import { useState } from "react";
import { apiPost } from "../lib/apiPost";
import { useRouter } from "next/navigation";

interface Props {
  setView: React.Dispatch<React.SetStateAction<View>>;
}

export default function RegisterPage({ setView }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    lastname: "",
    phoneNumber: "",
    email: "", // 👈 agregado
    password: "",
  });
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      const data = await apiPost<{ ok: boolean; token?: string }>(
        "/auth/register",
        form
      );
      if (data.ok) {
        if (data.token) {
          localStorage.setItem("auth_token", data.token);
        }
        setMessage("Registro exitoso ✅");
        router.push("/dashboard");
      }
    } catch (err: any) {
      setMessage(err.message);
    }
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 animate-slideIn px-4">
      {/* Logo más arriba */}
      <div className="absolute top-16 text-5xl font-bold">
        <button
          onClick={() => setView?.("home")}
          className="hover:text-pink-400 transition-colors"
        >
          Your<span className="text-pink-400">Pelu</span>
        </button>
      </div>

      {/* Texto de bienvenida ampliado */}
      <h2 className="text-2xl font-bold mb-2 mt-20">¡Bienvenido!</h2>
      <p className="text-gray-300 mb-6 text-center max-w-md">
        Registrate para empezar a gestionar tu peluquería. Con Your
        <span className="text-pink-400">Pelu</span> vas a poder organizar
        turnos, clientes y cortes de manera simple y rápida, todo desde tu
        celular.
      </p>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="px-3 py-2 rounded bg-gray-800 text-white"
          required
        />
        <input
          type="text"
          placeholder="Apellido"
          value={form.lastname}
          onChange={(e) => setForm({ ...form, lastname: e.target.value })}
          className="px-3 py-2 rounded bg-gray-800 text-white"
          required
        />
        <input
          type="tel"
          placeholder="Teléfono"
          value={form.phoneNumber}
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          className="px-3 py-2 rounded bg-gray-800 text-white"
          required
        />
        <input
          type="email"
          placeholder="Email" // 👈 nuevo campo
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
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
          Registrarse
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}

      {/* Links inferiores */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setView?.("login")}
          className="text-lg text-gray-400 hover:text-pink-400"
        >
          Ir a Login →
        </button>
        <button
          onClick={() => setView?.("home")}
          className="text-lg text-gray-400 hover:text-pink-400"
        >
          ← Volver
        </button>
      </div>
    </div>
  );
}
