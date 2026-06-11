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
      <p className="mb-6 text-gray-600">
        {establishmentName} ya tiene habilitado el sistema de turnos. Copiá tu
        enlace personalizado y compartilo en tus redes para que tus clientes
        reserven fácilmente.
      </p>
      <div className="border rounded bg-luminiBrandBlue p-6 text-lg text-pink-500 flex items-center justify-between">
        <span>{activeEstablishment?.subdomain}</span>
        <button
          onClick={handleCopy}
          className="ml-4  border border-pink-500 p-1 text-white rounded hover:bg-pink-600"
        >
          <IoCopyOutline />
        </button>
      </div>
      {copied && (
        <p className="mt-2 text-pink-600">¡Copiado al portapapeles!</p>
      )}
    </div>
  );
}
