"use client";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { useState } from "react";
import { IoCopyOutline } from "react-icons/io5";

export default function BookingActive({
  establishmentName,
}: {
  establishmentName?: string;
}) {
  const { activeEstablishment } = useEstablishment();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (activeEstablishment?.subdomain) {
      await navigator.clipboard.writeText(activeEstablishment.subdomain);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // mensaje temporal
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Turnos habilitados</h1>
      <p className="mb-6 text-gray-600 text-sm">
        {establishmentName} ya tiene habilitado el sistema de turnos. Copiá tu
        enlace personalizado y compartilo en tus redes para que tus clientes
        reserven fácilmente.
      </p>
      <div className="flex flex-col justify-center items-center gap-4 p-4 border rounded bg-luminiBrandBlue text-lg text-pink-500">
        <p>{activeEstablishment?.subdomain}</p>
        <button
          onClick={handleCopy}
          className="ml-4 bg-pink-500 py-2 px-4 text-white rounded hover:bg-pink-600"
        >
          Copiar
        </button>
      </div>
      {copied && (
        <p className="mt-2 text-pink-600">¡Copiado al portapapeles!</p>
      )}
    </div>
  );
}
