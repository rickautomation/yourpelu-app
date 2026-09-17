// src/app/workspace/commercial/basic-services/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { useBasicServices, BillingPeriod } from "@/app/hooks/useBasicServices";
import { FiPlusCircle, FiTrash2, FiZap, FiSettings, FiFileText, FiClock } from "react-icons/fi";

const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined || amount === null) return "$ 0";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function BasicServicesManagementPage() {
  const { activeEstablishment } = useEstablishment();
  const {
    baseServices,
    bills,
    loading,
    error,
    fetchBaseServices,
    fetchBills,
    createBaseService,
    createBill,
    deleteBaseService,
    deleteBill,
  } = useBasicServices();

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedServiceForHistory, setSelectedServiceForHistory] = useState<string | null>(null);

  // Estados para Crear Servicio Base (Ahora con name y provider)
  const [serviceName, setServiceName] = useState("");
  const [serviceProvider, setServiceProvider] = useState("");
  const [serviceCategory, setServiceCategory] = useState("Luz");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceBillingPeriod, setServiceBillingPeriod] = useState<BillingPeriod>(BillingPeriod.MONTHLY);

  // Estados para Registrar Factura / Pago (Incluyendo name del período, ej: "Agosto")
  const [selectedBaseServiceId, setSelectedBaseServiceId] = useState("");
  const [billName, setBillName] = useState("");
  const [price, setPrice] = useState("");
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [billDescription, setBillDescription] = useState("");

  useEffect(() => {
    if (activeEstablishment?.id) {
      fetchBaseServices(activeEstablishment.id);
      fetchBills(activeEstablishment.id);
    }
  }, [activeEstablishment?.id, fetchBaseServices, fetchBills]);

  const handleCreateServiceBase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEstablishment?.id || !serviceName || !serviceProvider) return;

    const success = await createBaseService({
      name: serviceName,
      provider: serviceProvider,
      category: serviceCategory,
      description: serviceDescription,
      billingPeriod: serviceBillingPeriod,
      establishmentId: activeEstablishment.id,
    });

    if (success) {
      setIsServiceModalOpen(false);
      setServiceName("");
      setServiceProvider("");
      setServiceDescription("");
      setServiceBillingPeriod(BillingPeriod.MONTHLY);
      fetchBaseServices(activeEstablishment.id);
    }
  };

  const handleCreateBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBaseServiceId || !billName || !price) return;

    const success = await createBill({
      baseServiceId: selectedBaseServiceId,
      name: billName,
      price: Number(price),
      serviceDate,
      description: billDescription,
      isPaid: true,
    });

    if (success) {
      setIsBillModalOpen(false);
      setBillName("");
      setPrice("");
      setBillDescription("");
      if (activeEstablishment?.id) {
        fetchBills(activeEstablishment.id);
      }
    }
  };

  const handleDeleteBase = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este servicio base y sus registros asociados?") && activeEstablishment?.id) {
      const success = await deleteBaseService(id);
      if (success) {
        fetchBaseServices(activeEstablishment.id);
        fetchBills(activeEstablishment.id);
      }
    }
  };

  const handleDeleteBill = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta factura?") && activeEstablishment?.id) {
      const success = await deleteBill(id);
      if (success) {
        fetchBills(activeEstablishment.id);
      }
    }
  };

  const openBillModalForService = (baseServiceId: string) => {
    setSelectedBaseServiceId(baseServiceId);
    setIsBillModalOpen(true);
  };

  const openHistoryModal = (baseServiceId: string) => {
    setSelectedServiceForHistory(baseServiceId);
    setIsHistoryModalOpen(true);
  };

  const hasBaseServices = baseServices && baseServices.length > 0;
  const currentServiceHistory = bills.filter(b => b.baseServiceId === selectedServiceForHistory);
  const selectedServiceDetails = baseServices.find(s => s.id === selectedServiceForHistory);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Gestión de Servicios Básicos</h1>
          <p className="text-sm text-gray-400">Administra tus servicios base y lleva el control del historial de facturas o pagos.</p>
        </div>
        <div className="flex items-center justify-end w-full gap-3">
          <button
            onClick={() => setIsServiceModalOpen(true)}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg transition-all duration-200"
          >
            <FiPlusCircle className="w-5 h-5" />
            <span>Crear Servicio</span>
          </button>
        </div>
      </div>

      {/* Catálogo de Servicios Base */}
      <div className="">
        {loading ? (
          <div className="p-8 text-center text-gray-400 animate-pulse">Cargando servicios...</div>
        ) : error ? (
          <div className="p-4 text-red-400 text-center">{error}</div>
        ) : !hasBaseServices ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-gray-800/50 rounded-full text-gray-400 border border-white/5">
              <FiSettings className="w-6 h-6 text-pink-500" />
            </div>
            <h3 className="text-white font-medium">No hay servicios configurados</h3>
            <p className="text-sm text-gray-400 max-w-sm">
              Crea un servicio (ej: LUZ con proveedor EDEMSA) para empezar a registrar sus facturas.
            </p>
            <button
              onClick={() => setIsServiceModalOpen(true)}
              className="mt-2 text-sm bg-pink-600 hover:bg-pink-500 text-white font-medium px-4 py-2 rounded-xl transition-all"
            >
              Crear primer servicio
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {baseServices.map((service) => {
              const serviceBillsCount = bills.filter(b => b.baseServiceId === service.id).length;
              return (
                <div key={service.id} className="p-4 bg-luminiBrandBlue rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-white/2 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
                      <FiZap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        {service.name} <span className="text-xs font-normal text-gray-400">({service.provider})</span>
                      </h4>
                      <p className="text-xs text-gray-400">
                        Categoría: <span className="text-gray-300">{service.category || "General"}</span> | Período: <span className="uppercase text-gray-300">{service.billingPeriod}</span>
                      </p>
                      {service.description && <p className="text-xs text-gray-500 mt-0.5">{service.description}</p>}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
                    <button
                      onClick={() => openHistoryModal(service.id)}
                      className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                      <FiClock className="w-3.5 h-3.5 text-pink-400" />
                      <span>Historial ({serviceBillsCount})</span>
                    </button>
                    
                    <button
                      onClick={() => openBillModalForService(service.id)}
                      className="flex items-center gap-1.5 bg-pink-600/20 hover:bg-pink-600/30 text-pink-400 border border-pink-500/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                      <FiPlusCircle className="w-3.5 h-3.5" />
                      <span>Registrar Pago</span>
                    </button>

                    <button
                      onClick={() => handleDeleteBase(service.id)}
                      className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Eliminar servicio"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal para Crear Servicio Base */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-luminiBrandBlue border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Crear Nuevo Servicio Base</h3>
            
            <form onSubmit={handleCreateServiceBase} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Nombre de Referencia</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: LUZ, Alquiler, Internet"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Proveedor / Empresa</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: EDEMSA, Inmobiliaria XYZ"
                  value={serviceProvider}
                  onChange={(e) => setServiceProvider(e.target.value)}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Categoría</label>
                  <select
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="Luz">Luz</option>
                    <option value="Agua">Agua</option>
                    <option value="Gas">Gas</option>
                    <option value="Internet">Internet</option>
                    <option value="Alquiler">Alquiler</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Período de Cobro</label>
                  <select
                    value={serviceBillingPeriod}
                    onChange={(e) => setServiceBillingPeriod(e.target.value as BillingPeriod)}
                    className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value={BillingPeriod.MONTHLY}>Mensual</option>
                    <option value={BillingPeriod.BIMONTHLY}>Bimestral</option>
                    <option value={BillingPeriod.WEEKLY}>Semanal</option>
                    <option value={BillingPeriod.ANNUAL}>Anual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Descripción (Opcional)</label>
                <textarea
                  rows={2}
                  placeholder="Número de cliente o detalles..."
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  Guardar Servicio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Registrar Factura / Pago */}
      {isBillModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-luminiBrandBlue border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Registrar Factura o Pago</h3>
            
            <form onSubmit={handleCreateBill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Servicio Base</label>
                <select
                  value={selectedBaseServiceId}
                  onChange={(e) => setSelectedBaseServiceId(e.target.value)}
                  required
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="">Selecciona un servicio</option>
                  {baseServices.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} - {s.provider} ({s.billingPeriod})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Nombre del Período / Etiqueta</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Agosto, Julio/Agosto, Año 2017"
                  value={billName}
                  onChange={(e) => setBillName(e.target.value)}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Monto a Pagar ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="Ej: 45000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Fecha de Factura</label>
                <input
                  type="date"
                  required
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Observaciones (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: Notas adicionales..."
                  value={billDescription}
                  onChange={(e) => setBillDescription(e.target.value)}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBillModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  Guardar Pago
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Historial Específico del Servicio */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-luminiBrandBlue border border-white/10 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Historial de Pagos</h3>
                <p className="text-xs text-gray-400">
                  Servicio: <span className="text-white font-medium">{selectedServiceDetails?.name}</span> ({selectedServiceDetails?.provider})
                </p>
              </div>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="text-gray-400 hover:text-white text-sm bg-white/5 hover:bg-white/10 px-3 py-1 rounded-lg"
              >
                Cerrar
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-3 pr-1">
              {currentServiceHistory.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <FiFileText className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p>No hay pagos registrados para este servicio todavía.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {currentServiceHistory.map((bill) => (
                    <div key={bill.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                          <FiFileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {bill.name} - <span className="text-emerald-400">{formatCurrency(bill.price)}</span>
                          </p>
                          <p className="text-xs text-gray-400">Fecha: {bill.serviceDate}</p>
                          {bill.description && <p className="text-xs text-gray-500">{bill.description}</p>}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteBill(bill.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Eliminar factura"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}