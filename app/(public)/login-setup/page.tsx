"use client";

import { View } from "@/app/types";
import { useState } from "react";
import { apiPost } from "../../lib/apiPost";
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      {/* Sección superior con fondo gris */}
      <div className="w-full flex flex-col items-center pb-10">
        <p className="text-gray-300 mb-6 text-center max-w-md">
          Iniciá sesión para acceder a tu panel de gestión. Con Your
          <span className="text-pink-400">Pelu</span> podés organizar turnos,
          clientes y cortes de manera simple y rápida, todo desde tu celular.
        </p>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Teléfono o Email"
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
      </div>

      {/* Sección inferior con fondo negro */}
      <div className="bg-gray-950 w-full flex-1"></div>
    </div>
  );
}
