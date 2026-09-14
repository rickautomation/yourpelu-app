"use client";

import { useState, useMemo, useEffect } from "react";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { useSupplyFinance } from "@/app/hooks/useSupplyFinance";
import DateRangePicker, { DateRange } from "../../components/DateRangePicker";
import { IoMdTrendingDown } from "react-icons/io";

const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined || amount === null) return "$ 0";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function SuppliesFinancePage() {
  const { activeEstablishment } = useEstablishment();

  const [rangeType, setRangeType] = useState<
    "day" | "week" | "month" | "year" | "custom" | "all"
  >("month");
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [customRange, setCustomRange] = useState<DateRange>({});

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

  const { data, loading, error, fetchSummary } = useSupplyFinance();

  useEffect(() => {
    if (activeEstablishment?.id) {
      fetchSummary(activeEstablishment.id, startDate, endDate);
    }
  }, [activeEstablishment?.id, startDate, endDate, fetchSummary]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <DateRangePicker
        rangeType={rangeType as any}
        onRangeTypeChange={(type) => setRangeType(type as any)}
        customRange={customRange}
        onCustomRangeChange={setCustomRange}
        showCalendar={showCalendar}
        setShowCalendar={setShowCalendar}
      />

      {!showCalendar && (
        <>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="bg-luminiBrandBlue/50 h-32 rounded-xl p-5 border border-white/5 animate-pulse flex justify-between items-center">
                <div className="space-y-3 w-full">
                  <div className="h-4 w-24 bg-gray-700/60 rounded" />
                  <div className="h-8 w-36 bg-gray-700/60 rounded" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-gray-700/60 shrink-0" />
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center font-medium">
              Error al cargar los datos de insumos: {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="bg-luminiBrandBlue rounded-xl p-5 border border-white/5 shadow-lg flex items-center justify-between transition-transform duration-200 hover:-translate-y-0.5">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    Total Gastado en Insumos
                  </span>
                  <p className="text-3xl font-bold text-white tracking-tight">
                    {formatCurrency(data?.totalCost)}
                  </p>
                </div>
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 shrink-0">
                  <IoMdTrendingDown className="w-8 h-8" />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}