"use client";

import { useState, useEffect } from "react";

interface BarbershopInfoFormProps {
  info: {
    lema?: string;
    descripcion?: string;
    horario1?: string;
    horario2?: string;
    contacto?: string;
    name?: string;
    address?: string;
  };
  setInfo: React.Dispatch<
    React.SetStateAction<{
      lema?: string;
      descripcion?: string;
      horario1?: string;
      horario2?: string;
      contacto?: string;
      name?: string;
      address?: string;
    }>
  >;
}

export default function BarbershopInfoForm({
  info,
  setInfo,
}: BarbershopInfoFormProps) {
  const [localInfo, setLocalInfo] = useState(info);

  useEffect(() => {
    setLocalInfo(info);
  }, [info]);

  const handleChange = (field: keyof typeof localInfo, value: string) => {
    const updated = { ...localInfo, [field]: value };
    setLocalInfo(updated);
    setInfo(updated);
  };

  return (
    <form className="flex flex-col gap-3 p-6 shadow-lg text-start text-white">
      {/* Lema */}
      <div>
        <label className="block text-sm font-medium mb-2 text-pink-300">
          Lema (opcional)
        </label>
        <input
          type="text"
          value={localInfo.lema || ""}
          onChange={(e) => handleChange("lema", e.target.value)}
          placeholder="Ej: 'Tu estilo, nuestra pasión'"
          className="px-4 py-2 rounded-lg bg-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400"
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium mb-2 text-pink-300">
          Descripción (opcional)
        </label>
        <textarea
          value={localInfo.descripcion || ""}
          onChange={(e) => handleChange("descripcion", e.target.value)}
          placeholder="Cuenta brevemente qué hace especial a tu barbería..."
          className="px-4 py-2 rounded-lg bg-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-pink-400 h-28 placeholder-gray-400 resize-none"
        />
      </div>

      {/* Contacto */}
      <div>
        <label className="block text-sm font-medium mb-2 text-pink-300">
          Contacto
        </label>
        <input
          type="text"
          value={localInfo.contacto || ""} // 👈 vacío por defecto
          onChange={(e) => handleChange("contacto", e.target.value)}
          placeholder="Teléfono, WhatsApp o email"
          className="px-4 py-2 rounded-lg bg-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400"
        />
      </div>

      {/* Horarios */}
      <div>
        <label className="block text-sm font-medium mb-2 text-pink-300">
          Horario principal
        </label>
        <input
          type="text"
          value={localInfo.horario1 || ""}
          onChange={(e) => handleChange("horario1", e.target.value)}
          placeholder="Ej: Lunes a Viernes 9:00 - 13:00 y 16:00 - 21:00"
          className="px-4 py-2 rounded-lg bg-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-pink-300">
          Horario adicional (opcional)
        </label>
        <input
          type="text"
          value={localInfo.horario2 || ""}
          onChange={(e) => handleChange("horario2", e.target.value)}
          placeholder="Ej: Sábados 9:00 - 16:00"
          className="px-4 py-2 rounded-lg bg-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400"
        />
      </div>
    </form>
  );
}