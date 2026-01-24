"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { useUserBarbershops } from "@/app/hooks/useUserBarbershops";
import { apiGet } from "@/app/lib/apiGet";
import { apiDelete } from "@/app/lib/apiDelete";

export default function BarbersPage() {
  const { user, loading, isUnauthorized, router } = useAuth();
  const { activeBarbershop } = useUserBarbershops(user);

  const [barbers, setBarbers] = useState<
    {
      id: string;
      name: string;
      lastname: string;
      phoneNumber: string;
      email?: string;
      needsSetup?: boolean;
      activationLink?: string;
    }[]
  >([]);
  const [expandedBarberId, setExpandedBarberId] = useState<string | null>(null);

  // 👇 nuevo estado para popup
  const [showPopup, setShowPopup] = useState(false);

  const fetchBarbers = async (shopId: string) => {
    try {
      if (shopId) {
        const res = await apiGet<typeof barbers>(
          `/user/barbershop/${shopId}/barbers`,
        );
        setBarbers(res);
      }
    } catch (err) {
      console.error("Error cargando barberos", err);
    }
  };

  useEffect(() => {
    if (activeBarbershop?.id) {
      setExpandedBarberId(null);
      fetchBarbers(activeBarbershop.id);
    } else {
      setBarbers([]);
    }
  }, [activeBarbershop?.id]);

  if (loading) return <p>Cargando...</p>;
  if (isUnauthorized) {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex flex-col space-y-2 p-4">
      {/* Popup modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center">
            <p className="text-white text-lg font-semibold">
              Enlace copiado ✅
            </p>
          </div>
        </div>
      )}

      <div className="flex text-center items-center px-6 py-4 bg-gray-800 rounded-lg shadow-md">
        <p className="text-2xl">Barberos</p>
        <button
          onClick={() => router.push("/dashboard/barberos/new")}
          className="ml-auto bg-pink-400 text-2xl font-bold text-white px-3 py-1 rounded hover:bg-pink-500 transition-colors"
        >
          +
        </button>
      </div>

      <div className="flex flex-col space-y-2 mt-2">
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
                  onClick={() =>
                    setExpandedBarberId(
                      expandedBarberId === barber.id ? null : barber.id,
                    )
                  }
                  className="ml-auto flex items-center gap-1 bg-pink-400 text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors text-sm font-semibold"
                >
                  {expandedBarberId === barber.id ? (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </>
                  )}
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

                  <div className="flex gap-2 mt-2">
                    {/* Copiar enlace solo si existe */}
                    {barber.activationLink && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(barber.activationLink!);
                          setShowPopup(true);
                          setTimeout(() => setShowPopup(false), 2000);
                        }}
                        className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600 transition-colors text-sm font-semibold"
                      >
                        Copiar enlace
                      </button>
                    )}

                    {/* Cancelar o eliminar */}
                    {barber.needsSetup ? (
                      <button
                        onClick={async () => {
                          try {
                            await apiDelete(`/user/barber/soft/${barber.id}`);
                            fetchBarbers(activeBarbershop!.id);
                          } catch (err) {
                            console.error("Error cancelando barbero", err);
                          }
                        }}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors text-sm font-semibold"
                      >
                        Cancelar cuenta
                      </button>
                    ) : (
                      <button
                        onClick={async () => {
                          try {
                            await apiDelete(`/user/barber/soft/${barber.id}`);
                            fetchBarbers(activeBarbershop!.id);
                          } catch (err) {
                            console.error("Error eliminando barbero", err);
                          }
                        }}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors text-sm font-semibold"
                      >
                        Eliminar barbero
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
