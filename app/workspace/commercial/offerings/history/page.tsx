"use client";

import { useState, useMemo, useEffect } from "react";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { useOfferingsCrud } from "@/app/hooks/useOfferingsCrud";
import DateRangePicker, {
  DateRange,
} from "@/app/workspace/components/DateRangePicker";
import { FiCalendar, FiTrash2, FiUser, FiTag, FiFolder, FiAlertTriangle } from "react-icons/fi";

const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined || amount === null) return "$ 0";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function OfferingsHistoryPage() {
  const { activeEstablishment } = useEstablishment();
  const { offerings, loading, error, fetchOfferings, deleteOffering } =
    useOfferingsCrud();

  // Estados del DateRangePicker
  const [rangeType, setRangeType] = useState<
    "day" | "week" | "month" | "year" | "custom" | "all"
  >("month");
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [customRange, setCustomRange] = useState<DateRange>({});

  // Estados para el Modal de Confirmación de Borrado
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [offeringToDelete, setOfferingToDelete] = useState<string | null>(null);

  // Cálculo dinámico de fechas ISO
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

  // Recargar al cambiar establecimiento o fechas
  useEffect(() => {
    if (activeEstablishment?.id) {
      fetchOfferings(activeEstablishment.id, startDate, endDate);
    }
  }, [activeEstablishment?.id, startDate, endDate]);

  const openDeleteModal = (id: string) => {
    setOfferingToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (offeringToDelete) {
      await deleteOffering(offeringToDelete);
      setIsDeleteModalOpen(false);
      setOfferingToDelete(null);
      // Volvemos a refrescar la lista por seguridad
      if (activeEstablishment?.id) {
        fetchOfferings(activeEstablishment.id, startDate, endDate);
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Historial de Servicios
          </h1>
          <p className="text-sm text-gray-400">
            Filtrá y revisá los registros por rango de fecha
          </p>
        </div>

        {/* Selector de Rango Reutilizable */}
        <DateRangePicker
          rangeType={rangeType as any}
          onRangeTypeChange={(type) => setRangeType(type as any)}
          customRange={customRange}
          onCustomRangeChange={setCustomRange}
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
        />
      </div>

      {/* Contenido cuando no está el calendario desplegado */}
      {!showCalendar && (
        <div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-rose-400 text-center py-8 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              Error al cargar los registros: {error.message}
            </div>
          ) : offerings.length === 0 ? (
            <div className="text-center py-12 text-gray-400 space-y-2 bg-luminiBrandBlue/50 border border-white/10 rounded-2xl">
              <FiCalendar className="mx-auto text-3xl opacity-40" />
              <p>No se encontraron registros para este período.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {offerings.map((off) => (
                <div
                  key={off.id}
                  className="bg-luminiBrandBlue/50 border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-white/20 transition-all"
                >
                  {/* Cabecera de la tarjeta: Fecha y Botón Borrar */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <span className="text-xs font-medium text-gray-400">
                      {off.createdAt
                        ? new Date(off.createdAt).toLocaleDateString("es-AR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Fecha no disponible"}
                    </span>
                    <button
                      onClick={() => openDeleteModal(off.id)}
                      className="border border-white/10 p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Eliminar registro"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Cuerpo de la tarjeta: Detalles */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-200">
                      <FiUser className="text-gray-400 shrink-0" />
                      <span className="font-medium truncate">
                        {off.client
                          ? `${off.client.name} ${off.client.lastname}`
                          : "Cliente"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-cyan-300">
                      <FiTag className="text-cyan-400 shrink-0" />
                      <span className="truncate">
                        {off.clientOfferingType?.name || "Servicio sin tipo"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-300">
                      <FiFolder className="text-gray-400 shrink-0" />
                      <span className="truncate">
                        {off.clientOfferingCategory?.name || "Sin categoría"}
                      </span>
                    </div>
                  </div>

                  {/* Pie de la tarjeta: Precio */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                      Total
                    </span>
                    <span className="text-xl font-bold text-emerald-400 tracking-tight">
                      {formatCurrency(off.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* POPUP MODAL DE CONFIRMACIÓN */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[#131b2e] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
                <FiAlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Eliminar registro</h3>
            </div>
            
            <p className="text-sm text-gray-300">
              ¿Estás seguro de que deseas eliminar este servicio del historial? Esta acción no se puede deshacer.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 transition-colors border border-white/10"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-rose-600 text-white hover:bg-rose-500 transition-colors shadow-lg shadow-rose-600/20"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}