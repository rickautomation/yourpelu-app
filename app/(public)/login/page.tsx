"use client";

import { View } from "@/app/types";
import { useState } from "react";
import { apiPost } from "@/app/lib/apiPost";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      const data = await apiPost<{ ok: boolean }>("/auth/login", form);
      if (data.ok) {
        setMessage("Login exitoso ✅");
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.log("err: ", err);
      setMessage(err.message);
    }
  }

  async function handleFakeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      const data = await apiPost<{ ok: boolean; token?: string }>(
        "/auth/login",
        form,
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
    <div className="h-full flex flex-col items-center justify-center bg-gray-950 animate-slideIn px-4">
      <p className="text-gray-500 mb-6 text-center max-w-md">
        Iniciá sesión para acceder a tu panel de gestión. Con Your
        <span className="text-pink-400">Pelu</span> podés organizar turnos,
        clientes y cortes de manera simple y rápida, todo desde tu celular.
      </p>

      {/* Formulario */}
      <form
        onSubmit={handleFakeSubmit}
        className="w-full max-w-sm flex flex-col gap-4 px-4"
      >
        <input
          type="text"
          placeholder="Teléfono o Email" // 👈 ahora puede ser cualquiera
          value={form.identifier}
          onChange={(e) => setForm({ ...form, identifier: e.target.value.trim() })}
          className="px-3 py-2 rounded bg-gray-800 text-white"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value.trim() })}
          className="px-3 py-2 rounded bg-gray-800 text-white"
          required
        />
        <button
          type="submit"
          className="border border-pink-400 px-4 py-2 rounded text-pink-400 hover:bg-pink-400 hover:text-white transition-colors"
        >
          Entrar
        </button>
        <div className="py-3 flex justify-center">
          <Link href="/register" className="hover:underline mb-2">
            <p className="text-lg text-blue-400">
              ¿No tenés cuenta? Registrate aquí.
            </p>
          </Link>
        </div>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
