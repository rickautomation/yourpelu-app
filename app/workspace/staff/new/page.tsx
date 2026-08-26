"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { apiPost } from "@/app/lib/apiPost";

import { FaExclamation, FaWhatsapp } from "react-icons/fa";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { apiGet } from "@/app/lib/apiGet";

import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { IoTriangle } from "react-icons/io5";

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
        router.push("/dashboard/staff");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [copied, router]);

  useEffect(() => {
    if (activeEstablishment?.id) {
      fetchTypes(); // ✅ ahora también cargamos los tipos
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
      setShowModal(true); // abrir modal

      setName("");
      setLastname("");
      setPhoneNumber("");
      setEmail("");
    } catch (err: any) {
      console.error(err);
      setMessage("Error al crear barbero ❌");
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

  if (loading) return <p>Cargando...</p>;
  if (isUnauthorized) {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex flex-col space-y-2 p-4">
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 px-4">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center max-w-md w-full">
            <h3 className="text-xl font-semibold mb-6 text-white">
              Invitación creada ✅
            </h3>
            <div className="flex flex-col justify-center">
              <button
                onClick={() => {
                  const formattedPhone = formatArgPhone(newBarberPhone!);
                  const message = `Hola 👋, ${activeEstablishment?.name} te invita a unirte a YourPelu. 
Para activarla y configurar tu contraseña, ingresá al siguiente enlace: 
${activationLink}

⚠️ Recordá que este enlace es único y solo funciona una vez.`;

                  const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`;

                  setShowModal(false); // cerrar modal
                  setCopied(true); // disparar navegación en 2s

                  openWhatsapp(whatsappUrl);
                }}
                className="flex items-center justify-center gap-3 bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition-colors font-semibold text-lg"
              >
                <FaWhatsapp className="w-7 h-7" />
                Enviar por WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {!copied && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 px-2 rounded-lg shadow-md"
        >
          <div>
            <label className="block text-sm mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.trim())}
              required
              className="px-3 py-2 rounded bg-luminiBrandBlue text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Apellido</label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value.trim())}
              required
              className="px-3 py-2 rounded bg-luminiBrandBlue text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Teléfono</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.trim())}
              required
              className="px-3 py-2 rounded bg-luminiBrandBlue text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              required
              className="px-3 py-2 rounded bg-luminiBrandBlue text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div className="relative">
            <label className="block text-sm mb-1">
              Tipo de relación <span className="text-red-400">*</span>
            </label>
            <div
              onClick={() => setShowTypes((prev) => !prev)}
              className={`flex items-center justify-between px-3 py-2 rounded w-full cursor-pointer bg-luminiBrandBlue`}
            >
              <span>
                {selectedType
                  ? types.find((t) => t.id === selectedType)?.name || ""
                  : "Seleccionar..."}
              </span>
              {showTypes ? (
                <FiChevronUp className="w-5 h-5 text-gray-200" />
              ) : (
                <FiChevronDown className="w-5 h-5 text-gray-200" />
              )}
            </div>

            {showTypes && (
              <div className="absolute mt-2 w-full bg-luminiBrandBlue rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {types.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedType(t.id);
                      setShowTypes(false);
                      setTypeError(false); // limpiar error al elegir
                    }}
                    className={`cursor-pointer px-3 py-2 rounded text-white transition-colors 
            ${selectedType === t.id ? "bg-pink-600" : "hover:bg-pink-500"}`}
                  >
                    <p className="font-semibold">{t.name}</p>
                    {t.description && (
                      <p className="text-sm text-gray-300 mt-1">
                        {t.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
            {typeError && (
              <>
                {/* Overlay invisible que cubre toda la pantalla */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setTypeError(false)}
                ></div>

                {/* Popup flotante centrado debajo del campo */}
                <div className="absolute left-1/2 mt-2 transform -translate-x-1/2 z-50">
                  <div className="inline-flex items-center gap-2 bg-white p-2 text-black rounded shadow-lg whitespace-nowrap">
                    <div className="rounded-xs bg-orange-600 py-1 px-1">
                      <FaExclamation className="text-white" />
                    </div>
                    <p className="text-sm">Completa este campo</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-rose-500 text-white px-4 py-2 rounded hover:bg-luminiBrandBlue transition-colors font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors font-semibold"
            >
              Agregar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
