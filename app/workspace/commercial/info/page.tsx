"use client";

import { useState, useEffect } from "react";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import {
  FaEdit,
  FaPhone,
  FaMapMarkerAlt,
  FaStore,
  FaCheck,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { apiPatch } from "@/app/lib/apiPatch";

export default function InformationPage() {
  const { activeEstablishment, fetchEstablishmentById } = useEstablishment();
  const router = useRouter();

  const [editingField, setEditingField] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: activeEstablishment?.name || "",
    phoneNumber: activeEstablishment?.phoneNumber || "",
    address: activeEstablishment?.address || "",
  });

  // Sincronizar formData cada vez que activeEstablishment cambie
  useEffect(() => {
    if (activeEstablishment) {
      setFormData({
        name: activeEstablishment.name || "",
        phoneNumber: activeEstablishment.phoneNumber || "",
        address: activeEstablishment.address || "",
      });
    }
  }, [activeEstablishment]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: string
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave(field);
    } else if (e.key === "Escape") {
      handleCancel(field);
    }
  };

  const handleSave = async (field: string) => {
    setSaving(true);
    try {
      const value = formData[field as keyof typeof formData];
      await apiPatch(`/establishment/${activeEstablishment?.id}`, {
        [field]: value,
      });

      if (activeEstablishment?.id) {
        await fetchEstablishmentById(activeEstablishment.id);
      }

      setEditingField(null);
    } catch (err: any) {
      alert(`Error al guardar ${field}: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = (field: string) => {
    // Restaurar el valor original al cancelar
    setFormData((prev) => ({
      ...prev,
      [field]: activeEstablishment?.[field as keyof typeof formData] || "",
    }));
    setEditingField(null);
  };

  // Configuración metadata de los campos
  const fieldConfig: Record<
    string,
    { label: string; icon: React.ReactNode; placeholder: string }
  > = {
    name: {
      label: "Nombre del negocio",
      icon: <FaStore className="text-pink-500 text-xl" />,
      placeholder: "Ej: Barbería Lumini",
    },
    phoneNumber: {
      label: "Teléfono de contacto",
      icon: <FaPhone className="text-pink-500 text-lg" />,
      placeholder: "Ej: +54 9 11 1234 5678",
    },
    address: {
      label: "Dirección física",
      icon: <FaMapMarkerAlt className="text-pink-500 text-xl" />,
      placeholder: "Ej: Av. Siempreviva 742",
    },
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      {/* Contenedor principal estilizado */}
      <div className="space-y-6">
        <div className="border-b border-white/10 pb-4 text-center">
          <h2 className="text-xl font-bold text-white">
            Información del Establecimiento
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Administra los datos visibles de tu negocio
          </p>
        </div>

        <div className="space-y-4">
          {["name", "phoneNumber", "address"].map((field) => {
            const config = fieldConfig[field];
            const isEditing = editingField === field;
            const currentValue = formData[field as keyof typeof formData];

            return (
              <div
                key={field}
                className="bg-luminiBrandBlue p-4 rounded-lg border border-white/5 transition-all"
              >
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                  {config.label}
                </span>

                {isEditing ? (
                  <div className="space-y-3 mt-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pink-500/10 rounded-md shrink-0">
                        {config.icon}
                      </div>
                      <input
                        type="text"
                        name={field}
                        value={currentValue}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, field)}
                        placeholder={config.placeholder}
                        autoFocus
                        className="w-full bg-exposeBrandBlue border border-pink-500/50 rounded-md p-2 text-white text-base focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleCancel(field)}
                        disabled={saving}
                        className="flex items-center gap-1 bg-ligthBrandBlue hover:bg-gray-600 text-white text-xs px-3 py-1.5 rounded-md transition-colors"
                      >
                        <FaTimes /> Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSave(field)}
                        disabled={saving}
                        className="flex items-center gap-1 bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold px-4 py-1.5 rounded-md transition-colors shadow-sm disabled:opacity-50"
                      >
                        {saving ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaCheck />
                        )}
                        Guardar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-3 pr-2 overflow-hidden">
                      <div className="p-2 bg-pink-500/10 rounded-md shrink-0">
                        {config.icon}
                      </div>
                      <span
                        className={`text-base truncate ${
                          currentValue
                            ? "text-white font-medium"
                            : "text-gray-500 italic text-sm"
                        }`}
                      >
                        {currentValue || "Sin registrar"}
                      </span>
                    </div>
                    <button
                      onClick={() => setEditingField(field)}
                      className="p-2 text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 rounded-full transition-colors shrink-0"
                      title="Editar campo"
                    >
                      <FaEdit className="text-lg" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}