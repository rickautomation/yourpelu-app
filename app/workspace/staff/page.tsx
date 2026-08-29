"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { apiGet } from "@/app/lib/apiGet";
import { FiUserPlus, FiUsers } from "react-icons/fi";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { FaChevronRight } from "react-icons/fa6";
import { useRouter } from "next/navigation";

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

export default function StaffPage() {
  const { user } = useAuth();
  const { activeEstablishment, loading } = useEstablishment();

  const router = useRouter();

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
  const [, setTypes] = useState<WorkRelationType[]>([]);
  const [showPopup] = useState(false);

  const fetchStaff = async (shopId: string) => {
    try {
      if (shopId) {
        const res = await apiGet<typeof staff>(
          `/user/establishment/${shopId}/staff`
        );
        setStaff(res);
      }
    } catch (err) {
      console.error("Error cargando miembro", err);
    }
  };

  const fetchTypes = async () => {
    try {
      const resTypes = await apiGet<WorkRelationType[]>("/work-relation-types");
      setTypes(resTypes);
    } catch (err: any) {
      console.error("Error cargando tipos de relación", err.message);
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
      fetchStaff(activeEstablishment?.id);
      fetchTypes();
    } else {
      setStaff([]);
    }
  }, [activeEstablishment?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-5 py-6 px-4 max-w-4xl mx-auto pb-28">
      {/* Toast de notificación */}
      {showPopup && (
        <div className="fixed top-5 right-5 z-50 bg-gray-800 text-white px-4 py-3 rounded-2xl shadow-xl border border-pink-500/30 flex items-center gap-2 animate-slideIn">
          <p className="text-sm font-medium">Enlace copiado ✅</p>
        </div>
      )}

      {/* Encabezado de la página */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Gestión de <span className="text-pink-400">Personal</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Miembros del equipo vinculados al establecimiento.
          </p>
        </div>
        <div className="bg-luminiBrandBlue border border-pink-600/30 px-3 py-1.5 rounded-xl text-xs text-pink-300 font-semibold flex items-center gap-1.5 shadow-sm">
          <FiUsers className="w-4 h-4 text-pink-400" />
          <span>{staff.length}</span>
        </div>
      </div>

      {/* Lista de Personal */}
      <div className="space-y-3">
        {staff.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-luminiBrandBlue/50 border border-dashed border-pink-600/20 rounded-2xl">
            <FiUsers className="w-12 h-12 text-pink-400/50 mb-3" />
            <p className="text-base font-semibold text-white">
              No hay miembros registrados
            </p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              Agregá integrantes a tu equipo para gestionar permisos y turnos.
            </p>
          </div>
        ) : (
          staff.map((member) => {
            const isCurrentUser = member.id === user?.id;

            return (
              <div
                key={member.id}
                onClick={() => router.push(`/workspace/staff/${member.id}`)}
                className="group flex items-center justify-between p-4 bg-luminiBrandBlue hover:bg-pink-600/10 border border-pink-600/20 hover:border-pink-500/50 rounded-2xl transition-all duration-200 shadow-lg cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  {/* Avatar o Iniciales */}
                  <div className="relative">
                    {member.userProfile?.avatarUrl ? (
                      <img
                        src={getImageSrc(member.userProfile.avatarUrl)}
                        alt={`${member.name} ${member.lastname}`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-pink-500/40 shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-linear-to-r from-pink-600 to-pink-800 text-white font-bold text-base border-2 border-pink-500/30 shadow-sm">
                        {member.name?.charAt(0)}
                        {member.lastname?.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Datos del Miembro */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-semibold text-white group-hover:text-pink-300 transition-colors">
                        {member.name} {member.lastname}
                      </p>
                      {isCurrentUser && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-500/40 rounded-md">
                          Vos
                        </span>
                      )}
                    </div>
                    {member.phoneNumber && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {member.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Acción / Flecha */}
                <div className="p-2 text-pink-400 group-hover:text-pink-300 group-hover:translate-x-1 transition-all">
                  <FaChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Botón Flotante para Agregar Miembro */}
      <button
        onClick={() => router.push("/workspace/staff/new")}
        aria-label="Agregar miembro"
        className="fixed bottom-20 right-6 p-2 rounded-full bg-linear-to-r from-pink-500 to-pink-600 text-white shadow-xl shadow-pink-900/30 hover:shadow-pink-600/40 hover:scale-105 active:scale-95 transition-all duration-200 border border-pink-400/30 z-30"
      >
        <FiUserPlus className="w-8 h-8" />
      </button>
    </div>
  );
}