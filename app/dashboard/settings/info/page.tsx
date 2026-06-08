"use client";

import { useState } from "react";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function InformationPage() {
  const { activeEstablishment } = useEstablishment();
  const router = useRouter();

  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: activeEstablishment?.name || "",
    phoneNumber: activeEstablishment?.phoneNumber || "",
    address: activeEstablishment?.address || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (field: string) => {
    console.log(
      `Guardando ${field}:`,
      formData[field as keyof typeof formData],
    );
    // acá iría tu lógica de actualización (PATCH/PUT al backend)
    setEditingField(null);
  };

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <header className="flex gap-1 border-b border-gray-700 pb-4 text-start text-xl">
        <p onClick={() => router.push(`/dashboard/settings`)}>Configuracion</p>
        <p>{">"}</p>
        <p>Informacion</p>
      </header>

      {["name", "phoneNumber", "address"].map((field) => (
        <div key={field} className="mb-4 mt-4 text-start">
          <label className="block font-semibold capitalize">
            {field === "phoneNumber"
              ? "Teléfono"
              : field === "address"
                ? "Dirección"
                : "Nombre"}
          </label>

          {editingField === field ? (
            <div className="flex gap-2">
              <input
                type="text"
                name={field}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                className="border p-2 flex-1"
              />
              <button
                onClick={() => handleSave(field)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Guardar
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-end text-lg">
              <span>{formData[field as keyof typeof formData]}</span>
              <button
                onClick={() => setEditingField(field)}
                className="text-3xl text-pink-500 underline"
              >
                <FaEdit />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
