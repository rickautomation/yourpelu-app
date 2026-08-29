"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet } from "@/app/lib/apiGet";
import { apiPatch } from "@/app/lib/apiPatch";
import {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiEdit3,
  FiCheck,
  FiX,
  FiBriefcase,
} from "react-icons/fi";

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

type WorkRelation = {
  id: string;
  amount?: number | null;
  type: WorkRelationType;
};

type User = {
  id: string;
  name: string;
  lastname: string;
  rol: string;
  phoneNumber: string;
  email?: string;
  userProfile?: { avatarUrl?: string };
  workRelations?: WorkRelation[];
};

export default function StaffDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingAmountId, setEditingAmountId] = useState<string | null>(null);
  const [newAmount, setNewAmount] = useState<number | null>(null);

  const getImageSrc = (url?: string) => {
    if (!url) return "";
    return url.startsWith("http")
      ? url
      : `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  };

  const capitalizeFirst = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const getLabelByType = (typeName: string) => {
    switch (typeName.toLowerCase()) {
      case "contratista":
        return {
          title: "Comisión actual",
          empty: "Aún no se estableció porcentaje de comisión.",
          unit: "%",
        };
      case "empleado":
        return {
          title: "Salario actual",
          empty: "Aún no se estableció el monto de salario.",
          unit: "$",
        };
      case "arrendador":
        return {
          title: "Alquiler actual",
          empty: "Aún no se estableció un monto de alquiler.",
          unit: "$",
        };
      default:
        return {
          title: "Monto actual",
          empty: "Aún no se estableció un monto.",
          unit: "",
        };
    }
  };

  const handleSaveAmount = async (relationId: string) => {
    try {
      await apiPatch(`/work-relations/${relationId}`, { amount: newAmount });
      const res = await apiGet<User>(`/user/${id}`);
      setUser(res);
      setEditingAmountId(null);
      setNewAmount(null);
    } catch (err) {
      console.error("Error guardando comisión", err);
    }
  };

  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      try {
        const res = await apiGet<User>(`/user/${id}`);
        setUser(res);
      } catch (err) {
        console.error("Error cargando usuario", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm font-medium">Cargando perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center space-y-4">
        <p className="text-gray-300 text-lg">Usuario no encontrado ❌</p>
        <button
          onClick={() => router.back()}
          className="text-pink-400 hover:text-pink-300 text-sm font-semibold"
        >
          Volver a la lista
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      {/* Tarjeta de Perfil */}
      <div className="p-3 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-3 text-center sm:text-left">
          {user.userProfile?.avatarUrl ? (
            <img
              src={getImageSrc(user.userProfile.avatarUrl)}
              alt={`${user.name} ${user.lastname}`}
              className="w-30 h-30 rounded-full border-2 border-pink-500/40 object-cover shadow-md shrink-0"
            />
          ) : (
            <div className="w-30 h-30 flex items-center justify-center rounded-full bg-linear-to-br from-pink-600 to-pink-700 text-white font-bold text-2xl shadow-md shrink-0 border border-pink-400/30">
              {user.name.charAt(0)}
              {user.lastname.charAt(0)}
            </div>
          )}

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {user.name} {user.lastname}
            </h1>
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {user.email && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-pink-600/10">
              <FiMail className="text-pink-400 text-lg shrink-0" />
              <div className="truncate">
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                  Email
                </p>
                <p className="text-sm text-white truncate">{user.email}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-pink-600/10">
            <FiPhone className="text-pink-400 text-lg shrink-0" />
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                Teléfono
              </p>
              <p className="text-sm text-white">{user.phoneNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Relaciones de Trabajo / Esquema de Pago */}
      {user.rol != "admin" && (
        <div className="space-y-4 p-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-pink-400 flex items-center gap-2">
            <FiBriefcase className="text-base" />
            <span>Relacion Laboral</span>
          </h2>

          {user.workRelations?.map((wr) => {
            const isEditing = editingAmountId === wr.id;
            const hasAmount = wr.amount !== null && wr.amount !== undefined;
            const labels = getLabelByType(wr.type.name);

            return (
              <div
                key={wr.id}
                className="bg-luminiBrandBlue border border-pink-600/30 p-5 rounded-2xl shadow-lg space-y-4"
              >
                <div className="flex items-start justify-between gap-4 border-b border-pink-600/20 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {capitalizeFirst(wr.type.name)}
                    </h3>
                    {wr.type.description && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {wr.type.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bloque de Edición o Muestra de Monto */}
                {isEditing ? (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                    <div className="flex-1">
                      <input
                        type="number"
                        value={newAmount ?? ""}
                        onChange={(e) =>
                          setNewAmount(
                            e.target.value === ""
                              ? null
                              : Number(e.target.value),
                          )
                        }
                        placeholder={
                          wr.type.name.toLowerCase() === "contratista"
                            ? "Ingresar % comisión"
                            : "Ingresar monto"
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-black/30 border border-pink-500 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleSaveAmount(wr.id)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-xl font-semibold text-xs transition-all shadow-md shadow-pink-600/30"
                      >
                        <FiCheck className="text-base" />
                        <span>Guardar</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditingAmountId(null);
                          setNewAmount(null);
                        }}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl font-semibold text-xs transition-colors"
                      >
                        <FiX className="text-base" />
                        <span>Cancelar</span>
                      </button>
                    </div>
                  </div>
                ) : hasAmount ? (
                  <div className="flex items-center justify-between gap-4 pt-1">
                    <div>
                      <p className="text-xs text-gray-400">{labels.title}</p>
                      <p className="text-2xl font-bold text-pink-400">
                        {labels.unit === "$"
                          ? `$ ${wr.amount}`
                          : `${wr.amount} ${labels.unit}`}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingAmountId(wr.id);
                        setNewAmount(wr.amount ?? null);
                      }}
                      className="inline-flex items-center gap-1.5 bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 border border-pink-500/30 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors"
                    >
                      <FiEdit3 className="text-sm" />
                      <span>Editar</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                    <p className="text-xs text-gray-400">{labels.empty}</p>
                    <button
                      onClick={() => {
                        setEditingAmountId(wr.id);
                        setNewAmount(null);
                      }}
                      className="inline-flex items-center gap-1.5 bg-pink-600 hover:bg-pink-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-md shadow-pink-600/30"
                    >
                      <FiEdit3 className="text-sm" />
                      <span>Establecer uno</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
