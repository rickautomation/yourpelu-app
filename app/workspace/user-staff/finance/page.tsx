"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useUserFinances } from "@/app/hooks/useUserFinances";
import RangeSelector from "../../components/RangeSelector";

const ranges = [
  { id: "day", label: "Hoy" },
  { id: "week", label: "Semana" },
  { id: "month", label: "Mes" },
  { id: "year", label: "Año" },
  { id: "custom", label: "Personalizado" },
];

export default function UserStaffFinancePage() {
  const [rangeType, setRangeType] = useState<
    "day" | "week" | "month" | "year" | "custom" | "range"
  >("day");

  const [showCalendar, setShowCalendar] = useState(false);

  // Guardamos también el selectionMode en customRange
  const [customRange, setCustomRange] = useState<{
    from?: string;
    to?: string;
    selectionMode?: "day" | "range" | "month" | "year";
  }>({});

  const [calendarMode, setCalendarMode] = useState<
    "day" | "range" | "month" | "year"
  >("day");

  const selectedRange = ranges.find((r) => r.id === rangeType) || {
    id: "custom",
    label: "Personalizado",
  };

  // calcular fechas para la API
  const today = new Date();
  let from: string | undefined;
  let to: string | undefined;

  if (rangeType === "day") {
    from = today.toISOString().split("T")[0];
    // Si es un solo día, aseguramos que 'to' cubra todo el día o enviamos la misma fecha
    // según responda tu backend, pero para rangos personalizados debemos mandar el rango completo
    to = from;
  } else if (rangeType === "week") {
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay());
    from = start.toISOString().split("T")[0];
    to = today.toISOString().split("T")[0];
  } else if (rangeType === "month") {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    from = start.toISOString().split("T")[0];
    to = today.toISOString().split("T")[0];
  } else if (rangeType === "year") {
    const start = new Date(today.getFullYear(), 0, 1);
    from = start.toISOString().split("T")[0];
    to = today.toISOString().split("T")[0];
  } else if (rangeType === "custom" && customRange.from && customRange.to) {
    from = customRange.from;
    to = customRange.to;
  }

  // Ajuste clave al seleccionar un único día en el calendario:
  // Si from y to son el mismo día, enviamos to con la hora 23:59:59 (o formato ISO completo)
  // para que la base de datos abarque todas las ventas del día.
  if (from && to && from === to) {
    from = `${from}T00:00:00.000Z`;
    to = `${to}T23:59:59.999Z`;
  }

  if (showCalendar && customRange.from && customRange.to) {
    from = customRange.from;
    to = customRange.to;
  }

  const { data, loading, error } = useUserFinances({
    userId: "53813921-915b-4370-8d80-f68589b03bd7",
    establishmentId: "b07c73dd-b5ec-49e9-b9ed-720a3a0d8d1b",
    from,
    to,
  });

  const parseLocalDate = (dateStr: string) => {
    const cleanStr = dateStr.split("T")[0];
    const [year, month, day] = cleanStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const renderSelectedRange = () => {
    const activeFrom = showCalendar ? customRange.from : from;
    const activeTo = showCalendar ? customRange.to : to;

    if (!activeFrom) return null;

    const fromDate = parseLocalDate(activeFrom);
    const toDate = activeTo ? parseLocalDate(activeTo) : fromDate;

    // Si viene de personalizado, usamos el modo en que se seleccionó en el calendario
    const activeMode =
      rangeType === "custom"
        ? customRange.selectionMode || (showCalendar ? calendarMode : "range")
        : showCalendar
          ? calendarMode
          : rangeType;

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
        const capitalizedMonth =
          monthName.charAt(0).toUpperCase() + monthName.slice(1);
        return `${capitalizedMonth} ${fromDate.getFullYear()}`;
      }

      case "year":
        return fromDate.getFullYear().toString();

      default:
        return `${fromDate.toLocaleDateString("es-AR")} a ${toDate.toLocaleDateString("es-AR")}`;
    }
  };

  return (
    <div className="p-6 text-white rounded-lg">
      {/* Dropdown */}
      <RangeSelector
        ranges={ranges}
        selectedRange={selectedRange}
        onRangeChange={(id) => setRangeType(id as any)}
        showCalendar={showCalendar}
        setShowCalendar={setShowCalendar}
      />

      {/* Calendario */}
      {showCalendar ? (
        <div className="mt-4">
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
                  setCustomRange({});
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
              /* DÍA */
              onClickDay={(date) => {
                if (calendarMode === "day") {
                  const dateStr = `${date.getFullYear()}-${String(
                    date.getMonth() + 1,
                  ).padStart(
                    2,
                    "0",
                  )}-${String(date.getDate()).padStart(2, "0")}`;

                  setCustomRange({
                    from: dateStr,
                    to: dateStr,
                    selectionMode: "day",
                  });
                }
              }}
              /* RANGO DE DÍAS */
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

                  setCustomRange({
                    from: fromStr,
                    to: toStr,
                    selectionMode: "range",
                  });
                }
              }}
              /* MES */
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

                  setCustomRange({
                    from: fromStr,
                    to: toStr,
                    selectionMode: "month",
                  });
                }
              }}
              /* AÑO */
              onClickYear={(date) => {
                if (calendarMode === "year") {
                  const year = date.getFullYear();
                  setCustomRange({
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
                setRangeType("custom");
                setShowCalendar(false);
              }
            }}
            className="mt-4 bg-blue-600 px-4 py-2 rounded"
          >
            Aplicar selección
          </button>
        </div>
      ) : (
        <>
          {loading && <p>Cargando...</p>}
          {error && <p className="text-red-400">Error: {error}</p>}
          {data && data.totalOfferings > 0 ? (
            <div className="space-y-2 text-xl">
              {renderSelectedRange() && (
                <h1 className="text-2xl text-center font-bold mb-4">
                  {renderSelectedRange()}
                </h1>
              )}
              <div className="p-4 rounded bg-luminiBrandBlue">
                <p>Acumulado: ${data.totalOfferings}</p>
              </div>
              <div className="flex gap-3 p-4 rounded bg-luminiBrandBlue">
                Deducción:{" "}
                {data.commissionRate !== undefined && (
                  <p>{data.commissionRate}%</p>
                )}{" "}
                <p>${data.deduction}</p>
              </div>
              <div className="p-4 rounded bg-luminiBrandBlue text-3xl text-center font-bold">
                <p>Total: ${data.finalTotal}</p>
              </div>
            </div>
          ) : (
            !loading && (
              <div className="text-center">
                {renderSelectedRange() && (
                  <h1 className="text-xl font-bold mb-4">
                    {renderSelectedRange()}
                  </h1>
                )}
                <p className="text-gray-400">No hay datos que mostrar.</p>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}
