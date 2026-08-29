"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { apiPost } from "@/app/lib/apiPost";
import { FaExclamation, FaWhatsapp } from "react-icons/fa";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { apiGet } from "@/app/lib/apiGet";
import { FiChevronDown, FiChevronUp, FiUserPlus, FiArrowLeft } from "react-icons/fi";

type WorkRelationAttribute = {
  id: string;
  name: string;
  description?: string;
};

type WorkRelationType = {
  id: string;
  name: string;
  description?: string;
  attributes: WorkRelationAttribute[];
};

export default function NewStaffPage() {
  const { loading, isUnauthorized, router } = useAuth();
  const { activeEstablishment } = useEstablishment();

  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [activationLink, setActivationLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [newBarberPhone, setNewBarberPhone] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [types, setTypes] = useState<WorkRelationType[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [showTypes, setShowTypes] = useState(false);
  const [typeError, setTypeError] = useState(false);

  const fetchTypes = async () => {
    try {
      const resTypes = await apiGet<WorkRelationType[]>("/work-relation-types");
      setTypes(resTypes);
    } catch (err: any) {
      console.error("Error cargando tipos de relación", err.message);
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        router.push("/workspace/staff");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [copied, router]);

  useEffect(() => {
    if (activeEstablishment?.id) {
      fetchTypes();
    }
  }, [activeEstablishment?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedType) {
        setTypeError(true);
        return;
      }

      setTypeError(false);

      if (!activeEstablishment?.id) {
        setMessage("No hay establecimiento activo ❌");
        return;
      }

      const res = await apiPost<{
        activationLink: string;
        phoneNumber: string;
      }>("/user/staff", {
        name,
        lastname,
        phoneNumber,
        email,
        establishmentId: activeEstablishment?.id,
        typeId: selectedType,
      });

      setActivationLink(res.activationLink);
      setNewBarberPhone(res.phoneNumber);
      setShowModal(true);

      setName("");
      setLastname("");
      setPhoneNumber("");
      setEmail("");
    } catch (err: any) {
      console.error(err);
      setMessage("Error al crear colaborador ❌");
    }
  };

  const openWhatsapp = (url: string) => {
    window.open(url, "_blank");
  };

  const formatArgPhone = (phone: string) => {
    let clean = phone.replace(/\D/g, "");

    if (clean.startsWith("0")) {
      clean = clean.slice(1);
    }

    if (clean.startsWith("15")) {
      clean = clean.slice(2);
    }

    if (clean.startsWith("549")) return clean;
    if (clean.startsWith("9")) return "549" + clean.slice(1);

    return "549" + clean;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm font-medium">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-xl mx-auto space-y-6">
      {/* Modal de Invitación Creada */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/30 z-50 p-4 animate-fadeIn">
          <div className="bg-luminiBrandBlue border border-pink-600/30 p-6 rounded-2xl shadow-2xl text-center max-w-sm w-full space-y-5">
            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center mx-auto text-2xl">
              ✅
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Invitación Creada
              </h3>
              <p className="text-xs text-gray-300 mt-1">
                Envía el enlace de acceso directo al nuevo colaborador por WhatsApp.
              </p>
            </div>

            <button
              onClick={() => {
                const formattedPhone = formatArgPhone(newBarberPhone!);
                const messageToSend = `Hola 👋, ${activeEstablishment?.name} te invita a unirte a YourPelu. 
Para activarla y configurar tu contraseña, ingresá al siguiente enlace: 
${activationLink}

⚠️ Recordá que este enlace es único y solo funciona una vez.`;

                const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(
                  messageToSend
                )}`;

                setShowModal(false);
                setCopied(true);
                openWhatsapp(whatsappUrl);
              }}
              className="w-full flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg shadow-emerald-900/30 transition-all active:scale-[0.98]"
            >
              <FaWhatsapp className="text-xl" />
              <span>Enviar por WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      {/* Formulario Principal */}
      {!copied && (
        <div className="p-4 space-y-6">
          <div className="flex items-center gap-3 border-b border-pink-600/20 pb-4">
            <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
              <FiUserPlus className="text-xl" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">
                Nuevo Colaborador
              </h1>
              <p className="text-xs text-gray-400">
                Completa los datos para enviar la invitación
              </p>
            </div>
          </div>

          {message && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs text-center font-medium">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Nombre <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.trimStart())}
                required
                placeholder="Ej: Juan"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-pink-600/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Apellido <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value.trimStart())}
                required
                placeholder="Ej: Pérez"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-pink-600/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Teléfono WhatsApp <span className="text-pink-400">*</span>
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.trim())}
                required
                placeholder="Ej: 1112345678"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-pink-600/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Email <span className="text-pink-400">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                required
                placeholder="ejemplo@correo.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-pink-600/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
              />
            </div>

            {/* Custom Select para Tipo de Relación */}
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Tipo de relación <span className="text-pink-400">*</span>
              </label>

              <button
                type="button"
                onClick={() => setShowTypes((prev) => !prev)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-black/30 border ${
                  typeError ? "border-amber-500/70" : "border-pink-600/20"
                } text-sm text-left text-white focus:outline-none focus:border-pink-500 transition-all`}
              >
                <span
                  className={
                    selectedType ? "text-white font-medium" : "text-gray-500"
                  }
                >
                  {selectedType
                    ? types.find((t) => t.id === selectedType)?.name
                    : "Seleccionar rol o tipo..."}
                </span>
                {showTypes ? (
                  <FiChevronUp className="w-5 h-5 text-pink-400 shrink-0" />
                ) : (
                  <FiChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                )}
              </button>

              {showTypes && (
                <div className="absolute left-0 right-0 mt-1.5 bg-luminiBrandBlue border border-pink-600/40 rounded-xl shadow-2xl z-20 max-h-56 overflow-y-auto divide-y divide-pink-600/10">
                  {types.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedType(t.id);
                        setShowTypes(false);
                        setTypeError(false);
                      }}
                      className={`p-3 cursor-pointer transition-colors ${
                        selectedType === t.id
                          ? "bg-pink-600/30 text-white font-semibold"
                          : "hover:bg-pink-500/15 text-gray-200"
                      }`}
                    >
                      <p className="text-sm font-medium">{t.name}</p>
                      {t.description && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {t.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Banner / Popup Error de validación */}
              {typeError && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setTypeError(false)}
                  />
                  <div className="absolute left-1/2 -bottom-9 -translate-x-1/2 z-20 animate-fadeIn">
                    <div className="flex items-center gap-1.5 bg-amber-500 text-gray-950 text-xs font-semibold px-2.5 py-1 rounded-md shadow-md">
                      <FaExclamation />
                      <span>Selecciona un tipo de relación</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Acciones */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-2.5 rounded-xl border border-rose-500/40 text-rose-300 hover:bg-rose-500/10 transition-colors font-semibold text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white transition-all font-semibold text-sm shadow-md shadow-pink-600/30 active:scale-[0.98]"
              >
                Agregar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}