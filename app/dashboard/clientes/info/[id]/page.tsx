"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiGet } from "@/app/lib/apiGet";
import { useClients } from "@/app/hooks/useClients";

interface Haircut {
  id: string;
  createdAt: string;
  price: number;
  style?: { name: string };
  type: { name: string };
}

interface ClientStats {
  lastThree: Haircut[];
  count: number;
  byType: Record<string, number>;
  byStyle: Record<string, number>;
  byUser: Record<string, number>; // 👈 nuevo campo
}

export default function ClientInfoPage() {
  const params = useParams<{ id: string }>();
  const clientId = params.id;
  const { client } = useClients(undefined, clientId); // Usar el hook personalizado

  const [stats, setStats] = useState<ClientStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiGet<ClientStats>(
          `/haircuts/client/${clientId}/stats`,
        );
        setStats(data);
      } catch (err) {
        console.error("Error cargando estadísticas del cliente", err);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchStats();
    }
  }, [clientId]);

  if (loading) return <p className="text-gray-400">Cargando estadísticas...</p>;
  if (!stats) return <p className="text-red-400">Error cargando datos.</p>;

  console.log("stats: ", stats);
  console.log("client", client);

  return (
    <div className="space-y-3 p-4">
      <div className="flex justify-around">
        <div className="p-1">
          <p>
            {client?.name} {client?.lastname}
          </p>
          <p className="text-gray-400">{client?.email}</p>
          <p className="text-gray-400">{client?.phone}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-1 text-center text-white">
          <p className="text-lg">Servicios Totales</p>
          <p className="text-3xl font-bold"> {stats.count}</p>
        </div>
      </div>

            {/* Distribución por estilo */}
      <div className="space-y-1">
        <div className="border border-pink-600 rounded-lg p-1">
          <h2 className="text-xl font-semibold text-center text-white">
          Estilos Preferidos
        </h2>
        </div>
        <div className="flex text-gray-300 ">
          {Object.entries(stats.byStyle).map(([style, count]) => (
            <div
              key={style}
              className="w-24 border rounded-md px-2 py-4 m-1 text-center"
            >
              <p className="text-pink-600">{style}</p>
              <p className="text-3xl text-pink-600 font-bold">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Últimos 3 cortes */}
      <div className="space-y-2 p-2">
        <h2 className="text-xl text-center font-semibold text-white">
          Últimos cortes
        </h2>
        {stats.lastThree.length === 0 ? (
          <p className="text-gray-400">No hay cortes registrados.</p>
        ) : (
          <ul className="divide-y divide-gray-600 rounded-lg text-sm text-white">
            <li className="flex bg-gray-800 text-pink-500 font-semibold">
              <div className="flex-1 px-2 py-2">Fecha</div>
              <div className="flex-1 px-2 py-2">Tipo</div>
              <div className="flex-1 px-2 py-2">Estilo</div>
            </li>
            {stats.lastThree.map((cut) => (
              <li
                key={cut.id}
                className="flex bg-gray-700 shadow-md"
              >
                <div className="flex-1 px-2 py-2">
                  {new Date(cut.createdAt).toLocaleDateString()}
                </div>
                <div className="flex-1 px-2 py-2">{cut.type?.name}</div>
                <div className="flex-1 px-2 py-2">{cut.style?.name ?? "-"}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Distribución por tipo */}
      <div>
        <h2 className="text-xl text-center font-semibold text-white">
          Servicios utilizados
        </h2>
        <ul className="space-y-1 text-gray-300">
          {Object.entries(stats.byType).map(([type, count]) => (
            <li key={type}>
              {type}: {count}
            </li>
          ))}
        </ul>
      </div>

      {/* Distribución por barbero */}
      <div>
        <h2 className="text-xl font-semibold text-white">Cortes por barbero</h2>
        <ul className="space-y-1 text-gray-300">
          {Object.entries(stats.byUser).map(([user, count]) => (
            <li key={user}>
              {user}: {count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
