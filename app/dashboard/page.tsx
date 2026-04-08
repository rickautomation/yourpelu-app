"use client";


import { FaUserPlus } from "react-icons/fa";
import Link from "next/link";
import { useOfferings } from "../hooks/useOfferings";
import { useUserEstablishment } from "../hooks/useUserEstablishment";
import { useAuth } from "../hooks/useAuth";

export default function DashboardPage() {
  const { user, loading, isUnauthorized, router } = useAuth()
  const { activeEstablishment } = useUserEstablishment(user);
  const { clientOfferings } = useOfferings(activeEstablishment?.id);

  const userName = user?.name || "Usuario";

  if (loading) return <p className="text-white">Cargando...</p>;
  if (isUnauthorized) {
    router.push("/");
    return null;
  }

  return (
    <div className="flex flex-col space-y-4 p-4">
      {/* Caso 1: sin barbería activa */}
      {!activeEstablishment && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Hola {userName}!</h2>
          <p className="mb-6">
            Vamos a configurar tu barbería completa. Completa los datos y la
            crearemos en el sistema.
          </p>
          <button
            onClick={() => router.push("/dashboard/initial-setup?step=1")}
            className="bg-pink-600 px-6 py-2 text-white rounded"
          >
            Empezar
          </button>
        </div>
      )}

      {/* Caso 2: barbería activa pero sin servicios */}
      {activeEstablishment && clientOfferings.length === 0 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Hola {userName}!</h2>
          <p className="mb-6">
            Tu barbería ya está creada, pero todavía no configuraste los
            servicios que ofrecerás. Vamos a completar ese paso para que puedas
            empezar a trabajar.
          </p>
          <button
            onClick={() => router.push("/dashboard/initial-setup?step=3")}
            className="bg-blue-600 px-6 py-2 text-white rounded"
          >
            Seguir configurando
          </button>
        </div>
      )}

      {/* Caso 3: barbería activa con servicios */}
      {activeEstablishment && clientOfferings.length > 0 && (
        <section className="flex justify-between p-1 pr-3 items-center rounded-lg">
          <div>
            <h1 className="text-3xl font-bold">{activeEstablishment?.name}</h1>
            <p className="text-sm text-gray-300">
              {activeEstablishment?.address}
            </p>
            <p className="text-sm text-gray-300">
              <span className="text-pink-600">Teléfono: </span>
              {activeEstablishment?.phoneNumber}
            </p>
          </div>
          <Link href="/dashboard/barberos/new">
            <button className="border-2 border-pink-300 hover:bg-pink-700 text-white p-3 rounded-md text-xl flex items-center gap-2">
              <FaUserPlus />
              <span className="text-xs">Agregar Miembro</span>
            </button>
          </Link>
        </section>
      )}
    </div>
  );
}
