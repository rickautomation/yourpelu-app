"use client";

import { useState, useEffect } from "react";

interface BarbershopInfoFormProps {
  info: {
    lema?: string;
    descripcion?: string;
    contacto?: string;
    horario?: string;
    name?: string;
    address?: string;
  };
  setInfo: React.Dispatch<
    React.SetStateAction<{
      lema?: string;
      descripcion?: string;
      contacto?: string;
      horario?: string;
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

  // 👇 sincroniza localInfo cuando cambie el prop info
  useEffect(() => {
    setLocalInfo(info);
  }, [info]);

  const handleChange = (field: keyof typeof localInfo, value: string) => {
    const updated = { ...localInfo, [field]: value };
    setLocalInfo(updated);
    setInfo(updated);
  };

  return (
    <form className="flex flex-col gap-4 p-4 rounded-lg shadow-md text-start">
      {/* Lema */}
      <div>
        <label className="block text-sm mb-1">Lema (opcional)</label>
        <input
          type="text"
          value={localInfo.lema || ""}
          onChange={(e) => handleChange("lema", e.target.value)}
          placeholder="Ej: 'Tu estilo, nuestra pasión'"
          className="px-3 py-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm mb-1">Descripción (opcional)</label>
        <textarea
          value={localInfo.descripcion || ""}
          onChange={(e) => handleChange("descripcion", e.target.value)}
          placeholder="Cuenta brevemente qué hace especial a tu barbería..."
          className="px-3 py-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400 h-24"
        />
      </div>

      {/* Contacto */}
      <div>
        <label className="block text-sm mb-1">Contacto</label>
        <input
          type="text"
          value={localInfo.contacto || ""}
          onChange={(e) => handleChange("contacto", e.target.value)}
          placeholder="Teléfono, WhatsApp o email"
          className="px-3 py-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>

      {/* Horario */}
      <div>
        <label className="block text-sm mb-1">Horario</label>
        <select
          value={localInfo.horario || ""}
          onChange={(e) => handleChange("horario", e.target.value)}
          className="px-3 py-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <option value="">Selecciona un horario</option>
          <option value="Lun-Sáb 10:00 - 20:00">Lun-Sáb 10:00 - 20:00</option>
          <option value="Lun-Vie 09:00 - 18:00">Lun-Vie 09:00 - 18:00</option>
          <option value="Solo turnos con cita">Solo turnos con cita</option>
        </select>
      </div>
    </form>
  );
}
