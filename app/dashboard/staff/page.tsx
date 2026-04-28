"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { apiGet } from "@/app/lib/apiGet";
import { apiDelete } from "@/app/lib/apiDelete";
import { useUserEstablishment } from "@/app/hooks/useUserEstablishment";
import { FiUserPlus } from "react-icons/fi";

export default function StaffPage() {
  const { user, isUnauthorized, router } = useAuth();
  const { activeEstablishment, loading } = useUserEstablishment(user);

  const [staff, setStaff] = useState<
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
  const [expandedStaffId, setExpandedStaffId] = useState<string | null>(null);

  const [showPopup, setShowPopup] = useState(false);

  const fetchStaff = async (shopId: string) => {
    try {
      if (shopId) {
        const res = await apiGet<typeof staff>(
          `/user/establishment/${shopId}/staff`,
        );
        setStaff(res);
      }
    } catch (err) {
      console.error("Error cargando miembro", err);
    }
  };

  const getImageSrc = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http")) {
      return url; // producción (Cloudinary)
    }
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`; // local
  };

  useEffect(() => {
    if (activeEstablishment?.id) {
      setExpandedStaffId(null);
      fetchStaff(activeEstablishment?.id);
    } else {
      setStaff([]);
    }
  }, [activeEstablishment?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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

      <div className="flex justify-between  items-center px-2 py-4">
        <p className="text-2xl">{activeEstablishment?.name} Team</p>
        <button
          onClick={() => router.push("/dashboard/staff/new")}
          className="flex items-center gap-2 p-2 text-4xl border-2 border-pink-600 rounded-md"
        >
          <p className="text-lg">invitar </p>
          <FiUserPlus />
        </button>
      </div>

      <div className="flex flex-col space-y-2 mt-2">
        {staff.length === 0 ? (
          <p className="text-gray-400 text-center"></p>
        ) : (
          staff.map((member) => (
            <div
              key={member.id}
              className="flex flex-col px-2 py-2 rounded-lg shadow-md"
            >
              <div className="flex items-center gap-3">
                {/* Avatar o iniciales */}
                {member.userProfile?.avatarUrl ? (
                  <img
                    src={getImageSrc(member.userProfile.avatarUrl)}
                    alt={`${member.name} ${member.lastname}`}
                    className="w-10 h-10 rounded-full border border-gray-600"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-700 text-white font-bold">
                    {member.name.charAt(0)}
                    {member.lastname.charAt(0)}
                  </div>
                )}

                <p className="text-2xl">
                  {member.name} {member.lastname}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setExpandedStaffId(
                      expandedStaffId === member.id ? null : member.id,
                    )
                  }
                  className="ml-auto flex items-center gap-1 bg-pink-400 text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors text-sm font-semibold"
                >
                  {expandedStaffId === member.id ? (
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

              {expandedStaffId === member.id && (
                <div className="mt-2 text-gray-200 text-sm space-y-1">
                  <p>Teléfono: {member.phoneNumber}</p>
                  {member.email && <p>Email: {member.email}</p>}
                  {member.needsSetup && (
                    <p className="text-yellow-400 font-semibold">
                      ⚠️ Cuenta pendiente de activación
                    </p>
                  )}

                  <div className="flex gap-2 mt-2">
                    {member.activationLink && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(member.activationLink!);
                          setShowPopup(true);
                          setTimeout(() => setShowPopup(false), 2000);
                        }}
                        className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600 transition-colors text-sm font-semibold"
                      >
                        Copiar enlace
                      </button>
                    )}

                    {member.needsSetup ? (
                      <button
                        onClick={async () => {
                          try {
                            await apiDelete(`/user/staff/soft/${member.id}`);
                            fetchStaff(activeEstablishment!.id);
                          } catch (err) {
                            console.error("Error cancelando miembro", err);
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
                            await apiDelete(`/user/staff/soft/${member.id}`);
                            fetchStaff(activeEstablishment!.id);
                          } catch (err) {
                            console.error("Error eliminando miembro", err);
                          }
                        }}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors text-sm font-semibold"
                      >
                        Eliminar miembro
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <button
        onClick={() => router.push("/dashboard/staff/new")}
        className="fixed bottom-20 right-4 p-2 rounded-md bg-pink-500 text-white  shadow-md shadow-black hover:bg-pink-600 transition-colors"
      >
        <FiUserPlus className="text-3xl" />
      </button>
    </div>
  );
}
