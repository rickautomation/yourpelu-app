"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/lib/useAuth";
import { apiPost } from "@/app/lib/apiPost";
import { apiGet } from "@/app/lib/apiGet";

export default function BarbersPage() {
  const { user, loading, isUnauthorized, router } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [barbershopId, setBarbershopId] = useState<string>("");
  const [barbers, setBarbers] = useState<
    { id: string; name: string; lastname: string; phoneNumber: string }[]
  >([]);

  const fetchBarbers = async (shopId: string) => {
    try {
      if (shopId) {
        const res = await apiGet<
          { id: string; name: string; lastname: string; phoneNumber: string }[]
        >(`/user/barbershop/${shopId}/barbers`);
        setBarbers(res);
      }
    } catch (err) {
      console.error("Error cargando barberos", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiPost("/user/barber", {
        name,
        lastname,
        phoneNumber,
        email,
        password,
        barbershopId, // 👈 ya viene del estado
      });
      setMessage("Barbero creado ✅");
      setShowForm(false);
      setName("");
      setLastname("");
      setPhoneNumber("");
      setEmail("");
      setPassword("");

      await fetchBarbers(barbershopId);

      setTimeout(() => setMessage(null), 2000);
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

  useEffect(() => {
    if (user?.rol === "admin" && user?.barbershop?.id) {
      setBarbershopId(user.barbershop.id); // 👈 setear barbería automáticamente
    }
  }, [user]);

  useEffect(() => {
    if (barbershopId) {
      fetchBarbers(barbershopId);
    }
  }, [barbershopId]);

  if (loading) return <p>Cargando...</p>;
  if (isUnauthorized) {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex flex-col space-y-2">
      {message && (
        <div className="mb-4 bg-pink-500 text-white text-center py-2 rounded">
          {message}
        </div>
      )}

      {/* 👇 Mostrar encabezado solo si no está abierto el form */}
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
                className="flex items-center px-6 py-4 bg-gray-700 rounded-lg shadow-md"
              >
                <p className="text-2xl">
                  {barber.name} {barber.lastname}
                </p>
                <button
                  type="button"
                  className="ml-auto bg-pink-400 text-white px-3 py-1 rounded hover:bg-pink-500 transition-colors text-sm font-semibold"
                  onClick={() => {
                    console.log("Ampliar info de:", barber);
                  }}
                >
                  Ver más
                </button>
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

          {/* 👇 Eliminamos el select de barbería, ya viene del estado */}

          <div>
            <label className="block text-sm mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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