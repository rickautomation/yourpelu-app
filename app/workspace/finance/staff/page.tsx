"use client";

import { useState, useMemo } from "react";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { useEstablishmentFinance } from "@/app/hooks/useEstablishmentFinance";
import DateRangePicker, { DateRange } from "../../components/DateRangePicker";
import { FiUser, FiBriefcase, FiInbox, FiTrendingUp, FiCalendar } from "react-icons/fi";

const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined || amount === null) return "$ 0";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default function IncomeStaffPage() {
  const { activeEstablishment } = useEstablishment();

  const [rangeType, setRangeType] = useState<"day" | "week" | "month" | "year" | "custom">("day");
  const [showCalendar, setShowCalendar] = useState(false);
  const [customRange, setCustomRange] = useState<DateRange>({});

  // Centralización y corrección del cálculo de fechas (Soporta rangos y selección individual en calendario)
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
      // Si solo eligieron una fecha en el calendario, la usamos como desde y hasta
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

  const { balance, loading, error } = useEstablishmentFinance(
    activeEstablishment?.id,
    finalFrom,
    finalTo
  );

  // Formateador dinámico del título del período
  const periodTitle = useMemo(() => {
    if (!rawFrom) return "Seleccione una fecha";

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
      const fromDate = new Date(`${rawFrom}T00:00:00`).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      if (!rawTo || rawFrom === rawTo) {
        return capitalize(
          new Date(`${rawFrom}T00:00:00`).toLocaleDateString("es-AR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        );
      }

      const toDate = new Date(`${rawTo}T00:00:00`).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return `${fromDate} a ${toDate}`;
    }

    return "";
  }, [rangeType, rawFrom, rawTo]);

  // Manejador del cambio de fecha desde el calendario
  const handleCustomRangeChange = (newRange: DateRange) => {
    setCustomRange(newRange);
    setRangeType("custom"); // Forzamos el tipo a 'custom' para activar el filtro
  };

  return (
    <div className="px-6 py-4 max-w-5xl mx-auto text-white space-y-2">
      {/* Selector de Rango */}
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
              <div className="h-6 w-48 bg-gray-700/60 rounded animate-pulse" />
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-luminiBrandBlue/40 border border-white/5 h-20 rounded-xl animate-pulse p-4 flex items-center justify-between"
                >
                  <div className="h-5 w-40 bg-gray-700/60 rounded" />
                  <div className="h-6 w-24 bg-gray-700/60 rounded" />
                </div>
              ))}
              <div className="h-24 bg-luminiBrandBlue/60 border border-white/5 rounded-xl animate-pulse" />
            </div>
          )}

          {/* Estado de Error */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-center font-medium">
              Error al obtener los datos del personal.
            </div>
          )}

          {/* Listado de Personal y Totales */}
          {!loading && !error && balance?.users && balance.totalEstablishment > 0 ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                {balance.users.map((u) => {
                  const isContratista = u.workRelation?.toLowerCase() === "contratista";

                  return (
                    <div
                      key={u.userId}
                      className="bg-luminiBrandBlue border border-white/10 rounded-xl p-4 shadow-md hover:border-white/20 transition-all duration-200"
                    >
                      {/* Cabecera de la Tarjeta */}
                      <div className="flex items-center justify-between mb-2 border-white/5 pb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
                            <FiUser className="w-5 h-5" />
                          </div>
                          <p className="font-semibold text-lg text-white">
                            {u.name} {u.lastname}
                          </p>
                        </div>
                        {isContratista && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            <FiBriefcase className="w-3 h-3" /> Contratista
                          </span>
                        )}
                      </div>

                      {/* Métricas por tipo de relación */}
                      {isContratista ? (
                        <div className="grid grid-cols-3 gap-2 bg-exposeBrandBlue/40 p-3 rounded-lg border border-white/5 text-center">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                              Facturado
                            </span>
                            <span className="text-base font-semibold text-gray-200">
                              {formatCurrency(u.offeringTotal)}
                            </span>
                          </div>
                          <div className="flex flex-col border-x border-white/5">
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                              Comisión
                            </span>
                            <span className="text-base font-semibold text-pink-400">
                              {u.commissionPercentage ?? 0}%
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                              Ajustado
                            </span>
                            <span className="text-base font-extrabold text-emerald-400">
                              {formatCurrency(Math.round(u.adjustedTotal))}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between bg-exposeBrandBlue/40 p-3 rounded-lg border border-white/5 px-4">
                          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                            Total Generado
                          </span>
                          <span className="text-xl font-bold text-emerald-400">
                            {formatCurrency(u.offeringTotal)}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Banner Total General */}
              <div className="bg-linear-to-r from-luminiBrandBlue via-luminiBrandBlue to-pink-950/40 border border-pink-500/30 rounded-xl p-6 shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-pink-500/20 rounded-xl text-pink-300 border border-pink-500/30">
                    <FiTrendingUp className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Recaudación Total
                    </span>
                    <p className="text-3xl font-extrabold text-white tracking-tight">
                      {formatCurrency(balance.totalEstablishment)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Estado Vacío */}
          {!loading && !error && (!balance || !balance.users || balance.totalEstablishment === 0) && (
            <div className="space-y-4 mt-4">
              <div className="flex flex-col items-center justify-center py-14 text-center bg-luminiBrandBlue/40 rounded-xl border border-white/5 space-y-3">
                <div className="p-4 bg-gray-800/50 rounded-full text-gray-400">
                  <FiInbox className="w-8 h-8" />
                </div>
                <p className="text-base text-gray-300 font-medium max-w-sm">
                  No se registraron ingresos ni actividad del personal para este período.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}