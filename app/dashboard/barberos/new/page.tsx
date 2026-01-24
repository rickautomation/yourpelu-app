"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { useUserBarbershops } from "@/app/hooks/useUserBarbershops";
import { apiPost } from "@/app/lib/apiPost";

export default function NewBarberPage() {
  const { user, loading, isUnauthorized, router } = useAuth();
  const { activeBarbershop } = useUserBarbershops(user);

  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [activationLink, setActivationLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false); // 👈 nuevo estado

  useEffect(() => {
    if (copied) {
      // esperar un poco para que se vea el toast
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

      const res = await apiPost<{ activationLink: string }>("/user/barber", {
        name,
        lastname,
        phoneNumber,
        email,
        barbershopId: activeBarbershop.id,
      });

      setMessage(`Barbero creado ✅ Enlace: ${res.activationLink}`);
      setActivationLink(res.activationLink);

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

  if (loading) return <p>Cargando...</p>;
  if (isUnauthorized) {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex flex-col space-y-2 p-4">
      {activationLink && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 px-4">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Barbero creado ✅
            </h3>
            <h4 className="text-lg text-white">
              Tenés dos opciones para compartir la cuenta: <br />
              • Copiar solo el enlace de activación. <br />• Copiar una
              plantilla completa lista para enviar por WhatsApp o correo.
            </h4>

            <p className="mb-4 text-pink-500 break-all">{activationLink}</p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(activationLink);
                  const toast = document.createElement("div");
                  toast.innerText = "Enlace copiado ✅";
                  toast.className =
                    "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg";
                  document.body.appendChild(toast);
                  setTimeout(() => toast.remove(), 2000);
                  setActivationLink(null); // 👈 cerrar popup inmediatamente
                  setCopied(true); // 👈 volver al dashboard
                }}
                className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors font-semibold"
              >
                Copiar enlace
              </button>

              <button
                onClick={() => {
                  const plantilla = `Hola 👋, ${activeBarbershop?.name} te invita a unirte a YourPelu. 
Para activarla y configurar tu contraseña, ingresá al siguiente enlace: 
${activationLink}

⚠️ Recordá que este enlace es único y solo funciona una vez. 
Si tenés dudas, escribinos por WhatsApp o respondé este mail.`;

                  navigator.clipboard.writeText(plantilla);

                  const toast = document.createElement("div");
                  toast.innerText = "Plantilla copiada ✅";
                  toast.className =
                    "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded shadow-lg";
                  document.body.appendChild(toast);
                  setTimeout(() => toast.remove(), 2000);
                   setActivationLink(null); // 👈 cerrar popup inmediatamente
                  setCopied(true);
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors font-semibold"
              >
                Copiar plantilla
              </button>
            </div>
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
              onChange={(e) => setName(e.target.value)}
              required
              className="px-3 py-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Apellido</label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
              className="px-3 py-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Teléfono</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="px-3 py-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-3 py-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => router.push("/dashboard/barberos")}
              className="flex-1 bg-rose-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors font-semibold"
            >
              Crear Barbero
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
