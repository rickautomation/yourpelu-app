"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { useOfferingsCategories } from "@/app/hooks/useOfferingCategory";
import { useOfferingsCrud } from "@/app/hooks/useOfferingsCrud";
import { useState, useEffect, useRef } from "react";
import { useClients } from "@/app/hooks/useClients";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import OfferingForm from "../components/OfferingForm";

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
  const { activeEstablishment, settings } = useEstablishment();
  const { clientCategories, paymentMethods, loading } = useOfferingsCategories(
    activeEstablishment?.id,
  );
  const { createOffering } = useOfferingsCrud();
  const { clients, addClient } = useClients();

  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [selectedClientType, setSelectedClientType] = useState<any | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any | null>(null);

  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [showClientTypePopup, setShowClientTypePopup] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientLastname, setNewClientLastname] = useState("");

  const categoryRef = useRef<HTMLDivElement | null>(null);
  const clientTypeRef = useRef<HTMLDivElement | null>(null);
  const paymentRef = useRef<HTMLDivElement | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [showClientPopup, setShowClientPopup] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const clientRef = useRef<HTMLDivElement>(null);

  const [componentLoading, setComponentLoading] = useState(true);

  const filteredClients = clients.filter((client) =>
    `${client.name} ${client.lastname} ${client.email ?? ""} ${client.phone ?? ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  // Setear categoría por defecto o primera opción
  useEffect(() => {
    if (!selectedCategory && clientCategories?.length > 0) {
      const defaultCat = clientCategories.find(
        (cat: any) => cat.default === true,
      );
      setSelectedCategory(defaultCat || clientCategories[0]);
    }
    setComponentLoading(false);
  }, [clientCategories, selectedCategory]);

  // Setear clientType por defecto o primera opción
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

  // Cerrar modales al hacer clic afuera
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
    if (!user?.id || !activeEstablishment?.id || !selectedCategory || !selectedClientType) {
      console.error("Faltan datos requeridos para crear el offering");
      return;
    }

    const dto: CreateOfferingDto = {
      price: Number(selectedClientType.price),
      userId: user.id,
      barbershopId: activeEstablishment.id,
      establishmentId: activeEstablishment.id,
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

  if (loading && !componentLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <OfferingForm
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedClientType={selectedClientType}
        setSelectedClientType={setSelectedClientType}
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        clientCategories={clientCategories}
        paymentMethods={paymentMethods}
        clients={clients}
        filteredClients={filteredClients}
        settings={settings}
        showCategoryPopup={showCategoryPopup}
        setShowCategoryPopup={setShowCategoryPopup}
        showClientTypePopup={showClientTypePopup}
        setShowClientTypePopup={setShowClientTypePopup}
        showPaymentPopup={showPaymentPopup}
        setShowPaymentPopup={setShowPaymentPopup}
        showClientPopup={showClientPopup}
        setShowClientPopup={setShowClientPopup}
        showSuccessPopup={showSuccessPopup}
        showAdd={showAdd}
        setShowAdd={setShowAdd}
        newClientName={newClientName}
        setNewClientName={setNewClientName}
        newClientLastname={newClientLastname}
        setNewClientLastname={setNewClientLastname}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryRef={categoryRef}
        clientTypeRef={clientTypeRef}
        paymentRef={paymentRef}
        clientRef={clientRef}
        addClient={addClient}
        handleSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}