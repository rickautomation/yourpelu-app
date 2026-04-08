"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { useOfferingsCategories } from "@/app/hooks/useOfferingCategory";
import { useOfferingsCrud } from "@/app/hooks/useOfferingsCrud";
import { useState, useEffect } from "react";
import { useRef } from "react";
import { FiCheckCircle, FiChevronDown } from "react-icons/fi";
import { useClients } from "@/app/hooks/useClients";
import { useUserEstablishment } from "@/app/hooks/useUserEstablishment";

export type CreateOfferingDto = {
  price: number;
  userId: string;
  clientId?: string | null;
  barbershopId?: string | null;
  establishmentId?: string | null;
  clientOfferingTypeId?: string | null;
  clientOfferingCategoryId?: string | null;
  paymentMethodId?: string | null;
};

export default function AddOwnOffering() {
  const { user } = useAuth();
  const { activeEstablishment, settings} = useUserEstablishment(user)
  const { clientCategories, paymentMethods } = useOfferingsCategories(
    activeEstablishment?.id,
  );
  const { createOffering, loading, error } = useOfferingsCrud();
  const { clients, addClient } = useClients();

  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [selectedClientType, setSelectedClientType] = useState<any | null>(
    null,
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    any | null
  >(null);

  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [showClientTypePopup, setShowClientTypePopup] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newClientName, setNewClientName] = useState(""); // input nombre
  const [newClientLastname, setNewClientLastname] = useState(""); // input apellido

  const categoryRef = useRef<HTMLDivElement | null>(null);
  const clientTypeRef = useRef<HTMLDivElement | null>(null);
  const paymentRef = useRef<HTMLDivElement | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [showClientPopup, setShowClientPopup] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const clientRef = useRef<HTMLDivElement>(null);

  const filteredClients = clients.filter((client) =>
    `${client.name} ${client.lastname} ${client.email ?? ""} ${client.phone ?? ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  // 👇 Setear categoría por defecto o primera opción
  useEffect(() => {
    if (!selectedCategory && clientCategories?.length > 0) {
      const defaultCat = clientCategories.find(
        (cat: any) => cat.default === true,
      );
      setSelectedCategory(defaultCat || clientCategories[0]);
    }
  }, [clientCategories, selectedCategory]);

  // 👇 Setear clientType por defecto o primera opción
  useEffect(() => {
    if (
      selectedCategory &&
      !selectedClientType &&
      selectedCategory.clientTypes?.length > 0
    ) {
      const defaultType = selectedCategory.clientTypes.find(
        (ct: any) => ct.default === true,
      );
      setSelectedClientType(defaultType || selectedCategory.clientTypes[0]);
    }
  }, [selectedCategory, selectedClientType]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showCategoryPopup &&
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setShowCategoryPopup(false);
      }
      if (
        showClientTypePopup &&
        clientTypeRef.current &&
        !clientTypeRef.current.contains(event.target as Node)
      ) {
        setShowClientTypePopup(false);
      }
      if (
        showPaymentPopup &&
        paymentRef.current &&
        !paymentRef.current.contains(event.target as Node)
      ) {
        setShowPaymentPopup(false);
      }
      if (
        showClientPopup &&
        clientRef.current &&
        !clientRef.current.contains(event.target as Node)
      ) {
        setShowClientPopup(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    showCategoryPopup,
    showClientTypePopup,
    showPaymentPopup,
    showClientPopup,
  ]);

  async function handleSubmit() {
    if (!user?.id) {
      console.error("No hay usuario autenticado");
      return;
    }
    if (!activeEstablishment?.id) {
      console.error("No hay barbería activa");
      return;
    }
    if (!selectedCategory || !selectedClientType) {
      console.error("Faltan datos para crear el offering");
      return;
    }

    const dto: CreateOfferingDto = {
      price: Number(selectedClientType.price),
      userId: user.id,
      barbershopId: activeEstablishment?.id || null,
      establishmentId: activeEstablishment?.id || null,
      clientOfferingTypeId: selectedClientType?.id || null,
      clientOfferingCategoryId: selectedCategory?.id || null,
      paymentMethodId: selectedPaymentMethod?.id || null,
      clientId: selectedClient?.id || null,
    };

    try {
      const offering = await createOffering(dto);
      if (offering) {
        setShowSuccessPopup(true);
        setSelectedClient(null);
        setSearchTerm("");
        setShowAdd(false);
        setTimeout(() => setShowSuccessPopup(false), 3000);
      }
    } catch (err) {
      console.error("Error creando offering:", err);
    }
  }

  if (loading)
    return (
      <div className="absolute inset-0 flex items-center justify-center ">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );

  return (
    <div className="py-2 px-4 space-y-4">
      {/* Tarjeta Categoría */}
      <div
        onClick={() => setShowCategoryPopup(true)}
        className="px-4 py-3 bg-gray-700 text-white rounded-lg flex justify-between items-center cursor-pointer"
      >
        <span>{selectedCategory ? selectedCategory.name : "Categoría"}</span>
        <FiChevronDown className="text-xl" />
      </div>

      {showCategoryPopup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="border border-pink-600 bg-gray-800 rounded-lg p-6 w-80"
            ref={categoryRef}
          >
            <h2 className="text-center text-white text-lg mb-4">
              Elegí una categoría
            </h2>
            <ul className="space-y-3">
              {clientCategories?.map((cat: any) => (
                <li
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedClientType(null); // reset clientType al cambiar categoría
                    setShowCategoryPopup(false);
                  }}
                  className="px-3 py-2 bg-gray-700 text-white rounded cursor-pointer hover:bg-gray-600"
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tarjeta ClientType */}
      {selectedCategory && (
        <div
          onClick={() => setShowClientTypePopup(true)}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg flex justify-between items-center cursor-pointer"
        >
          <span>
            {selectedClientType ? selectedClientType.name : "Servicio"}
          </span>
          <FiChevronDown className="text-xl" />
        </div>
      )}

      {showClientTypePopup && selectedCategory && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="border border-pink-600 bg-gray-800 rounded-lg p-6 w-80"
            ref={clientTypeRef}
          >
            <h2 className="text-center text-white text-lg mb-4">
              Elegí un servicio
            </h2>
            <ul className="space-y-2">
              {selectedCategory.clientTypes?.map((service: any) => (
                <li
                  key={service.id}
                  onClick={() => {
                    setSelectedClientType(service);
                    setShowClientTypePopup(false);
                  }}
                  className="px-3 py-2 bg-gray-700 text-white rounded cursor-pointer hover:bg-gray-600"
                >
                  {service.name} — ${service.price}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tarjeta PaymentMethod */}
      <div
        onClick={() => setShowPaymentPopup(true)}
        className="px-4 py-3 bg-gray-700 text-white rounded-lg flex justify-between items-center cursor-pointer"
      >
        <span>
          {selectedPaymentMethod
            ? selectedPaymentMethod.type
            : "Método de pago"}
        </span>
        <FiChevronDown className="text-xl" />
      </div>

      {showPaymentPopup && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="border border-pink-600 bg-gray-800 rounded-lg p-6 w-80"
            ref={paymentRef}
          >
            <h2 className="text-center text-white text-lg mb-4">
              Elegí un método de pago
            </h2>
            <ul className="space-y-3">
              {paymentMethods?.map((method: any) => (
                <li
                  key={method.id}
                  onClick={() => {
                    setSelectedPaymentMethod(method);
                    setShowPaymentPopup(false);
                  }}
                  className="px-3 py-2 bg-gray-700 text-white rounded cursor-pointer hover:bg-gray-600"
                >
                  {method.type}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {settings?.clients_in_offerings && (
        <div
          onClick={() => setShowClientPopup(true)}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg flex justify-between items-center cursor-pointer"
        >
          <span>
            {selectedClient
              ? `${selectedClient.name} ${selectedClient.lastname}`
              : "Seleccionar cliente"}
          </span>
          <FiChevronDown className="text-xl" />
        </div>
      )}

      {showClientPopup && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="border border-pink-600 bg-gray-800 rounded-lg p-6 w-80"
            ref={clientRef}
          >
            {filteredClients.length > 0 && !showAdd && (
              <h2 className="text-center text-white text-lg mb-4">
                Elegí un cliente
              </h2>
            )}

            {!showAdd && filteredClients.length > 0 && (
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value.trim())}
                  className="px-2 py-2 rounded bg-gray-700 text-white w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <button
                  onClick={() => setShowAdd(true)}
                  className="flex gap-2 items-center justify-center bg-pink-400 px-2  text-white rounded-md hover:bg-pink-500 transition-colors font-bold ml-2"
                >
                  <span>nuevo </span>
                  <span className="text-4xl">+</span>
                </button>
              </div>
            )}

            {/* Lista de clientes con scroll */}
            {!showAdd && (
              <ul className="space-y-3 max-h-48 overflow-y-auto">
                {clients.length === 0 ? (
                  <li className="p-3 text-gray-400 text-center">
                    Aun no tienes clientes
                    <div className="flex gap-2 justify-center mt-2">
                      <button
                        onClick={() => setShowAdd(true)}
                        className="bg-pink-400 text-white px-3 py-2 rounded hover:bg-pink-500 transition-colors text-sm font-semibold"
                      >
                        Agregar ahora
                      </button>
                      <button
                        onClick={() => setShowClientPopup(false)}
                        className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 transition-colors text-sm font-semibold"
                      >
                        Cancelar
                      </button>
                    </div>
                  </li>
                ) : filteredClients.length > 0 ? (
                  <div>
                    {
                     searchTerm.length === 0 && ( <li
                        onClick={() => {
                          setSelectedClient(null);
                          setShowClientPopup(false);
                        }}
                        className="px-3 py-2 border border-pink-600 bg-gray-700 text-white rounded-lg cursor-pointer hover:bg-gray-600 transition-colors mb-1"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            Sin cliente
                          </span>
                        </div>
                      </li>)
                    }
                    {filteredClients.map((client) => (
                      <li
                        key={client.id}
                        onClick={() => {
                          setSelectedClient(client);
                          setShowClientPopup(false);
                        }}
                        className="px-3 py-2 border border-pink-600 bg-gray-700 text-white rounded-lg cursor-pointer hover:bg-gray-600 transition-colors mb-1"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            {client.name} {client.lastname}
                          </span>
                        </div>
                      </li>
                    ))}
                  </div>
                ) : (
                  <li className="p-3 text-gray-400 text-center">
                    No se encontraron coincidencias
                    <div className="flex flex-col gap-2 justify-center mt-2">
                      <button
                        onClick={() => setShowAdd(true)}
                        className="bg-pink-400 text-white px-3 py-2 rounded hover:bg-pink-500 transition-colors text-sm font-semibold"
                      >
                        Agregar nuevo cliente
                      </button>
                      <button
                        onClick={() => {
                          setShowAdd(false); // volvemos a la vista original
                          setSearchTerm(""); // opcional: limpiar búsqueda
                        }}
                        className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 transition-colors text-sm font-semibold"
                      >
                        Cancelar
                      </button>
                    </div>
                  </li>
                )}
              </ul>
            )}

            {/* Formulario para agregar cliente */}
            {showAdd && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  const newClient = {
                    name: newClientName,
                    lastname: newClientLastname,
                  };

                  const created = await addClient(newClient);

                  if (created) {
                    setSelectedClient(created);
                  }

                  // Cerramos el form y limpiamos inputs
                  setShowAdd(false);
                  setNewClientName("");
                  setNewClientLastname("");
                  setShowClientPopup(false); // opcional: cerrar popup automáticamente
                }}
                className="flex flex-col gap-3"
              >
                <h2 className="text-center text-lg font-semibold">
                  Nuevo Cliente
                </h2>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="px-2 py-2 rounded bg-gray-700 text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Apellido"
                  value={newClientLastname}
                  onChange={(e) => setNewClientLastname(e.target.value)}
                  className="px-2 py-2 rounded bg-gray-700 text-white"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-pink-400 text-white px-3 py-2 rounded hover:bg-pink-500 transition-colors text-sm font-semibold"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="flex-1 bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 transition-colors text-sm font-semibold"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Card resumen al final */}
      <div className="mt-8 bg-gray-800 text-white rounded-lg shadow-lg p-6 space-y-4">
        <div className="flex justify-between">
          <p className="font-semibold">
            {selectedCategory?.name || "Categoría"}
          </p>
          <p className="font-semibold">
            {selectedClientType?.name || "Servicio"}
          </p>
        </div>

        <div className="flex justify-between">
          <p className="text-green-400 font-bold">
            {selectedClientType ? `$${selectedClientType.price}` : ""}
          </p>
          {selectedPaymentMethod?.type ? (
            <p className="italic">{`${selectedPaymentMethod.type}`}</p>
          ) : (
            <p className="italic text-gray-400">Sin metodo de pago</p>
          )}
        </div>

        {settings?.clients_in_offerings && (
          <div className="flex justify-between">
            <strong>Cliente: </strong>

            {selectedClient ? (
              <p className="italic">
                {selectedClient.name + " " + selectedClient.lastname}
              </p>
            ) : (
              <p className="italic text-gray-400">Sin cliente</p>
            )}
          </div>
        )}

        <div className="w-full text-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Registrar
          </button>
        </div>

        {showSuccessPopup && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-70 flex items-center justify-center z-50">
            <div className="border border-green-500 bg-gray-800 text-white rounded-lg shadow-lg p-6 flex items-center space-x-3">
              <FiCheckCircle className="text-green-400 text-3xl" />
              <span className="font-semibold">
                {selectedCategory?.name} creado con éxito!
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
