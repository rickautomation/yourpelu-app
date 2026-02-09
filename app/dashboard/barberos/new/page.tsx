"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { useUserBarbershops } from "@/app/hooks/useUserBarbershops";
import { apiPost } from "@/app/lib/apiPost";

import { FaWhatsapp } from "react-icons/fa";

export default function NewBarberPage() {
  const { user, loading, isUnauthorized, router } = useAuth();
  const { activeBarbershop } = useUserBarbershops(user);

  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [activationLink, setActivationLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [newBarberPhone, setNewBarberPhone] = useState<string | null>(null);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        router.push("/dashboard/barberos");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!activeBarbershop?.id) {
        setMessage("No hay barbería activa ❌");
        return;
      }

      const res = await apiPost<{
        activationLink: string;
        phoneNumber: string;
      }>("/user/barber", {
        name,
        lastname,
        phoneNumber,
        email,
        barbershopId: activeBarbershop.id,
      });

      console.log("res user: ", res);

      setMessage(`Barbero creado ✅ Enlace: ${res.activationLink}`);
      setActivationLink(res.activationLink);

      setNewBarberPhone(res.phoneNumber);

      setName("");
      setLastname("");
      setPhoneNumber("");
      setEmail("");

      setTimeout(() => setMessage(null), 20000);
    } catch (err: any) {
      console.error(err);
      if (err.message.includes("403")) {
        setMessage("Acceso denegado ❌");
      } else {
        setMessage("Error al crear barbero ❌");
      }
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const formatArgPhone = (phone: string) => {
    // eliminar todo lo que no sea dígito
    console.log("phoneNume=ber : ", phone);
    let clean = phone.replace(/\D/g, "");

    // quitar prefijo 0
    if (clean.startsWith("0")) {
      clean = clean.slice(1);
    }

    // quitar prefijo 15
    if (clean.startsWith("15")) {
      clean = clean.slice(2);
    }

    // si ya empieza con 549, lo dejamos
    if (clean.startsWith("549")) return clean;

    // si empieza con 9 (ej: 9261...), lo reemplazamos por 549
    if (clean.startsWith("9")) return "549" + clean.slice(1);

    // por defecto, agregamos 549 adelante
    return "549" + clean;
  };

  if (loading) return <p>Cargando...</p>;
  if (isUnauthorized) {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex flex-col space-y-2 p-4">
      {activationLink && newBarberPhone && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 px-4">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center max-w-md w-full">
            <h3 className="text-xl font-semibold mb-6 text-white">
              Invitación creada ✅
            </h3>

            <button
              onClick={() => {
                const formattedPhone = formatArgPhone(newBarberPhone!);
                const message = `Hola 👋, ${activeBarbershop?.name} te invita a unirte a YourPelu. 
Para activarla y configurar tu contraseña, ingresá al siguiente enlace: 
${activationLink}

⚠️ Recordá que este enlace es único y solo funciona una vez.`;
                const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, "_blank");
              }}
              className="flex items-center justify-center gap-3 bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition-colors font-semibold text-lg"
            >
              <FaWhatsapp className="w-7 h-7" /> {/* Ícono más grande */}
              Enviar por WhatsApp
            </button>
          </div>
        </div>
      )}

      {!copied && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-gray-800 p-4 rounded-lg shadow-md"
        >
          <div>
            <label className="block text-sm mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.trim())}
              required
              className="px-3 py-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Apellido</label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value.trim())}
              required
              className="px-3 py-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Teléfono</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.trim())}
              required
              className="px-3 py-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              required
              className="px-3 py-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-rose-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors font-semibold"
            >
              Agregar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
