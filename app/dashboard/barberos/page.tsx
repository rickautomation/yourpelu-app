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
      userProfile?: { avatarUrl?: string };
    }[]
  >([]);
  const [expandedBarberId, setExpandedBarberId] = useState<string | null>(null);

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
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center">
            <p className="text-white text-lg font-semibold">
              Enlace copiado ✅
            </p>
          </div>
        </div>
      )}

      <div className="flex text-center border border-pink-700 rounded-lg items-center px-5 py-4">
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
          <p className="text-gray-400 text-center"></p>
        ) : (
          barbers.map((barber) => (
            <div
              key={barber.id}
              className="flex flex-col px-2 py-2 rounded-lg shadow-md"
            >
              <div className="flex items-center gap-3">
                {/* Avatar o iniciales */}
                {barber.userProfile?.avatarUrl ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${barber.userProfile.avatarUrl}`}
                    alt={`${barber.name} ${barber.lastname}`}
                    className="w-10 h-10 rounded-full border border-gray-600"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-500 text-white font-bold">
                    {barber.name.charAt(0)}
                    {barber.lastname.charAt(0)}
                  </div>
                )}

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
                  ) : (
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