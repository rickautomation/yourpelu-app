"use client";

import { useState, useMemo, useEffect } from "react";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { useOfferingsCrud } from "@/app/hooks/useOfferingsCrud";
import DateRangePicker, {
  DateRange,
} from "@/app/workspace/components/DateRangePicker";
import { FiCalendar, FiDollarSign } from "react-icons/fi";

const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined || amount === null) return "$ 0";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function OfferingsHistoryPage() {
  const { activeEstablishment } = useEstablishment();
  const { offerings, loading, error, fetchOfferings } = useOfferingsCrud();

  // Estados del DateRangePicker (idéntico a tu FinanceDashboard)
  const [rangeType, setRangeType] = useState<
    "day" | "week" | "month" | "year" | "custom" | "all"
  >("month");
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [customRange, setCustomRange] = useState<DateRange>({});

  // Cálculo dinámico de fechas ISO
  const { startDate, endDate } = useMemo(() => {
    if (rangeType === "all") {
      return { startDate: undefined, endDate: undefined };
    }

    const today = new Date();

    if (rangeType === "custom") {
      if (!customRange.from)
        return { startDate: undefined, endDate: undefined };

      const [fY, fM, fD] = customRange.from.split("-").map(Number);
      const start = new Date(fY, fM - 1, fD, 0, 0, 0, 0);

      let end: Date;
      if (customRange.to) {
        const [tY, tM, tD] = customRange.to.split("-").map(Number);
        end = new Date(tY, tM - 1, tD, 23, 59, 59, 999);
      } else {
        end = new Date(fY, fM - 1, fD, 23, 59, 59, 999);
      }

      return {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      };
    }

    let start: Date;
    let end: Date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999,
    );

    switch (rangeType) {
      case "day":
        start = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          0,
          0,
          0,
          0,
        );
        break;

      case "week": {
        const dayOfWeek = today.getDay();
        const diffToMonday =
          today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        start = new Date(
          today.getFullYear(),
          today.getMonth(),
          diffToMonday,
          0,
          0,
          0,
          0,
        );
        break;
      }

      case "month":
        start = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
        break;

      case "year":
        start = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);
        break;

      default:
        return { startDate: undefined, endDate: undefined };
    }

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  }, [rangeType, customRange]);

  // Cada vez que cambie el establecimiento activo o las fechas, volvemos a buscar
  useEffect(() => {
    if (activeEstablishment?.id) {
      fetchOfferings(activeEstablishment.id, startDate, endDate);
    }
  }, [activeEstablishment?.id, startDate, endDate]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Historial de Servicios / Cobros
          </h1>
          <p className="text-sm text-gray-400">
            Filtrá y revisá los registros por rango de fecha
          </p>
        </div>

        {/* Selector de Rango Reutilizable */}
        <DateRangePicker
          rangeType={rangeType as any}
          onRangeTypeChange={(type) => setRangeType(type as any)}
          customRange={customRange}
          onCustomRangeChange={setCustomRange}
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
        />
      </div>

      {/* Contenido cuando no está el calendario desplegado */}
      {!showCalendar && (
        <div className="bg-luminiBrandBlue/50 border border-white/10 rounded-2xl p-6 shadow-xl">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-rose-400 text-center py-8">
              Error al cargar los registros: {error.message}
            </div>
          ) : offerings.length === 0 ? (
            <div className="text-center py-12 text-gray-400 space-y-2">
              <FiCalendar className="mx-auto text-3xl opacity-40" />
              <p>No se encontraron registros para este período.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Fecha</th>
                    <th className="py-3 px-4">Cliente</th>
                    <th className="py-3 px-4">Tipo / Servicio</th>
                    <th className="py-3 px-4">Categoría</th>
                    <th className="py-3 px-4 text-right">Precio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm text-gray-200">
                  {offerings.map((off) => (
                    <tr
                      key={off.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4 text-gray-400">
                        {off.createdAt
                          ? new Date(off.createdAt).toLocaleDateString(
                              "es-AR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
                          : "-"}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {off.client
                          ? `${off.client.name} ${off.client.lastname}`
                          : "Cliente general / Ocasional"}
                      </td>
                      <td className="py-3 px-4 text-cyan-300">
                        {off.clientOfferingType?.name || "N/D"}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {off.clientOfferingCategory?.name || "N/D"}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-400">
                        {formatCurrency(off.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
