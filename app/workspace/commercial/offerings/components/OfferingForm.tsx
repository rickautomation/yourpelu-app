"use client";

import { 
  FiCheckCircle, 
  FiChevronDown, 
  FiTag, 
  FiScissors, 
  FiCreditCard, 
  FiUser, 
  FiPlus, 
  FiSearch,
  FiX
} from "react-icons/fi";

interface OfferingFormProps {
  selectedCategory: any;
  setSelectedCategory: (cat: any) => void;
  selectedClientType: any;
  setSelectedClientType: (ct: any) => void;
  selectedPaymentMethod: any;
  setSelectedPaymentMethod: (pm: any) => void;
  selectedClient: any;
  setSelectedClient: (client: any) => void;

  clientCategories: any[];
  paymentMethods: any[];
  clients: any[];
  filteredClients: any[];

  settings: any;

  showCategoryPopup: boolean;
  setShowCategoryPopup: (val: boolean) => void;
  showClientTypePopup: boolean;
  setShowClientTypePopup: (val: boolean) => void;
  showPaymentPopup: boolean;
  setShowPaymentPopup: (val: boolean) => void;
  showClientPopup: boolean;
  setShowClientPopup: (val: boolean) => void;
  showSuccessPopup: boolean;
  showAdd: boolean;
  setShowAdd: (val: boolean) => void;

  newClientName: string;
  setNewClientName: (val: string) => void;
  newClientLastname: string;
  setNewClientLastname: (val: string) => void;

  searchTerm: string;
  setSearchTerm: (val: string) => void;

  categoryRef: React.RefObject<HTMLDivElement | null>;
  clientTypeRef: React.RefObject<HTMLDivElement | null>;
  paymentRef: React.RefObject<HTMLDivElement | null>;
  clientRef: React.RefObject<HTMLDivElement | null>;

  addClient: (client: any) => Promise<any>;
  handleSubmit: () => void;
  loading: boolean;
}

