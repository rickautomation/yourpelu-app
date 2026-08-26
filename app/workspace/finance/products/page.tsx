"use client";

import { useState, useMemo } from "react";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { useFinanceIncomeProduct } from "@/app/hooks/useFinanceIncomeProduct";
import DateRangePicker, { DateRange } from "../../components/DateRangePicker";
import { IoMdTrendingDown, IoMdTrendingUp } from "react-icons/io";
import { TbMoneybag } from "react-icons/tb";

const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined || amount === null) return "$ 0";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function FinanceDashboard() {
  const { activeEstablishment } = useEstablishment();

  // Estados del DateRangePicker
  const [rangeType, setRangeType] = useState<"day" | "week" | "month" | "year" | "custom" | "all">("month");
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [customRange, setCustomRange] = useState<DateRange>({});

  // Calcular las fechas formateadas para la API
  const { startDate, endDate } = useMemo(() => {
    const now = new Date();
    let start: Date | null = null;
    let end: Date | null = new Date();

    switch (rangeType) {
      case "day":
        start = new Date(now.setHours(0, 0, 0, 0));
        break;
      case "week": {
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Lunes
        start = new Date(now.setDate(diff));
        start.setHours(0, 0, 0, 0);
        break;
      }
      case "month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "year":
        start = new Date(now.getFullYear(), 0, 1);
        break;
      case "custom":
        return {
          startDate: customRange.from ? `${customRange.from}T00:00:00.000Z` : undefined,
          endDate: customRange.to ? `${customRange.to}T23:59:59.999Z` : undefined,
        };
      case "all":
      default:
        return { startDate: undefined, endDate: undefined };
    }

    return {
      startDate: start ? start.toISOString() : undefined,
      endDate: end ? end.toISOString() : undefined,
    };
  }, [rangeType, customRange]);

  // Hook consumiendo las fechas dinámicas
  const { data, loading, error } = useFinanceIncomeProduct(
    activeEstablishment?.id,
    startDate,
    endDate
  );

  const isMarginPositive = (data?.margin ?? 0) >= 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Selector de Rango Reutilizable */}
      <DateRangePicker
        rangeType={rangeType as any}
        onRangeTypeChange={(type) => setRangeType(type as any)}
        customRange={customRange}
        onCustomRangeChange={setCustomRange}
        showCalendar={showCalendar}
        setShowCalendar={setShowCalendar}
      />

      {/* Contenido principal cuando el calendario no está activo */}
      {!showCalendar && (
        <>
          {/* Skeleton de Carga */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-luminiBrandBlue/50 h-32 rounded-xl p-5 border border-white/5 animate-pulse flex justify-between items-center"
                >
                  <div className="space-y-3 w-full">
                    <div className="h-4 w-24 bg-gray-700/60 rounded" />
                    <div className="h-8 w-36 bg-gray-700/60 rounded" />
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gray-700/60 shrink-0" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center font-medium">
              Error al cargar los datos financieros: {error}
            </div>
          ) : (
            /* Tarjetas de Métrica */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card: Ingresos */}
              <div className="bg-luminiBrandBlue rounded-xl p-5 border border-white/5 shadow-lg flex items-center justify-between transition-transform duration-200 hover:-translate-y-0.5">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    Ingresos Totales
                  </span>
                  <p className="text-3xl font-bold text-white tracking-tight">
                    {formatCurrency(data?.totalIncome)}
                  </p>
                </div>
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 shrink-0">
                  <IoMdTrendingUp className="w-8 h-8" />
                </div>
              </div>

              {/* Card: Costos */}
              <div className="bg-luminiBrandBlue rounded-xl p-5 border border-white/5 shadow-lg flex items-center justify-between transition-transform duration-200 hover:-translate-y-0.5">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    Costos Totales
                  </span>
                  <p className="text-3xl font-bold text-white tracking-tight">
                    {formatCurrency(data?.totalCost)}
                  </p>
                </div>
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 shrink-0">
                  <IoMdTrendingDown className="w-8 h-8" />
                </div>
              </div>

              {/* Card: Ganancia (Destacada) */}
              <div
                className={`rounded-xl p-5 border shadow-lg flex items-center justify-between transition-transform duration-200 hover:-translate-y-0.5 ${
                  isMarginPositive
                    ? "bg-linear-to-br from-luminiBrandBlue via-luminiBrandBlue to-emerald-950/40 border-emerald-500/30"
                    : "bg-linear-to-br from-luminiBrandBlue via-luminiBrandBlue to-rose-950/40 border-rose-500/30"
                }`}
              >
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
                    Ganancia Neta
                  </span>
                  <p
                    className={`text-3xl font-extrabold tracking-tight ${
                      isMarginPositive ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {formatCurrency(data?.margin)}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl shrink-0 ${
                    isMarginPositive
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                  }`}
                >
                  <TbMoneybag className="w-8 h-8" />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}