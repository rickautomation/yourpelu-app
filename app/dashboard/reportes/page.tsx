"use client";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useAuth } from "@/app/lib/useAuth";
import { useAnalytics } from "@/app/hooks/useAnalytics";

import {
  getDayRangeLocal,
  getWeekRangeLocal,
  getMonthRangeLocal,
  getYearRangeLocal,
} from "@/app/lib/dateRanges";
import { useUserEstablishment } from "@/app/hooks/useUserEstablishment";

export default function ReportsPage() {
  const { user } = useAuth();
  const { activeEstablishment } = useUserEstablishment(user);

  // Estado para el tipo de reporte (Resumen o Detalle)
  const [reportType, setReportType] = useState<"summary" | "detail">("summary");

  // Estado para mostrar/ocultar el dropdown de tipo de reporte
  const [showReportDropdown, setShowReportDropdown] = useState(false);

  // Estado para dropdown
  const [rangeType, setRangeType] = useState<"day" | "week" | "month" | "year">(
    "day",
  );
  const [showDropdown, setShowDropdown] = useState(false);

  const ranges = [
    {
      id: "day",
      label: "Día actual",
      fn: () => getDayRangeLocal("America/Argentina/Buenos_Aires"),
    },
    {
      id: "week",
      label: "Semana",
      fn: () => getWeekRangeLocal("America/Argentina/Buenos_Aires"),
    },
    {
      id: "month",
      label: "Mes",
      fn: () => getMonthRangeLocal("America/Argentina/Buenos_Aires"),
    },
    {
      id: "year",
      label: "Año",
      fn: () => getYearRangeLocal("America/Argentina/Buenos_Aires"),
    },
  ];

  const selectedRange = ranges.find((r) => r.id === rangeType)!;
  const dayRange = selectedRange.fn();

  const {
    summary,
    paymentMethods,
    categories,
    clientsSummary,
    usersSummary,
    loading,
    error,
  } = useAnalytics(activeEstablishment?.id, dayRange);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="space-y-3 p-3">
      <div className="flex items-center justify-between gap-4">
        {/* Dropdown de tipo de reporte */}
        <div className="relative flex-1">
          <button
            onClick={() => setShowReportDropdown(!showReportDropdown)}
            className="w-full px-3 py-2 bg-ligthBrandBlue text-white rounded flex justify-between items-center text-lg"
          >
            {reportType === "summary" ? "Resumen" : "Detalle"}
            <FiChevronDown
              className={`ml-2 text-xl transition-transform duration-200 ${
                showReportDropdown ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
          {showReportDropdown && (
            <ul className="absolute border top-full left-0 mt-1 w-full max-h-60 overflow-y-auto bg-exposeBrandBlue rounded shadow-lg z-10 ">
              <li
                onClick={() => {
                  setReportType("summary");
                  setShowReportDropdown(false);
                }}
                className="px-3 py-2 text-white hover:bg-gray-600 activate:bg-slate-900 cursor-pointer border border-t border-gray-700"
              >
                Resumen
              </li>
              <li
                onClick={() => {
                  setReportType("detail");
                  setShowReportDropdown(false);
                }}
                className="px-3 py-2 text-white hover:bg-gray-600 activate:bg-slate-900 cursor-pointer"
              >
                Detalle
              </li>
            </ul>
          )}
        </div>

        {/* Dropdown de rango de fechas */}
        <div className="relative flex-1">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full px-3 py-2 bg-ligthBrandBlue text-white rounded flex justify-between items-center text-lg"
          >
            {selectedRange.label}
            <FiChevronDown
              className={`ml-2 text-xl transition-transform duration-200 ${
                showDropdown ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
          {showDropdown && (
            <ul className="absolute top-full left-0 mt-1 w-full max-h-60 overflow-y-auto bg-exposeBrandBlue border rounded shadow-lg z-10">
              {ranges.map((r) => (
                <li
                  key={r.id}
                  onClick={() => {
                    setRangeType(r.id as any);
                    setShowDropdown(false);
                  }}
                  className="px-3 py-2 text-white hover:bg-gray-600 activate:bg-slate-900 cursor-pointer border-t border-gray-700"
                >
                  {r.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {reportType === "summary" ? (
        // 🔹 Render actual de Resumen
        summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
            <div className="flex-1 bg-exposeBrandBlue shadow-md rounded-lg p-6 flex flex-col gap-1 items-center">
              <p className="text-5xl font-bold text-blue-600">
                {summary.servicesCount}
              </p>
              <div className="flex text-center text-xl">
                <h3 className="font-semibold text-white mb-2">Servicios</h3>
              </div>
            </div>

            <div className="flex-1 bg-exposeBrandBlue shadow-md rounded-lg p-6 flex flex-col gap-1 items-center">
              <p className="text-5xl font-bold text-green-600">
                ${Number(summary.totalRevenue).toLocaleString("es-AR")}
              </p>
              <div className="flex gap-1 text-center text-xl">
                <h3 className="font-semibold text-white mb-2">Total</h3>
                <h3 className="font-semibold text-white mb-2">acumulado</h3>
              </div>
            </div>
          </div>
        )
      ) : (
        // 🔹 Vista de detalle
        <div className="space-y-3 py-2">
          {/* Barberos/Usuarios */}
          {usersSummary.length > 0 && user?.rol === "admin" && (
            <div className="bg-exposeBrandBlue shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4 border-b">
                Barberos
              </h3>
              <div className="grid grid-cols-3 gap-4 text-white">
                {usersSummary.map((user) => (
                  <div key={user.userId} className="contents">
                    <span>{user.userName}</span>
                    <span className="text-center">x{user.servicesCount}</span>
                    <span>
                      $ {Number(user.totalRevenue).toLocaleString("es-AR")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Métodos de pago */}
          {paymentMethods.length > 0 && (
            <div className="bg-exposeBrandBlue shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4 border-b">
                Métodos de pago
              </h3>
              <div className="grid grid-cols-3 gap-4 text-white ">
                {paymentMethods.map((pm) => (
                  <div key={pm.method} className="contents">
                    <span>{pm.method || "Sin designar"}</span>
                    <span className="text-center">x{pm.count}</span>
                    <span>
                      $ {Number(pm.totalPrice).toLocaleString("es-AR")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categorías */}
          {categories.length > 0 && (
            <div className="bg-exposeBrandBlue shadow-md rounded-lg p-3">
              <h3 className="text-lg font-semibold text-white mb-4">
                Categorías
              </h3>
              <div className="space-y-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="text-white border rounded-md p-2"
                  >
                    {/* Cabecera de la categoría */}
                    <div className="grid grid-cols-3 gap-4 font-bold mb-2 border-b border-gray-600">
                      <span>{cat.name}</span>
                    </div>

                    {/* Tipos dentro de la categoría */}
                    <div className="grid grid-cols-[2fr_1fr_2fr] gap-4 ml-4 items-end text-start ">
                      {Object.entries(cat.types).map(([typeName, typeData]) => (
                        <div key={typeName} className="contents">
                          <span className="text-sm">{typeName}</span>
                          <span>x {typeData.count}</span>
                          <span className="text-right">
                            $ {typeData.totalPrice.toLocaleString("es-AR")}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-4 font-bold mt-2 border-t border-gray-600">
                      <span>{"Total: "}</span>
                      <span>{cat.totalCount} servicios</span>
                      <span className="text-right">
                        $ {cat.totalPrice.toLocaleString("es-AR")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clientes */}
          {clientsSummary.length > 0 && (
            <div className="bg-exposeBrandBlue shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4 border-b">
                Clientes
              </h3>
              <div className="grid grid-cols-3 gap-4 text-white">
                {clientsSummary.map((client) => (
                  <div
                    key={client.clientId || client.clientName}
                    className="contents"
                  >
                    <span>{client.clientName}</span>
                    <span className="text-center">x{client.servicesCount}</span>
                    <span>
                      $ {Number(client.totalRevenue).toLocaleString("es-AR")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
