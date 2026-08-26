"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { apiGet } from "@/app/lib/apiGet";
import { FiUserPlus } from "react-icons/fi";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { FaChevronCircleRight } from "react-icons/fa";

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
  const { user, isUnauthorized, router } = useAuth();
  const { activeEstablishment, loading } = useEstablishment();

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
  const [types, setTypes] = useState<WorkRelationType[]>([]);
  const [expandedStaffId, setExpandedStaffId] = useState<string | null>(null);

  const [showPopup, setShowPopup] = useState(false);

  const fetchStaff = async (shopId: string) => {
    try {
      if (shopId) {
        const res = await apiGet<typeof staff>(
          `/user/establishment/${shopId}/staff`,
        );
        console.log("res staff: ", res);
        setStaff(res);
      }
    } catch (err) {
      console.error("Error cargando miembro", err);
    }
  };

  const fetchTypes = async () => {
    try {
      const resTypes = await apiGet<WorkRelationType[]>("/work-relation-types");
      console.log("res types: ", resTypes);
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
      setExpandedStaffId(null);
      fetchStaff(activeEstablishment?.id);
      fetchTypes();
    } else {
      setStaff([]);
    }
  }, [activeEstablishment?.id]);

  console.log("types: ", types);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen ">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isUnauthorized) {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex flex-col space-y-2 py-4 px-6">
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center">
            <p className="text-white text-lg font-semibold">
              Enlace copiado ✅
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col space-y-2 mt-2">
        {staff.length === 0 ? (
          <p className="text-gray-400 text-center"></p>
        ) : (
          staff.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-luminiBrandBlue shadow-md"
            >
              <div className="flex items-center gap-3 py-2">
                {/* Avatar o iniciales */}
                {member.userProfile?.avatarUrl ? (
                  <img
                    src={getImageSrc(member.userProfile.avatarUrl)}
                    alt={`${member.name} ${member.lastname}`}
                    className="w-12 h-12 rounded-full border border-gray-600"
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-700 text-white font-bold">
                    {member.name.charAt(0)}
                    {member.lastname.charAt(0)}
                  </div>
                )}

                {member.id === user?.id ? (
                  <p className="text-2xl">Vos</p>
                ) : (
                  <div>
                    <p className="text-xl">{member.name}</p>
                    <p className="text-xl">{member.lastname}</p>
                  </div>
                )}
              </div>

              {/* Icono de navegación */}
              <button
                type="button"
                onClick={() => router.push(`/dashboard/staff/${member.id}`)}
                className="ml-auto text-pink-400 hover:text-pink-600 transition-colors"
              >
                <FaChevronCircleRight className="w-6 h-6" />
              </button>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => router.push("/dashboard/staff/new")}
        className="fixed bottom-20 right-6 p-2 rounded-md bg-pink-500 text-white  shadow-md shadow-black hover:bg-pink-600 transition-colors"
      >
        <FiUserPlus className="text-3xl" />
      </button>
    </div>
  );
}
