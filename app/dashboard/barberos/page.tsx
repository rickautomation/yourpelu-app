"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { useUserBarbershops } from "@/app/hooks/useUserBarbershops";
import { apiPost } from "@/app/lib/apiPost";
import { apiGet } from "@/app/lib/apiGet";

export default function BarbersPage() {
  const { user, loading, isUnauthorized, router } = useAuth();
  const { activeBarbershop } = useUserBarbershops(user);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [barbers, setBarbers] = useState<
    {
      id: string;
      name: string;
      lastname: string;
      phoneNumber: string;
      email?: string;
      needsSetup?: boolean;
    }[]
  >([]);
  const [expandedBarberId, setExpandedBarberId] = useState<string | null>(null);
  const [activationLink, setActivationLink] = useState<string | null>(null);

  const fetchBarbers = async (shopId: string) => {
    try {
      if (shopId) {
        const res = await apiGet<
          {
            id: string;
            name: string;
            lastname: string;
            phoneNumber: string;
            email?: string;
            needsSetup?: boolean;
          }[]
        >(`/user/barbershop/${shopId}/barbers`);
        setBarbers(res);
      }
    } catch (err) {
      console.error("Error cargando barberos", err);
    }
  };

  // 👇 recargar barberos cuando cambia la barbería activa
  useEffect(() => {
    if (activeBarbershop?.id) {
      fetchBarbers(activeBarbershop.id);
    }
  }, [activeBarbershop]);

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
        barbershopId: activeBarbershop.id, // 👈 usamos el hook
      });

      setMessage(`Barbero creado ✅ Enlace: ${res.activationLink}`);
      setActivationLink(res.activationLink);
      setShowForm(false);
      setName("");
      setLastname("");
      setPhoneNumber("");
      setEmail("");

      await fetchBarbers(activeBarbershop.id);

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
    <div className="flex flex-col space-y-2">
      {activationLink && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 px-4">
          <div className=" bg-gray-800 p-6 rounded-lg shadow-xl text-center max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Barbero creado ✅
            </h3>
            <h4 className="text-lg text-white">
              Copiá el enlace y pásalo al barbero para que complete su registro
            </h4>

            <p className="mb-4 text-pink-500 break-all">{activationLink}</p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(activationLink);
                  // feedback visual
                  const toast = document.createElement("div");
                  toast.innerText = "Enlace copiado ✅";
                  toast.className =
                    "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg";
                  document.body.appendChild(toast);
                  setTimeout(() => toast.remove(), 2000);
                  setActivationLink(null); // cerrar popup
                }}
                className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors font-semibold"
              >
                Copiar enlace
              </button>

              <button
                onClick={() => setActivationLink(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {!showForm && (
        <div className="flex text-center items-center px-6 py-4 bg-gray-800 rounded-lg shadow-md">
          <p className="text-2xl">Agregar Barbero</p>
          <button
            onClick={() => setShowForm(true)}
            className="ml-auto bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors"
          >
            +
          </button>
        </div>
      )}

      {!showForm && (
        <div className="flex flex-col space-y-2 mt-4">
          {barbers.length === 0 ? (
            <p className="text-gray-400 text-center">No hay barberos aún.</p>
          ) : (
            barbers.map((barber) => (
              <div
                key={barber.id}
                className="flex flex-col px-6 py-4 bg-gray-700 rounded-lg shadow-md"
              >
                <div className="flex items-center">
                  <p className="text-2xl">
                    {barber.name} {barber.lastname}
                  </p>
                  <button
                    type="button"
                    className="ml-auto bg-pink-400 text-white px-3 py-1 rounded hover:bg-pink-500 transition-colors text-sm font-semibold"
                    onClick={() =>
                      setExpandedBarberId(
                        expandedBarberId === barber.id ? null : barber.id
                      )
                    }
                  >
                    {expandedBarberId === barber.id ? "Cerrar" : "Ver más"}
                  </button>
                </div>

                {expandedBarberId === barber.id && (
                  <div className="mt-2 text-gray-200 text-sm space-y-1">
                    <p>Teléfono: {barber.phoneNumber}</p>
                    {barber.email && <p>Email: {barber.email}</p>}

                    {barber.needsSetup && (
                      <p className="text-yellow-400 font-semibold">
                        ⚠️ Cuenta pendiente de activación
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-gray-800 p-4 rounded-lg shadow-md"
        >
          {/* Inputs del formulario */}
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
              type="submit"
              className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors font-semibold"
            >
              Crear Barbero
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors font-semibold"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
