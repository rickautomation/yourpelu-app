"use client";

import { useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import RangeSelector from "./RangeSelector";

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
    type: "day" | "week" | "month" | "year" | "custom",
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

  // Formatea únicamente un objeto DateRange explícito (el del calendario)
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

  // Determina la etiqueta visible del botón selector
  const selectedRange = useMemo(() => {
    // Si la opción elegida es "custom", mostramos el texto formateado si existe
    if (rangeType === "custom") {
      const formatted = formatCustomRangeText(customRange);
      if (formatted) {
        return {
          id: "custom",
          label: formatted,
        };
      }
    }

    // Para los accesos directos ("day", "week", "month", "year"), mostramos su nombre literal
    return (
      RANGES.find((r) => r.id === rangeType) || {
        id: "custom",
        label: "Personalizado",
      }
    );
  }, [rangeType, customRange, calendarMode]);

  return (
    <div>
      <RangeSelector
        ranges={RANGES}
        selectedRange={selectedRange}
        onRangeChange={(id) => onRangeTypeChange(id as any)}
        showCalendar={showCalendar}
        setShowCalendar={setShowCalendar}
      />

      {showCalendar && (
        <div className="mt-4">
          {formatCustomRangeText(customRange) && (
            <h2 className="text-xl font-bold mb-3 text-pink-400">
              Selección actual: {formatCustomRangeText(customRange)}
            </h2>
          )}

          <div className="flex w-full gap-2 mb-4">
            {[
              { id: "day", label: "Día" },
              { id: "range", label: "Rango" },
              { id: "month", label: "Mes" },
              { id: "year", label: "Año" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setCalendarMode(m.id as any);
                  onCustomRangeChange({});
                }}
                className={`flex-1 px-3 py-2 rounded text-center ${
                  calendarMode === m.id ? "bg-pink-600" : "bg-luminiBrandBlue"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="text-black">
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
                    date.getMonth() + 1,
                  ).padStart(
                    2,
                    "0",
                  )}-${String(date.getDate()).padStart(2, "0")}`;

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
                    value[0].getMonth() + 1,
                  ).padStart(
                    2,
                    "0",
                  )}-${String(value[0].getDate()).padStart(2, "0")}`;

                  const toStr = `${value[1].getFullYear()}-${String(
                    value[1].getMonth() + 1,
                  ).padStart(
                    2,
                    "0",
                  )}-${String(value[1].getDate()).padStart(2, "0")}`;

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
                    start.getMonth() + 1,
                  ).padStart(2, "0")}-01`;
                  const toStr = `${end.getFullYear()}-${String(
                    end.getMonth() + 1,
                  ).padStart(
                    2,
                    "0",
                  )}-${String(end.getDate()).padStart(2, "0")}`;

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

          <button
            onClick={() => {
              if (customRange.from && customRange.to) {
                onRangeTypeChange("custom");
                setShowCalendar(false);
              }
            }}
            className="mt-4 bg-blue-600 px-4 py-2 rounded text-white"
          >
            Aplicar selección
          </button>
        </div>
      )}
    </div>
  );
}