export default function OfferingForm(props: OfferingFormProps) {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedClientType,
    setSelectedClientType,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    selectedClient,
    setSelectedClient,
    clientCategories,
    paymentMethods,
    clients,
    filteredClients,
    settings,
    showCategoryPopup,
    setShowCategoryPopup,
    showClientTypePopup,
    setShowClientTypePopup,
    showPaymentPopup,
    setShowPaymentPopup,
    showClientPopup,
    setShowClientPopup,
    showSuccessPopup,
    showAdd,
    setShowAdd,
    newClientName,
    setNewClientName,
    newClientLastname,
    setNewClientLastname,
    searchTerm,
    setSearchTerm,
    categoryRef,
    clientTypeRef,
    paymentRef,
    clientRef,
    addClient,
    handleSubmit,
    loading,
  } = props;

  return (
    <div className="max-w-md mx-auto space-y-4">
      
      {/* 1. Categoría */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
          <FiTag className="text-pink-400" /> Categoría
        </label>
        <button
          type="button"
          onClick={() => setShowCategoryPopup(true)}
          className="w-full px-4 py-3 bg-luminiBrandBlue hover:bg-ligthBrandBlue text-white rounded-xl flex justify-between items-center transition-all border border-white/5 shadow-sm active:scale-[0.99]"
        >
          <span className="font-medium">
            {selectedCategory ? selectedCategory.name : "Seleccionar categoría"}
          </span>
          <FiChevronDown className="text-xl text-gray-400" />
        </button>
      </div>

      {/* Modal Categoría */}
      {showCategoryPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div
            className="bg-luminiBrandBlue border border-white/10 shadow-2xl rounded-2xl p-5 w-full max-w-sm animate-in fade-in zoom-in-95 duration-150"
            ref={categoryRef}
          >
            <h2 className="text-center text-white font-semibold text-lg mb-4">
              Elegí una categoría
            </h2>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {clientCategories?.map((cat: any) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedClientType(null);
                    setShowCategoryPopup(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium flex justify-between items-center ${
                    selectedCategory?.id === cat.id
                      ? "bg-pink-500/20 border border-pink-500/50 text-white"
                      : "bg-ligthBrandBlue/50 text-gray-200 hover:bg-ligthBrandBlue"
                  }`}
                >
                  {cat.name}
                  {selectedCategory?.id === cat.id && <FiCheckCircle className="text-pink-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Servicio (ClientType) */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
          <FiScissors className="text-pink-400" /> Servicio
        </label>
        <button
          type="button"
          disabled={!selectedCategory}
          onClick={() => setShowClientTypePopup(true)}
          className={`w-full px-4 py-3 text-white rounded-xl flex justify-between items-center transition-all border border-white/5 shadow-sm active:scale-[0.99] ${
            !selectedCategory 
              ? "bg-gray-800/40 opacity-50 cursor-not-allowed" 
              : "bg-luminiBrandBlue hover:bg-ligthBrandBlue"
          }`}
        >
          <span className="font-medium">
            {selectedClientType
              ? `${selectedClientType.name} ($${selectedClientType.price})`
              : selectedCategory
              ? "Seleccionar servicio"
              : "Primero elige una categoría"}
          </span>
          <FiChevronDown className="text-xl text-gray-400" />
        </button>
      </div>

      {/* Modal Servicio */}
      {showClientTypePopup && selectedCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div
            className="bg-luminiBrandBlue border border-white/10 shadow-2xl rounded-2xl p-5 w-full max-w-sm animate-in fade-in zoom-in-95 duration-150"
            ref={clientTypeRef}
          >
            <h2 className="text-center text-white font-semibold text-lg mb-4">
              Elegí un servicio
            </h2>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {selectedCategory.clientTypes?.map((service: any) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => {
                    setSelectedClientType(service);
                    setShowClientTypePopup(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all flex justify-between items-center ${
                    selectedClientType?.id === service.id
                      ? "bg-pink-500/20 border border-pink-500/50 text-white"
                      : "bg-ligthBrandBlue/50 text-gray-200 hover:bg-ligthBrandBlue"
                  }`}
                >
                  <span className="font-medium">{service.name}</span>
                  <span className="font-bold text-emerald-400">${service.price}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Método de Pago */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
          <FiCreditCard className="text-pink-400" /> Método de Pago
        </label>
        <button
          type="button"
          onClick={() => setShowPaymentPopup(true)}
          className="w-full px-4 py-3 bg-luminiBrandBlue hover:bg-ligthBrandBlue text-white rounded-xl flex justify-between items-center transition-all border border-white/5 shadow-sm active:scale-[0.99]"
        >
          <span className="font-medium">
            {selectedPaymentMethod ? selectedPaymentMethod.type : "Seleccionar método de pago"}
          </span>
          <FiChevronDown className="text-xl text-gray-400" />
        </button>
      </div>

      {/* Modal Método de Pago */}
      {showPaymentPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div
            className="bg-luminiBrandBlue border border-white/10 shadow-2xl rounded-2xl p-5 w-full max-w-sm animate-in fade-in zoom-in-95 duration-150"
            ref={paymentRef}
          >
            <h2 className="text-center text-white font-semibold text-lg mb-4">
              Elegí un método de pago
            </h2>
            <div className="space-y-2">
              {paymentMethods?.map((method: any) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => {
                    setSelectedPaymentMethod(method);
                    setShowPaymentPopup(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium flex justify-between items-center ${
                    selectedPaymentMethod?.id === method.id
                      ? "bg-pink-500/20 border border-pink-500/50 text-white"
                      : "bg-ligthBrandBlue/50 text-gray-200 hover:bg-ligthBrandBlue"
                  }`}
                >
                  {method.type}
                  {selectedPaymentMethod?.id === method.id && <FiCheckCircle className="text-pink-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Selección de Cliente (Opcional por configuración) */}
      {settings?.clients_in_offerings && (
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <FiUser className="text-pink-400" /> Cliente
          </label>
          <button
            type="button"
            onClick={() => setShowClientPopup(true)}
            className="w-full px-4 py-3 bg-ligthBrandBlue/80 hover:bg-ligthBrandBlue text-white rounded-xl flex justify-between items-center transition-all border border-white/5 shadow-sm active:scale-[0.99]"
          >
            <span className="font-medium">
              {selectedClient
                ? `${selectedClient.name} ${selectedClient.lastname}`
                : "Sin cliente asignado"}
            </span>
            <FiChevronDown className="text-xl text-gray-400" />
          </button>
        </div>
      )}

      {/* Modal Cliente */}
      {showClientPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div
            className="bg-gray-900 border border-pink-500/30 shadow-2xl rounded-2xl p-5 w-full max-w-sm animate-in fade-in zoom-in-95 duration-150"
            ref={clientRef}
          >
            {!showAdd && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-white font-semibold text-lg">Elegir Cliente</h2>
                  <button
                    type="button"
                    onClick={() => setShowAdd(true)}
                    className="flex items-center gap-1 bg-pink-500 hover:bg-pink-600 px-3 py-1.5 text-white text-xs font-bold rounded-lg transition-colors shadow"
                  >
                    <FiPlus /> Nuevo
                  </button>
                </div>

                <div className="relative mb-3">
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-800 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 border border-white/5"
                  />
                </div>
              </>
            )}

            {!showAdd && (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {searchTerm.length === 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedClient(null);
                      setShowClientPopup(false);
                    }}
                    className="w-full text-left px-3 py-2.5 bg-gray-800/60 hover:bg-gray-800 border border-gray-700/50 rounded-xl text-gray-400 text-sm transition-colors"
                  >
                    Sin cliente asignado
                  </button>
                )}

                {filteredClients.map((client) => (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => {
                      setSelectedClient(client);
                      setShowClientPopup(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border transition-colors flex justify-between items-center ${
                      selectedClient?.id === client.id
                        ? "bg-pink-500/20 border-pink-500/50 text-white"
                        : "bg-gray-800 border-gray-700/50 text-gray-200 hover:bg-gray-750"
                    }`}
                  >
                    <span className="text-sm font-medium">{client.name} {client.lastname}</span>
                    {selectedClient?.id === client.id && <FiCheckCircle className="text-pink-400" />}
                  </button>
                ))}

                {filteredClients.length === 0 && clients.length > 0 && (
                  <p className="text-center py-4 text-xs text-gray-400">Sin coincidencias.</p>
                )}

                {clients.length === 0 && (
                  <div className="text-center py-6 space-y-3">
                    <p className="text-xs text-gray-400">No hay clientes guardados aún.</p>
                    <button
                      type="button"
                      onClick={() => setShowAdd(true)}
                      className="bg-pink-500/20 text-pink-400 hover:bg-pink-500/30 px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Crear primer cliente
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Formulario rápido para crear cliente */}
            {showAdd && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const created = await addClient({
                    name: newClientName,
                    lastname: newClientLastname,
                  });
                  if (created) setSelectedClient(created);
                  setShowAdd(false);
                  setNewClientName("");
                  setNewClientLastname("");
                  setShowClientPopup(false);
                }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-semibold text-base">Nuevo Cliente</h3>
                  <button 
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <FiX />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 border border-white/5"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Apellido"
                    value={newClientLastname}
                    onChange={(e) => setNewClientLastname(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 border border-white/5"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="flex-1 bg-gray-800 hover:bg-gray-750 text-gray-300 py-2 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-xl text-xs font-semibold transition-colors shadow"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Tarjeta de Resumen / Confirmación */}
      <div className="mt-6 bg-luminiBrandBlue text-white rounded-2xl p-5 border border-white/10 shadow-xl space-y-4">
        <div className="border-b border-white/10 pb-3 flex justify-between items-start">
          <div>
            <span className="text-xs text-pink-400 uppercase tracking-wider font-semibold">Resumen</span>
            <h4 className="font-semibold text-lg">{selectedClientType?.name || "Servicio no seleccionado"}</h4>
          </div>
          <span className="text-xl font-black text-emerald-400 mt-5">
            {selectedClientType ? `$${selectedClientType.price}` : "$0"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
          <div>
            <span className="block text-gray-400">Categoría:</span>
            <span className="font-medium text-white">{selectedCategory?.name || "—"}</span>
          </div>
          <div>
            <span className="block text-gray-400">Pago:</span>
            <span className="font-medium text-white">{selectedPaymentMethod?.type || "—"}</span>
          </div>
          {settings?.clients_in_offerings && (
            <div className="col-span-2 pt-1">
              <span className="block text-gray-400">Cliente:</span>
              <span className="font-medium text-white">
                {selectedClient ? `${selectedClient.name} ${selectedClient.lastname}` : "Sin asignar"}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !selectedCategory || !selectedClientType}
          className="w-full py-3 bg-pink-500 hover:bg-pink-600 disabled:opacity-40 disabled:hover:bg-pink-500 text-white font-bold rounded-xl transition-all shadow-lg active:scale-[0.98] mt-2"
        >
          {loading ? "Registrando..." : "Confirmar y Registrar"}
        </button>
      </div>

      {/* Popup de Éxito */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-emerald-500/40 text-white rounded-2xl p-6 shadow-2xl flex flex-col items-center space-y-3 max-w-xs text-center animate-in zoom-in-95 duration-200">
            <FiCheckCircle className="text-emerald-400 text-5xl animate-bounce" />
            <span className="font-bold text-lg">¡Registrado con éxito!</span>
            <p className="text-xs text-gray-400">La transacción se procesó correctamente.</p>
          </div>
        </div>
      )}

    </div>
  );
}