"use client";
import { useState } from "react";
import { Barbershop } from "@/app/interfaces";

interface BarbershopFormProps {
  barbershop?: Barbershop | null;
  userId?: string;
  onSave: (data: {
    name: string;
    phoneNumber: string;
    address: string;
  }) => Promise<void>;
}

export default function BarbershopForm({
  barbershop,
  userId,
  onSave,
}: BarbershopFormProps) {
  const [name, setName] = useState(barbershop?.name || "");
  const [phoneNumber, setPhoneNumber] = useState(barbershop?.phoneNumber || "");
  const [address, setAddress] = useState(barbershop?.address || "");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave({
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
      });

      setMessage("Barbería guardada ✅");
      setTimeout(() => setMessage(null), 2000);
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "Error al guardar barbería ❌");
      setTimeout(() => setMessage(null), 2000);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {message && (
        <div className="mb-4 bg-pink-500 text-white text-center py-2 rounded">
          {message}
        </div>
      )}

      <div>
        <label className="block text-sm mb-1">Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre de la barbería"
          required
          className="px-3 py-2 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Contacto</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Número de contacto"
          required
          className="px-3 py-2 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Ubicación</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Dirección o ciudad"
          required
          className="px-3 py-2 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>

      <button
        type="submit"
        className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors font-semibold"
      >
        {barbershop ? "Actualizar" : "Guardar"}
      </button>
    </form>
  );
}
