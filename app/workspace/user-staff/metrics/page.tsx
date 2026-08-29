"use client";

import { useEstablishment } from "@/app/context/EstablishmentContext";
import { useAuth } from "@/app/hooks/useAuth";
import { useUserMetrics } from "@/app/hooks/useUserMetrics";
import { useState, useMemo } from "react";
import DateRangePicker, { DateRange } from "../../components/DateRangePicker";
import { FaUsers, FaChartBar, FaWallet, FaFilter } from "react-icons/fa";

type FilterCategory = "services" | "categories" | "payments" | "clients";

export default function MetricsPage() {
  const { activeEstablishment } = useEstablishment();
  const { user } = useAuth();
  const userId = user?.id ?? "";
  const establishmentId = activeEstablishment?.id;

  const [rangeType, setRangeType] = useState<
    "day" | "week" | "month" | "year" | "custom"
  >("month");
  const [customRange, setCustomRange] = useState<DateRange>({});
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("services");

  // Cálculo de fechas unificado y estandarizado a ISO Timestamps completos
  const { startDate, endDate } = useMemo(() => {
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

    // Garantizar abarcar desde el inicio del primer día hasta el fin del último día
    if (fFrom && fTo) {
      fFrom = `${fFrom}T00:00:00.000Z`;
      fTo = `${fTo}T23:59:59.999Z`;
    }

    return { startDate: fFrom, endDate: fTo };
  }, [rangeType, customRange]);

  const { metrics, loading, error, refetch } = useUserMetrics({
    userId,
    establishmentId,
    startDate,
    endDate,
  });

  const handleCustomRangeChange = (newRange: DateRange) => {
    setCustomRange(newRange);
    setRangeType("custom");
  };

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-pink-600/30 p-6 text-center text-pink-400 min-h-screen flex flex-col items-center justify-center">
        <p className="font-semibold text-lg">Error al cargar métricas operativas</p>
        <p className="text-sm opacity-80 mt-1">{error}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700 transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 text-white max-w-5xl mx-auto">
      {/* Selector e Integración del Calendario */}
      <div className="max-w-xl">
        <DateRangePicker
          rangeType={rangeType}
          onRangeTypeChange={(type) => setRangeType(type)}
          customRange={customRange}
          onCustomRangeChange={handleCustomRangeChange}
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
        />
      </div>

      {/* Si el calendario está abierto, se ocultan etiquetas y datos */}
      {!showCalendar && (
        <>
          {/* Pestañas de Vista */}
          <div className="flex items-center gap-2 border-b border-pink-600/20 pb-4 overflow-x-auto">
            <span className="text-xs text-gray-400 flex items-center gap-1.5 mr-2 shrink-0">
              <FaFilter className="text-pink-500" /> Vista:
            </span>

            <button
              onClick={() => setActiveFilter("services")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition shrink-0 ${
                activeFilter === "services"
                  ? "bg-pink-600 text-white shadow-lg shadow-pink-600/30"
                  : "bg-gray-900/40 border border-pink-600/20 text-gray-300 hover:bg-gray-800"
              }`}
            >
              Servicios
            </button>

            <button
              onClick={() => setActiveFilter("categories")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition shrink-0 ${
                activeFilter === "categories"
                  ? "bg-pink-600 text-white shadow-lg shadow-pink-600/30"
                  : "bg-gray-900/40 border border-pink-600/20 text-gray-300 hover:bg-gray-800"
              }`}
            >
              Categorías
            </button>

            <button
              onClick={() => setActiveFilter("payments")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition shrink-0 ${
                activeFilter === "payments"
                  ? "bg-pink-600 text-white shadow-lg shadow-pink-600/30"
                  : "bg-gray-900/40 border border-pink-600/20 text-gray-300 hover:bg-gray-800"
              }`}
            >
              Métodos de Pago
            </button>

            <button
              onClick={() => setActiveFilter("clients")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition shrink-0 ${
                activeFilter === "clients"
                  ? "bg-pink-600 text-white shadow-lg shadow-pink-600/30"
                  : "bg-gray-900/40 border border-pink-600/20 text-gray-300 hover:bg-gray-800"
              }`}
            >
              Clientes
            </button>
          </div>

          {/* Renderizado de Métricas */}
          <div className="w-full">
            {activeFilter === "services" && (
              <div>
                <h2 className="mb-5 text-lg font-semibold text-white flex items-center gap-2">
                  <FaChartBar className="text-pink-500" /> Servicios Más Realizados
                </h2>
                <div className="space-y-3">
                  {metrics?.topServices.length ? (
                    metrics.topServices.map((service, index) => (
                      <div
                        key={service.serviceId}
                        className="flex items-center justify-between rounded-xl bg-luminiBrandBlue border border-pink-600/20 p-4 text-base"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-bold text-pink-400 bg-pink-950/50 px-3 py-1.5 rounded-lg">
                            #{index + 1}
                          </span>
                          <div>
                            <p className="font-semibold text-white">{service.serviceName}</p>
                            <p className="text-xs text-gray-400 font-light mt-0.5">
                              Generado: ${service.totalRevenue.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold bg-pink-600/20 border border-pink-500/30 text-pink-300 px-4 py-1.5 rounded-full text-xs sm:text-sm">
                          {service.count} veces
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 py-4 text-center">
                      No hay registros de servicios en este periodo.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeFilter === "categories" && (
              <div>
                <h2 className="mb-5 text-lg font-semibold text-white flex items-center gap-2">
                  <FaChartBar className="text-pink-500" /> Categorías con Mayor Demanda
                </h2>
                <div className="space-y-3">
                  {metrics?.topCategories?.length ? (
                    metrics.topCategories.map((cat, index) => (
                      <div
                        key={cat.categoryId}
                        className="flex items-center justify-between rounded-xl bg-luminiBrandBlue border border-pink-600/20 p-4 text-base"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-bold text-pink-400 bg-pink-950/50 px-3 py-1.5 rounded-lg">
                            #{index + 1}
                          </span>
                          <div>
                            <p className="font-semibold text-white">{cat.categoryName}</p>
                            <p className="text-xs text-gray-400 font-light mt-0.5">
                              Generado: ${cat.totalRevenue.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold bg-pink-600/20 border border-pink-500/30 text-pink-300 px-4 py-1.5 rounded-full text-xs sm:text-sm">
                          {cat.count} servicios
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 py-4 text-center">
                      No hay registros en este periodo.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeFilter === "payments" && (
              <div>
                <h2 className="mb-5 text-lg font-semibold text-white flex items-center gap-2">
                  <FaWallet className="text-pink-500" /> Métodos de Pago más Utilizados
                </h2>
                <div className="space-y-3">
                  {metrics?.paymentMethodsBreakdown.length ? (
                    metrics.paymentMethodsBreakdown.map((pm) => (
                      <div
                        key={pm.paymentMethodId}
                        className="flex items-center justify-between rounded-xl bg-luminiBrandBlue border border-pink-600/20 p-4 text-base"
                      >
                        <div>
                          <p className="font-semibold text-white">{pm.paymentMethodName}</p>
                          <p className="text-xs text-gray-400 font-light mt-0.5">
                            Total: ${pm.totalAmount.toLocaleString()}
                          </p>
                        </div>
                        <span className="font-bold bg-gray-800 px-4 py-1.5 rounded-full text-xs sm:text-sm text-gray-300">
                          {pm.count} cobros
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 py-4 text-center">
                      No hay registros de cobro en este periodo.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeFilter === "clients" && (
              <div>
                <h2 className="mb-5 text-xl font-semibold text-white flex items-center gap-2">
                  <FaUsers className="text-pink-500" /> Clientes Más Recurrentes
                </h2>
                <div className="space-y-3">
                  {metrics?.topClients.length ? (
                    metrics.topClients.map((client) => (
                      <div
                        key={client.clientId}
                        className="flex items-center justify-between rounded-xl bg-luminiBrandBlue border border-pink-600/20 p-4 text-base"
                      >
                        <div>
                          <p className="font-semibold text-white">{client.clientName}</p>
                          <p className="text-xs text-gray-400 font-light mt-0.5">
                            Inversión: ${client.totalSpent.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-pink-600/20 border border-pink-500/30 px-4 py-1.5 rounded-lg text-center">
                          <span className="text-xs sm:text-sm font-bold text-pink-400">
                            {client.visitCount} visitas
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 py-4 text-center">
                      No hay registros de clientes en este periodo.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}