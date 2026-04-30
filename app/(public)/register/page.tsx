"use client";

import { View } from "@/app/types";
import { useState } from "react";
import { apiPost } from "../../lib/apiPost";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  setView: React.Dispatch<React.SetStateAction<View>>;
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
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      const data = await apiPost<{ ok: boolean }>("/auth/register", form);
      if (data.ok) {
        setMessage("Registro exitoso ✅");
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.log("err", err);
      setMessage(err.message);
    }
  }

  return (
    <div className="flex flex-col items-center animate-slideIn min-h-screen px-4">
      <p className="text-gray-500 text-center max-w-md">
        Registrate para empezar a gestionar tu peluquería. Vas a poder organizar
        turnos, clientes y cortes de manera simple y rápida, todo desde tu
        celular.
      </p>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-3 px-4"
      >
        <input
          type="text"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value.trim() })}
          className="px-3 py-2 rounded bg-luminiBrandBlue text-white"
          required
        />
        <input
          type="text"
          placeholder="Apellido"
          value={form.lastname}
          onChange={(e) => setForm({ ...form, lastname: e.target.value.trim() })}
          className="px-3 py-2 rounded bg-luminiBrandBlue text-white"
          required
        />
        <input
          type="tel"
          placeholder="Teléfono"
          value={form.phoneNumber}
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value.trim() })}
          className="px-3 py-2 rounded bg-luminiBrandBlue text-white"
          required
        />
        <input
          type="email"
          placeholder="Email" // 👈 nuevo campo
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value.trim() })}
          className="px-3 py-2 rounded bg-luminiBrandBlue text-white"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value.trim() })}
          className="px-3 py-2 rounded bg-luminiBrandBlue text-white"
          required
        />
        <button
          type="submit"
          className="bg-pink-500 px-4 py-2 rounded text-white hover:bg-pink-400 hover:text-white transition-colors"
        >
          Registrarse
        </button>
        <div className="py-3 flex justify-center">
          <Link
            href="/login"
            className="text-sm text-blue-400 hover:underline mb-2"
          >
            <p className="text-lg">¿Ya tenés cuenta? Iniciá sesión aquí.</p>
          </Link>
        </div>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
