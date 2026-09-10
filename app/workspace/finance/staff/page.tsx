"use client";

import { useState, useMemo } from "react";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { useEstablishmentFinance } from "@/app/hooks/useEstablishmentFinance";
import DateRangePicker, { DateRange } from "../../components/DateRangePicker";
import {
  FiUser,
  FiBriefcase,
  FiInbox,
  FiTrendingUp,
  FiInfo,
  FiDollarSign,
} from "react-icons/fi";

const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined || amount === null) return "$ 0";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function IncomeStaffPage() {
  const { activeEstablishment } = useEstablishment();

  const [rangeType, setRangeType] = useState<
    "day" | "week" | "month" | "year" | "custom"
  >("day");
  const [showCalendar, setShowCalendar] = useState(false);
  const [customRange, setCustomRange] = useState<DateRange>({});

  const { finalFrom, finalTo } = useMemo(() => {
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

    return { rawFrom: fromStr, rawTo: toStr, finalFrom: fFrom, finalTo: fTo };
  }, [rangeType, customRange]);

  const { balance, loading, error } = useEstablishmentFinance(
    activeEstablishment?.id,
    finalFrom,
    finalTo,
  );

  // Agrega este chequeo antes del return
  const hasFinancialData = useMemo(() => {
    if (!balance) return false;

    // Verifica si las métricas globales son mayores a 0
    // o si al menos un usuario tiene offeringTotal/adjustedTotal > 0
    return (
      (balance.realEstablishmentRevenue ?? 0) > 0 ||
      (balance.grossProcessedTotal ?? 0) > 0 ||
      balance.users?.some(
        (u) => (u.offeringTotal ?? 0) > 0 || (u.adjustedTotal ?? 0) > 0,
      )
    );
  }, [balance]);

  console.log("balance: ", balance);

  const getWorkRelationBadgeStyle = (relation: string | null) => {
    const rel = relation?.toLowerCase();

    switch (rel) {
      case "contratista":
        return "bg-pink-500/10 text-pink-300 border-pink-500/20";
      case "arrendador":
        return "bg-amber-500/10 text-amber-300 border-amber-500/20";
      case "empleado":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
      default:
        return "bg-blue-500/10 text-blue-300 border-blue-500/20";
    }
  };

  const handleCustomRangeChange = (newRange: DateRange) => {
    setCustomRange(newRange);
    setRangeType("custom");
  };

  const isFullMonth = balance?.isFullMonthPeriod === true;

  console.log("balance: ", balance);

  return (
    <div className="p-5 max-w-5xl mx-auto text-white space-y-4">
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
            </div>
          )}

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-center font-medium">
              Error al obtener los datos del personal.
            </div>
          )}

          {!loading && !error && hasFinancialData ? (
            <div className="space-y-3">
              {/* METRICAS PRINCIPALES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="bg-linear-to-r from-luminiBrandBlue via-luminiBrandBlue to-pink-950/40 border border-pink-500/30 rounded-xl p-5 shadow-xl flex items-center gap-4">
                  <div className="p-3 bg-pink-500/20 rounded-xl text-pink-300 border border-pink-500/30">
                    <FiTrendingUp className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-pink-300 uppercase tracking-wider">
                      Recaudación Neta
                    </span>
                    <p className="text-3xl font-extrabold text-white tracking-tight">
                      {formatCurrency(balance?.realEstablishmentRevenue)}
                    </p>
                  </div>
                </div>

                <div className="bg-luminiBrandBlue/60 border border-white/10 rounded-xl p-5 shadow-md flex items-center gap-4">
                  <div className="p-3 bg-gray-700/50 rounded-xl text-gray-300 border border-white/10">
                    <FiDollarSign className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Total Procesado en Caja
                    </span>
                    <p className="text-2xl font-bold text-gray-200 tracking-tight">
                      {formatCurrency(balance?.grossProcessedTotal)}
                    </p>
                    {!isFullMonth && (
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        <FiInfo className="w-3 h-3 text-amber-400" /> Incluye
                        servicios cobrados por arrendadores
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* LISTADO DE USUARIOS */}
              <div className="grid grid-cols-1 gap-2">
                {balance?.users.map((u) => {
                  const isContratista =
                    u.workRelation?.toLowerCase() === "contratista";
                  const isArrendador = u.isArrendador;

                  return (
                    <div
                      key={u.userId}
                      className="bg-luminiBrandBlue border border-white/10 rounded-xl p-3 shadow-md hover:border-white/20 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-2 border-white/5 pb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
                            <FiUser className="w-5 h-5" />
                          </div>
                          <p className="font-semibold text-lg text-white">
                            {u.name} {u.lastname}
                          </p>
                        </div>

                        {u.workRelation && (
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${getWorkRelationBadgeStyle(
                              u.workRelation,
                            )}`}
                          >
                            <FiBriefcase className="w-3 h-3" /> {u.workRelation}
                          </span>
                        )}
                      </div>

                      {/* DESGLOSE DE VALORES */}
                      {isContratista ? (
                        /* Contratista: Facturado | % | Comisión obtenida */
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
                              Ganancia
                            </span>
                            <span className="text-base font-extrabold text-emerald-400">
                              {formatCurrency(Math.round(u.adjustedTotal))}
                            </span>
                          </div>
                        </div>
                      ) : isArrendador && isFullMonth ? (
                        /* Arrendador en Mes completo: Muestra Facturado vs Alquiler de Canon Fijo */
                        <div className="grid grid-cols-2 gap-2 bg-exposeBrandBlue/40 p-3 rounded-lg border border-white/5 text-center">
                          <div className="flex flex-col border-r border-white/5">
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                              Servicios Generados
                            </span>
                            <span className="text-base font-semibold text-gray-300">
                              {formatCurrency(u.offeringTotal)}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                              Alquiler Fijo (Ingreso Local)
                            </span>
                            <span className="text-base font-extrabold text-emerald-400">
                              + {formatCurrency(u.adjustedTotal)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* Empleado, Admin o Arrendador en período diario/semanal */
                        <div className="flex items-center justify-between bg-exposeBrandBlue/40 p-3 rounded-lg border border-white/5 px-4">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                              {isArrendador
                                ? "Procesado por Arrendador"
                                : "Total"}
                            </span>
                            {isArrendador && !isFullMonth && (
                              <span className="text-[11px] text-amber-300/90 flex items-center gap-1 mt-0.5">
                                <FiInfo className="w-3 h-3" /> Cobro en caja (no
                                es ganancia del local)
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-xl font-bold ${
                              isArrendador && !isFullMonth
                                ? "text-amber-300"
                                : "text-emerald-400"
                            }`}
                          >
                            {!isArrendador && "+ "}
                            {formatCurrency(u.offeringTotal)}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* ESTADO VACÍO */}
          {!loading && !error && !hasFinancialData && (
            <div className="space-y-4 mt-4">
              <div className="flex flex-col items-center justify-center py-14 text-center bg-luminiBrandBlue/40 rounded-xl border border-white/5 space-y-3">
                <div className="p-4 bg-gray-800/50 rounded-full text-gray-400">
                  <FiInbox className="w-8 h-8" />
                </div>
                <p className="text-base text-gray-300 font-medium max-w-sm">
                  No se registraron ingresos ni actividad del personal para el
                  período seleccionado.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
