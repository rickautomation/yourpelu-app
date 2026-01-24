"use client";

import BarbershopSetupWizard from "../components/dashboard/BarbershopSetupWizard";
import { useAuth } from "../lib/useAuth";
import { useUserBarbershops } from "../hooks/useUserBarbershops";
import { useServices } from "../hooks/useServices";

export default function DashboardPage() {
  const { user, loading, isUnauthorized, router } = useAuth();
  const { activeBarbershop } = useUserBarbershops(user);
  const { globalServices, ownServices } = useServices(activeBarbershop?.id);

  if (loading) return <p className="text-white">Cargando...</p>;
  if (isUnauthorized) {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex flex-col space-y-4 p-4">
      {activeBarbershop ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <section className="flex justify-between p-1 pr-3 items-center rounded-lg">
            <div>
              <h1 className="text-3xl font-bold">{activeBarbershop?.name}</h1>
              <p className="text-sm text-gray-300">
                {activeBarbershop?.address}
              </p>
              <p className="text-sm text-gray-300">
                <span className="text-pink-600">Teléfono: </span>
                {activeBarbershop?.phoneNumber}
              </p>
            </div>
          </section>

          <section className=" rounded-lg border-4 border-gray-900 bg-gray-800 p-2 ">
            {ownServices.length === 0 ? (
              <p className="text-gray-400">No hay servicios configurados.</p>
            ) : (
              <div>
                {ownServices.map((service) => (
                  <div
                    key={service.id}
                    className="py-2 px-2 flex justify-between items-center"
                  >
                    <p>{service.name}</p>
                    <p className="text-pink-500 font-semibold">
                      {service.price
                        ? `$${service.price}`
                        : "Precio no definido"}
                    </p>
                  </div>
                ))}
              </div>
            )}
              <div className="flex justify-end">
                 <button className="bg-blue-500 px-3 py-2 rounded text-white mt-2" onClick={() => router.push("/dashboard/servicios")}>
                Ir a Servicios
              </button>
              </div>
          </section>
        </div>
      ) : (
        <BarbershopSetupWizard
          onFinish={() => {
            router.push("/dashboard");
            router.refresh(); // 👈 fuerza recarga del componente al montarse
          }}
          userName={user?.name || "Usuario"}
          userId={user?.id || ""}
        />
      )}
    </div>
  );
}
