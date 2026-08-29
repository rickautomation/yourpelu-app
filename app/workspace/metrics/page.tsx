"use client";

import { useEstablishment } from "@/app/context/EstablishmentContext";
import { useEstablishmentMetrics } from "@/app/hooks/useEstablishmentMetrics";
import { useState, useMemo } from "react";
import DateRangePicker, { DateRange } from "../components/DateRangePicker";
import {
  FaUsers,
  FaChartBar,
  FaWallet,
  FaFilter,
  FaStore,
  FaUserTie,
} from "react-icons/fa";

type FilterCategory =
  | "services"
  | "categories"
  | "payments"
  | "clients"
  | "staff";

export default function EstablishmentMetricsPage() {
  const { activeEstablishment } = useEstablishment();
  const establishmentId = activeEstablishment?.id;

  const [rangeType, setRangeType] = useState<
    "day" | "week" | "month" | "year" | "custom"
  >("month");
  const [customRange, setCustomRange] = useState<DateRange>({});
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("services");

  // Cálculo de fechas consistente
  const { startDate, endDate } = useMemo(() => {
    const today = new Date();
    let from: string | undefined;
    let to: string | undefined;

    if (rangeType === "day") {
      from = today.toISOString().split("T")[0];
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

    if (from && to && from === to) {
      from = `${from}T00:00:00.000Z`;
      to = `${to}T23:59:59.999Z`;
    }

    return { startDate: from, endDate: to };
  }, [rangeType, customRange]);

  const { metrics, loading, error, refetch } = useEstablishmentMetrics({
    establishmentId: establishmentId ?? "",
    startDate,
    endDate,
  });

  if (!establishmentId) {
    return (
      <div className="rounded-xl border border-pink-600/30 p-8 text-center text-gray-300 min-h-[50vh] flex flex-col items-center justify-center max-w-lg mx-auto my-12 bg-gray-900/40">
        <FaStore className="text-4xl text-pink-500 mb-3" />
        <p className="font-semibold text-lg text-white">
          Sin establecimiento seleccionado
        </p>
        <p className="text-sm opacity-80 mt-1">
          Por favor, selecciona un local en el menú principal para visualizar
          sus métricas generales.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-pink-600/30 p-6 text-center text-pink-400 min-h-[50vh] flex flex-col items-center justify-center max-w-lg mx-auto">
        <p className="font-semibold text-lg">
          Error al cargar métricas del local
        </p>
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
    <div className="space-y-5 p-6 text-white max-w-5xl mx-auto">
      {/* Selector de Rango de Fechas */}
      <div className="max-w-xl">
        <DateRangePicker
          rangeType={rangeType}
          onRangeTypeChange={(type) => setRangeType(type)}
          customRange={customRange}
          onCustomRangeChange={setCustomRange}
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
        />
      </div>

      {!showCalendar && (
        <>
          {/* Navegación por Pestañas */}
          <div className="flex items-center gap-2 border-b border-pink-600/20 pb-3 overflow-x-auto">
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
              onClick={() => setActiveFilter("staff")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition shrink-0 ${
                activeFilter === "staff"
                  ? "bg-pink-600 text-white shadow-lg shadow-pink-600/30"
                  : "bg-gray-900/40 border border-pink-600/20 text-gray-300 hover:bg-gray-800"
              }`}
            >
              Equipo / Staff
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
              Clientes Frecuentes
            </button>
          </div>

          {/* Renderizado de Bloques de Métricas */}
          <div className="w-full">
            {activeFilter === "services" && (
              <div className="">
                <h2 className="mb-2 text-md font-semibold text-white flex items-center gap-1.5">
                  <FaChartBar className="text-pink-500" /> Más solicitados
                </h2>
                <div className="space-y-2">
                  {metrics?.topServices?.length ? (
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
                            <p className="font-semibold text-white">
                              {service.serviceName}
                            </p>
                            <p className="text-xs text-gray-400 font-light mt-0.5">
                              Facturado: $
                              {service.totalRevenue.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-center bg-pink-600/20 border border-pink-500/30 text-pink-300 px-2 py-1.5 rounded-2xl ">
                          <span className="font-bold text-lg sm:text-sm">
                            {service.count}
                          </span>
                          <span className="text-[10px]">veces</span>
                        </div>
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
              <div className="rounded-2xl border border-pink-600/40 bg-luminiBrandBlue p-4 shadow-xl">
                <h2 className="mb-5 text-lg font-semibold text-white flex items-center gap-2">
                  <FaChartBar className="text-pink-500" /> Categorías mas
                  demandadas
                </h2>
                <div className="space-y-3">
                  {metrics?.topCategories?.length ? (
                    metrics.topCategories.map((cat, index) => (
                      <div
                        key={cat.categoryId}
                        className="flex items-center justify-between rounded-xl bg-gray-900/40 border border-pink-600/20 p-4 text-base"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-bold text-pink-400 bg-pink-950/50 px-3 py-1.5 rounded-lg">
                            #{index + 1}
                          </span>
                          <div>
                            <p className="font-semibold text-white">
                              {cat.categoryName}
                            </p>
                            <p className="text-xs text-gray-400 font-light mt-0.5">
                              Facturado: ${cat.totalRevenue.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-center bg-pink-600/20 border border-pink-500/30 text-pink-300 px-2 py-1.5 rounded-2xl ">
                          <span className="font-bold text-lg sm:text-sm">
                            {cat.count}
                          </span>
                          <span className="text-[10px]">servicios</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 py-4 text-center">
                      No hay registros de categorías en este periodo.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* SECCIÓN NUEVA: Desempeño del Staff */}
            {activeFilter === "staff" && (
              <div className="rounded-2xl border border-pink-600/40 bg-luminiBrandBlue p-4 shadow-xl">
                <h2 className="mb-5 text-lg font-semibold text-white flex items-center gap-2">
                  <FaUserTie className="text-pink-500" /> Desempeño del Equipo
                </h2>
                <div className="space-y-3">
                  {metrics?.staffMetrics?.length ? (
                    metrics.staffMetrics.map((staff, index) => (
                      <div
                        key={staff.userId}
                        className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl bg-gray-900/40 border border-pink-600/20 p-4 gap-4"
                      >
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-sm font-bold text-pink-400 bg-pink-950/50 px-3 py-1.5 rounded-lg shrink-0">
                            #{index + 1}
                          </span>
                          <div>
                            <p className="font-semibold text-white">
                              {staff.userName}
                            </p>
                            <div className="flex flex-col gap-x-4 gap-y-1 text-xs text-gray-400 font-light mt-0.5">
                              <span>
                                Prom.: ${staff.averageTicket.toLocaleString()}
                              </span>
                              <span>
                                Total: ${staff.totalRevenue.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-center bg-pink-600/20 border border-pink-500/30 text-pink-300 px-3 py-1.5 rounded-2xl">
                            <span className="font-bold text-lg">
                              {staff.servicesCount}
                            </span>
                            <span className="text-[10px]">servicios</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 py-4 text-center">
                      No hay registros de desempeño de profesionales en este
                      periodo.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeFilter === "payments" && (
              <div className="rounded-2xl border border-pink-600/40 bg-luminiBrandBlue p-4 shadow-xl">
                <h2 className="mb-5 text-lg font-semibold text-white flex items-center gap-2">
                  <FaWallet className="text-pink-500" /> Métodos de Pago
                </h2>
                <div className="space-y-3">
                  {metrics?.paymentMethodsBreakdown?.length ? (
                    metrics.paymentMethodsBreakdown.map((pm) => (
                      <div
                        key={pm.paymentMethodId}
                        className="flex items-center justify-between rounded-xl bg-gray-900/40 border border-pink-600/20 p-4 text-base"
                      >
                        <div>
                          <p className="font-semibold text-white">
                            {pm.paymentMethodName}
                          </p>
                          <p className="text-xs text-gray-400 font-light mt-0.5">
                            Total procesado: ${pm.totalAmount.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-col items-center bg-pink-600/20 border border-pink-500/30 text-pink-300 px-2 py-1.5 rounded-2xl ">
                          <span className="font-bold text-lg sm:text-sm">
                            {pm.count}
                          </span>
                          <span className="text-xs">transacciones</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 py-4 text-center">
                      No hay registros de cobros en este periodo.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeFilter === "clients" && (
              <div className="rounded-2xl border border-pink-600/40 bg-luminiBrandBlue p-6 shadow-xl">
                <h2 className="mb-5 text-xl font-semibold text-white flex items-center gap-2">
                  <FaUsers className="text-pink-500" /> Clientes con Mayor
                  Frecuencia en el Local
                </h2>
                <div className="space-y-3">
                  {metrics?.topClients?.length ? (
                    metrics.topClients.map((client) => (
                      <div
                        key={client.clientId}
                        className="flex items-center justify-between rounded-xl bg-gray-900/40 border border-pink-600/20 p-4 text-base"
                      >
                        <div>
                          <p className="font-semibold text-white">
                            {client.clientName}
                          </p>
                          <p className="text-xs text-gray-400 font-light mt-0.5">
                            Facturación acumulada: $
                            {client.totalSpent.toLocaleString()}
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
                      No hay registros de visitas de clientes en este periodo.
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
