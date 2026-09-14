"use client";

import { useEffect, useState, useMemo } from "react";
import { apiGet } from "../lib/apiGet";

export type OfferingCategory = {
  id: string;
  name: string;
  description?: string;
  types?: {
    id: string;
    name: string;
    description?: string;
    clientTypes?: {
      id: string;
      name: string;
      description?: string;
      price: number;
      isActive: boolean;
    }[];
  }[];
};

export type ClientOfferingCategory = {
  id: string;
  name: string;
  description?: string;
  barbershop: {
    id: string;
    name: string;
    address?: string;
    phoneNumber?: string;
    bookingEnabled?: boolean;
    deletedAt?: string | null;
  };
  clientTypes?: {
    id: string;
    name: string;
    description?: string;
    price: number;
    isActive: boolean;
  }[];
  deletedAt?: string | null;
};

export type PaymentMethod = {
  id: string;
  type: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export function useOfferingsCategories(establishmentId?: string) {
  const [globalCategories, setGlobalCategories] = useState<OfferingCategory[]>(
    [],
  );
  const [clientCategories, setClientCategories] = useState<
    ClientOfferingCategory[]
  >([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      // Si no hay establishmentId, evitamos hacer peticiones innecesarias o con valor undefined
      if (!establishmentId) return;

      setLoading(true);
      setError(null);

      try {
        // Ejecutamos las peticiones en paralelo de manera segura
        const [globals, methods, clients] = await Promise.all([
          apiGet<OfferingCategory[]>("/offering-categories"),
          apiGet<PaymentMethod[]>(
            `/payment-methods/establishment/${establishmentId}`,
          ),
          apiGet<ClientOfferingCategory[]>(
            `/client-offering-categories/establishment/${establishmentId}/with-client-types`,
          ),
        ]);

        setGlobalCategories(globals);
        setPaymentMethods(methods);
        setClientCategories(clients);
      } catch (err: any) {
        console.error("Error cargando categorías:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [establishmentId]);

  // 🔑 filtramos solo las globales que tengan types no vacío
  const globalWithTypes = useMemo(
    () => globalCategories.filter((cat) => cat.types && cat.types.length > 0),
    [globalCategories],
  );

  // 🔑 filtramos solo las clientCategories que tengan clientTypes no vacío
  const clientWithTypes = useMemo(
    () =>
      clientCategories.filter(
        (cat) => cat.clientTypes && cat.clientTypes.length > 0,
      ),
    [clientCategories],
  );

  return {
    globalCategories,
    clientCategories,
    globalWithTypes,
    clientWithTypes,
    paymentMethods,
    loading,
    error,
  };
}
