"use client";

import { useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import RangeSelector from "./RangeSelector";
import { FiCalendar, FiCheck } from "react-icons/fi";

export interface DateRange {
  from?: string;
  to?: string;
  selectionMode?: "day" | "range" | "month" | "year" | "week";
}

export const RANGES = [
  { id: "day", label: "Hoy" },
  { id: "week", label: "Semana" },
  { id: "month", label: "Mes" },
  { id: "year", label: "Año" },
  { id: "custom", label: "Personalizado" },
];

interface DateRangePickerProps {
  rangeType: "day" | "week" | "month" | "year" | "custom";
  onRangeTypeChange: (
    type: "day" | "week" | "month" | "year" | "custom"
  ) => void;
  customRange: DateRange;
  onCustomRangeChange: (range: DateRange) => void;
  showCalendar: boolean;
  setShowCalendar: (show: boolean) => void;
}

export default function DateRangePicker({
  rangeType,
  onRangeTypeChange,
  customRange,
  onCustomRangeChange,
  showCalendar,
  setShowCalendar,
}: DateRangePickerProps) {
  const [calendarMode, setCalendarMode] = useState<
    "day" | "range" | "month" | "year"
  >("day");

  const parseLocalDate = (dateStr: string) => {
    const cleanStr = dateStr.split("T")[0];
    const [year, month, day] = cleanStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const formatCustomRangeText = (range: DateRange) => {
    if (!range.from) return null;

    const fromDate = parseLocalDate(range.from);
    const toDate = range.to ? parseLocalDate(range.to) : fromDate;

    const activeMode = range.selectionMode || calendarMode;

    switch (activeMode) {
      case "day":
        return fromDate.toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      case "range":
      case "week":
        return `${fromDate.toLocaleDateString("es-AR")} a ${toDate.toLocaleDateString("es-AR")}`;
      case "month": {
        const monthName = fromDate.toLocaleDateString("es-AR", {
          month: "long",
        });
        return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${fromDate.getFullYear()}`;
      }
      case "year":
        return fromDate.getFullYear().toString();
      default:
        return `${fromDate.toLocaleDateString("es-AR")} a ${toDate.toLocaleDateString("es-AR")}`;
    }
  };

  const selectedRange = useMemo(() => {
    if (rangeType === "custom") {
      const formatted = formatCustomRangeText(customRange);
      if (formatted) {
        return {
          id: "custom",
          label: formatted,
        };
      }
    }

    return (
      RANGES.find((r) => r.id === rangeType) || {
        id: "custom",
        label: "Personalizado",
      }
    );
  }, [rangeType, customRange, calendarMode]);

  return (
    <div className="space-y-4">
      <RangeSelector
        ranges={RANGES}
        selectedRange={selectedRange}
        onRangeChange={(id) => onRangeTypeChange(id as any)}
        showCalendar={showCalendar}
        setShowCalendar={setShowCalendar}
      />

      {showCalendar && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Encabezado Selección Actual */}
          {formatCustomRangeText(customRange) && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-pink-600/10 border border-pink-500/20">
              <FiCalendar className="text-pink-400 text-lg shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                  Rango Seleccionado
                </p>
                <p className="text-sm font-semibold text-pink-300">
                  {formatCustomRangeText(customRange)}
                </p>
              </div>
            </div>
          )}

          {/* Selector de Modo (Día, Rango, Mes, Año) */}
          <div className="flex w-full gap-1.5 p-1 bg-black/30 rounded-xl border border-pink-600/10">
            {[
              { id: "day", label: "Día" },
              { id: "range", label: "Rango" },
              { id: "month", label: "Mes" },
              { id: "year", label: "Año" },
            ].map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => {
                  setCalendarMode(m.id as any);
                  onCustomRangeChange({});
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  calendarMode === m.id
                    ? "bg-pink-600 text-white shadow-md shadow-pink-600/30"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Calendario Estilizado */}
          <div className="custom-calendar-container p-2 rounded-xl bg-black/20 border border-pink-600/10">
            <Calendar
              selectRange={calendarMode === "range"}
              view={
                calendarMode === "month"
                  ? "year"
                  : calendarMode === "year"
                  ? "decade"
                  : "month"
              }
              onClickDay={(date) => {
                if (calendarMode === "day") {
                  const dateStr = `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                  ).padStart(2, "0")}-${String(date.getDate()).padStart(
                    2,
                    "0"
                  )}`;

                  onCustomRangeChange({
                    from: dateStr,
                    to: dateStr,
                    selectionMode: "day",
                  });
                }
              }}
              onChange={(value: any) => {
                if (calendarMode === "range" && Array.isArray(value)) {
                  const fromStr = `${value[0].getFullYear()}-${String(
                    value[0].getMonth() + 1
                  ).padStart(2, "0")}-${String(value[0].getDate()).padStart(
                    2,
                    "0"
                  )}`;

                  const toStr = `${value[1].getFullYear()}-${String(
                    value[1].getMonth() + 1
                  ).padStart(2, "0")}-${String(value[1].getDate()).padStart(
                    2,
                    "0"
                  )}`;

                  onCustomRangeChange({
                    from: fromStr,
                    to: toStr,
                    selectionMode: "range",
                  });
                }
              }}
              onClickMonth={(date) => {
                if (calendarMode === "month") {
                  const year = date.getFullYear();
                  const month = date.getMonth();
                  const start = new Date(year, month, 1);
                  const end = new Date(year, month + 1, 0);

                  const fromStr = `${start.getFullYear()}-${String(
                    start.getMonth() + 1
                  ).padStart(2, "0")}-01`;
                  const toStr = `${end.getFullYear()}-${String(
                    end.getMonth() + 1
                  ).padStart(2, "0")}-${String(end.getDate()).padStart(
                    2,
                    "0"
                  )}`;

                  onCustomRangeChange({
                    from: fromStr,
                    to: toStr,
                    selectionMode: "month",
                  });
                }
              }}
              onClickYear={(date) => {
                if (calendarMode === "year") {
                  const year = date.getFullYear();
                  onCustomRangeChange({
                    from: `${year}-01-01`,
                    to: `${year}-12-31`,
                    selectionMode: "year",
                  });
                }
              }}
            />
          </div>

          {/* Botón Aplicar */}
          <button
            type="button"
            disabled={!customRange.from}
            onClick={() => {
              if (customRange.from && customRange.to) {
                onRangeTypeChange("custom");
                setShowCalendar(false);
              }
            }}
            className="w-full inline-flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-semibold text-xs transition-all shadow-md shadow-pink-600/30"
          >
            <FiCheck className="text-base" />
            <span>Aplicar selección</span>
          </button>
        </div>
      )}
    </div>
  );
}