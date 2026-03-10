"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { useOfferingsCategories } from "@/app/hooks/useOfferingCategory";
import { useUserBarbershops } from "@/app/hooks/useUserBarbershops";
import { useOfferingsCrud } from "@/app/hooks/useOfferingsCrud";
import { useState, useEffect } from "react";
import { useRef } from "react";
import { FiCheckCircle, FiChevronDown } from "react-icons/fi";

export type CreateOfferingDto = {
  price: number;
  userId: string;
  clientId?: string | null;
  barbershopId?: string | null;
  clientOfferingTypeId?: string | null;
  clientOfferingCategoryId?: string | null;
  paymentMethodId?: string | null;
};

export default function AddOwnOffering() {
  const { user } = useAuth();
  const { activeBarbershop } = useUserBarbershops(user);
  const { clientCategories, paymentMethods } = useOfferingsCategories(
    activeBarbershop?.id,
  );
  const { createOffering, loading, error } = useOfferingsCrud();

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

  const categoryRef = useRef<HTMLDivElement | null>(null);
  const clientTypeRef = useRef<HTMLDivElement | null>(null);
  const paymentRef = useRef<HTMLDivElement | null>(null);

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
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCategoryPopup, showClientTypePopup, showPaymentPopup]);

  async function handleSubmit() {
    if (!user?.id) {
      console.error("No hay usuario autenticado");
      return;
    }
    if (!activeBarbershop?.id) {
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
      barbershopId: activeBarbershop?.id || null,
      clientOfferingTypeId: selectedClientType?.id || null,
      clientOfferingCategoryId: selectedCategory?.id || null,
      paymentMethodId: selectedPaymentMethod?.id || null,
    };

    try {
      console.log("dto: ", dto)
      const offering = await createOffering(dto);
      if (offering) {
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 3000); // se oculta en 3 segundos
      }
    } catch (err) {
      console.error("Error creando offering:", err);
    }
  }

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
          <p className="italic">
            {selectedPaymentMethod?.type || "Sin método de pago"}
          </p>
        </div>

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
              <span className="font-semibold">{selectedCategory?.name} creado con éxito!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
