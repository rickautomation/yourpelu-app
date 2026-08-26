"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet } from "@/app/lib/apiGet";
import { apiPatch } from "@/app/lib/apiPatch";

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
  amount?: number;
  type: WorkRelationType;
};

type User = {
  id: string;
  name: string;
  lastname: string;
  phoneNumber: string;
  email?: string;
  userProfile?: { avatarUrl?: string };
  workRelations?: WorkRelation[];
};

export default function StaffDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [newAmount, setNewAmount] = useState<number | null>(null);
  const [editingAmountId, setEditingAmountId] = useState<string | null>(null);

  const getImageSrc = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  };

  function capitalizeFirst(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const handleSaveAmount = async (relationId: string) => {
    try {
      await apiPatch(`/work-relations/${relationId}`, { amount: newAmount });
      const res = await apiGet<User>(`/user/${id}`);
      setUser(res);
      setNewAmount(null);
      setEditingAmountId(null);
    } catch (err) {
      console.error("Error guardando comisión", err);
    }
  };

  useEffect(() => {
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
    if (id) fetchUser();
  }, [id]);

  console.log("user: ", user)

  if (loading) return <p>Cargando...</p>;
  if (!user) return <p>Usuario no encontrado ❌</p>;

  return (
    <div className="flex flex-col space-y-4 p-6">
      <div className="">
        <div className="flex items-center gap-4 w-full">
          {user.userProfile?.avatarUrl ? (
            <img
              src={getImageSrc(user.userProfile.avatarUrl)}
              alt={`${user.name} ${user.lastname}`}
              className="w-20 h-20 rounded-full border border-gray-600"
            />
          ) : (
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-pink-700 text-white font-bold text-2xl">
              {user.name.charAt(0)}
              {user.lastname.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-semibold">{user.name}</h1>{" "}
            <h1 className="text-3xl font-semibold">{user.lastname}</h1>
          </div>
        </div>
        <div className="py-2">
          <p className="text-gray-300">{user.email}</p>
          <p>{user.id}</p>
          <p className="text-gray-300">{user.phoneNumber}</p>
        </div>
      </div>

      {user.workRelations?.map((wr) => (
        <div key={wr.id} className="mb-3 px-2 space-y-2">
          <p>
            <strong className="text-pink-600 text-xl">
              {capitalizeFirst(wr.type.name)}
            </strong>
            : {wr.type.description}
          </p>

          {wr.amount !== null && wr.amount !== undefined ? (
            editingAmountId === wr.id ? (
              <div className="flex flex-col gap-2 items-start">
                <input
                  type="number"
                  value={newAmount !== null ? newAmount : ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewAmount(val === "" ? null : Number(val));
                  }}
                  placeholder={
                    wr.type.name === "contratista"
                      ? "Ingresar % comisión"
                      : "Ingresar monto"
                  }
                  className="px-2 py-1 rounded border border-gray-400 text-white"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveAmount(wr.id)}
                    className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => {
                      setEditingAmountId(null);
                      setNewAmount(null);
                    }}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xl">
                <p>
                  <span className="text-pink-600">
                    {" "}
                    {wr.type.name === "contratista" && "Comisión "}
                    {wr.type.name === "empleado" && "Salario "}
                    {wr.type.name === "arrendador" && "Alquiler "}
                    actual:
                  </span>{" "}
                  {wr.type.name === "arrendador" ||
                  wr.type.name === "empleado" ? (
                    <span>{"$" + " " + wr.amount}</span>
                  ) : (
                    <span>{wr.amount}%</span>
                  )}{" "}
                </p>
                <button
                  onClick={() => {
                    setEditingAmountId(wr.id);
                    setNewAmount(wr.amount ?? null);
                  }}
                  className="ml-2 px-2 py-1 bg-pink-600 text-white hover:bg-pink-700 rounded-md text-sm"
                >
                  Editar
                </button>
              </div>
            )
          ) : editingAmountId === wr.id ? (
            <div className="flex flex-col gap-2 items-start">
              <input
                type="number"
                value={newAmount !== null ? newAmount : ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewAmount(val === "" ? null : Number(val));
                }}
                placeholder={
                  wr.type.name === "contratista"
                    ? "Ingresar % comisión"
                    : "Ingresar monto"
                }
                className="px-2 py-1 rounded border border-gray-400 text-white"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => handleSaveAmount(wr.id)}
                  className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600"
                >
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setEditingAmountId(null);
                    setNewAmount(null);
                  }}
                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="text-gray-400">
              {wr.type.name === "contratista" && (
                <p>Aún no se establecio porcentaje de comisión.</p>
              )}
              {wr.type.name === "empleado" && (
                <p>Aún no se establecio el monto de salario.</p>
              )}
              {wr.type.name === "arrendador" && (
                <p>Aún no se establecio un monto de alquiler.</p>
              )}
              {}
              <button
                onClick={() => setEditingAmountId(wr.id)}
                className="ml-2 mt-1 px-3 py-2 bg-pink-600 text-white hover:bg-pink-700 rounded-md text-sm"
              >
                Establecer uno
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
