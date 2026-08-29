"use client";

import { useState, useMemo } from "react";
import { useUserFinances } from "@/app/hooks/useUserFinances";
import DateRangePicker, { DateRange } from "../../components/DateRangePicker";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { useAuth } from "@/app/hooks/useAuth";
import { FiDollarSign, FiMinusCircle, FiCheckCircle } from "react-icons/fi";

const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined || amount === null) return "$ 0";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default function UserStaffFinancePage() {
  const { activeEstablishment } = useEstablishment();
  const { user } = useAuth();
  const userId = user?.id ?? "";
  const establishmentId = activeEstablishment?.id ?? "";

  const [rangeType, setRangeType] = useState<
    "day" | "week" | "month" | "year" | "custom"
  >("day");
  const [showCalendar, setShowCalendar] = useState(false);
  const [customRange, setCustomRange] = useState<DateRange>({});

  // Centralización y procesamiento dinámico del rango de fechas
  const { rawFrom, rawTo, finalFrom, finalTo } = useMemo(() => {
    const today = new Date();
    let fromStr: string | undefined;
    let toStr: string | undefined;

    if (rangeType === "day") {
      fromStr = today.toISOString().split("T")[0];
      toStr = fromStr;
    } else if (rangeType === "week") {
      const start = new Date(today);
      start.setDate(today.getDate() - today.getDay());
      fromStr = start.toISOString().split("T")[0];
      toStr = today.toISOString().split("T")[0];
    } else if (rangeType === "month") {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      fromStr = start.toISOString().split("T")[0];
      toStr = today.toISOString().split("T")[0];
    } else if (rangeType === "year") {
      const start = new Date(today.getFullYear(), 0, 1);
      fromStr = start.toISOString().split("T")[0];
      toStr = today.toISOString().split("T")[0];
    } else if (rangeType === "custom") {
      fromStr = customRange.from;
      toStr = customRange.to || customRange.from;
    }

    let fFrom = fromStr;
    let fTo = toStr;

    if (fFrom && fTo) {
      fFrom = `${fFrom}T00:00:00.000Z`;
      fTo = `${fTo}T23:59:59.999Z`;
    }

    return {
      rawFrom: fromStr,
      rawTo: toStr,
      finalFrom: fFrom,
      finalTo: fTo,
    };
  }, [rangeType, customRange]);

  const { data, loading, error } = useUserFinances({
    userId,
    establishmentId,
    from: finalFrom,
    to: finalTo,
  });

  // Título legible para el período actual
  const periodTitle = useMemo(() => {
    if (!rawFrom) return "";

    if (rangeType === "day") {
      const date = new Date(`${rawFrom}T00:00:00`);
      return capitalize(
        date.toLocaleDateString("es-AR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
    }

    if (rangeType === "month") {
      const date = new Date(`${rawFrom}T00:00:00`);
      return capitalize(
        date.toLocaleDateString("es-AR", {
          month: "long",
          year: "numeric",
        })
      );
    }

    if (rangeType === "year") {
      const date = new Date(`${rawFrom}T00:00:00`);
      return date.getFullYear().toString();
    }

    if (rangeType === "week" || rangeType === "custom") {
      const fromDate = new Date(`${rawFrom}T00:00:00`).toLocaleDateString(
        "es-AR",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      );

      if (!rawTo || rawFrom === rawTo) {
        return capitalize(
          new Date(`${rawFrom}T00:00:00`).toLocaleDateString("es-AR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        );
      }

      const toDate = new Date(`${rawTo}T00:00:00`).toLocaleDateString(
        "es-AR",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      );
      return `${fromDate} a ${toDate}`;
    }

    return "";
  }, [rangeType, rawFrom, rawTo]);

  const handleCustomRangeChange = (newRange: DateRange) => {
    setCustomRange(newRange);
    setRangeType("custom");
  };

  return (
    <div className="px-6 py-4 max-w-4xl mx-auto text-white space-y-4">
      {/* Selector de Rango Reutilizable */}
      <DateRangePicker
        rangeType={rangeType}
        onRangeTypeChange={setRangeType}
        customRange={customRange}
        onCustomRangeChange={handleCustomRangeChange}
        showCalendar={showCalendar}
        setShowCalendar={setShowCalendar}
      />

      {!showCalendar && (
        <>
          {/* Skeleton Loader */}
          {loading && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-28 bg-gray-800/50 rounded-xl animate-pulse" />
                <div className="h-28 bg-gray-800/50 rounded-xl animate-pulse" />
              </div>
              <div className="h-32 bg-gray-800/50 rounded-xl animate-pulse" />
            </div>
          )}

          {/* Estado de Error */}
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-center font-medium">
              Error al obtener finanzas: {error}
            </div>
          )}

          {/* Datos Financieros */}
          {!loading && !error && data && data.totalOfferings > 0 ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Tarjetas de Métricas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-darkBrandBlue border border-gray-800 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Total Acumulado Bruto
                    </span>
                    <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
                      <FiDollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <span className="text-3xl font-extrabold text-white mt-3">
                    {formatCurrency(data.totalOfferings)}
                  </span>
                </div>

                <div className="p-5 rounded-xl bg-darkBrandBlue border border-gray-800 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Retención Establecimiento
                    </span>
                    {data.commissionRate !== undefined && (
                      <span className="text-xs bg-pink-500/20 text-pink-400 px-2.5 py-1 rounded-full font-semibold border border-pink-500/30">
                        {data.commissionRate}%
                      </span>
                    )}
                  </div>
                  <span className="text-3xl font-extrabold text-red-400 mt-3 flex items-center gap-1">
                    <FiMinusCircle className="text-2xl" />
                    {formatCurrency(data.deduction)}
                  </span>
                </div>
              </div>

              {/* Banner Total Neto */}
              <div className="p-6 rounded-xl bg-linear-to-r from-blue-900/60 to-indigo-900/60 border border-blue-500/30 text-center shadow-lg">
                <span className="text-xs font-semibold tracking-wider text-blue-200 uppercase flex items-center justify-center gap-1.5">
                  <FiCheckCircle className="text-blue-400" />
                  Total Neto Recaudado
                </span>
                <div className="text-4xl font-black text-white mt-2">
                  {formatCurrency(data.finalTotal)}
                </div>
              </div>
            </div>
          ) : (
            !loading && (
              <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800 space-y-2">
                {periodTitle && (
                  <h3 className="text-lg font-semibold text-gray-200">
                    {periodTitle}
                  </h3>
                )}
                <p className="text-gray-400 text-sm">
                  No hay movimientos registrados para este período.
                </p>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}