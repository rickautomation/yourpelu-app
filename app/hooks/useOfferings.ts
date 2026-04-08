"use client";

import { useEffect, useState } from "react";
import { apiGet } from "../lib/apiGet";
import { apiPost } from "../lib/apiPost";
import { apiPatch } from "../lib/apiPatch";
import { apiDelete } from "../lib/apiDelete";

type OfferingCategory = {
  id: string;
  name: string;
  description?: string;
  types: OfferingType[];
  baseType: string;
};

type OfferingType = {
  id: string;
  name: string;
  description?: string;
  category?: OfferingCategory;
};

export type ClientOfferingType = {
  id: string;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  baseType?: OfferingType | null; // si viene de plantilla
  clientCategory?: {
    id: string;
    name: string;
    description?: string;
  } | null;
  globalCategory?: {
    id: string;
    name: string;
    description?: string;
  } | null;
};

export type ClientOfferingCategory = {
  id: string;
  name: string;
  description?: string;
  establishment: {
    id: string;
    name: string;
    address?: string;
    phoneNumber?: string;
    bookingEnabled?: boolean;
    deletedAt?: string | null;
  };
  clientTypes?: ClientOfferingType[]; // servicios asociados a esta categoría
  deletedAt?: string | null;
};

export function useOfferings(establishmentId?: string, typeId?: string) {
  const [categories, setCategories] = useState<
    (OfferingCategory | ClientOfferingCategory)[]
  >([]);
  const [globalCategories, setGlobalCategories] = useState<
    (OfferingCategory | ClientOfferingCategory)[]
  >([]);
  const [clientCategories, setClientCategories] = useState<
    (OfferingCategory | ClientOfferingCategory)[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<
    OfferingCategory | ClientOfferingCategory | null
  >(null);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [loading, setLoading] = useState(true);

  const [clientOfferings, setClientOfferings] = useState<ClientOfferingType[]>(
    [],
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);

        let globalCats: OfferingCategory[] = []; // 👈 declarar acá

        if (typeId) {
          globalCats = await apiGet<OfferingCategory[]>(
            `/offering-categories/by-type/${typeId}`,
          );
        }

        let clientCats: ClientOfferingCategory[] = [];
        if (establishmentId) {
          clientCats = await apiGet<ClientOfferingCategory[]>(
            `/client-offering-categories/establishment/${establishmentId}`,
          );
        }

        // Unificar por nombre sin repetidos
        const merged = [...globalCats, ...clientCats];

        const unique = Array.from(
          new Map(merged.map((cat) => [cat.name, cat])).values(),
        );

        setGlobalCategories(globalCats);
        setClientCategories(clientCats);
        setCategories(unique);

        if (unique.length > 0) {
          setSelectedCategory(globalCats[0]);
        }
      } catch (err) {
        console.error("Error cargando categorías:", err);
      } finally {
        setLoadingCategories(false); // 👈 importante cerrar el loading
      }
    };
    fetchCategories();
  }, [establishmentId, typeId]);

  // cargar servicios propios de la barbería
  useEffect(() => {
    const fetchClientOfferings = async () => {
      if (!establishmentId) {
        setLoading(false); // 👈 cerrar loading si no hay establecimiento
        return;
      }
      try {
        setLoading(true);
        const data = await apiGet<ClientOfferingType[]>(
          `/client-offering-types/establishment/${establishmentId}`,
        );
        setClientOfferings(data);
      } catch (err) {
        console.error("Error cargando servicios de establecimiento:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClientOfferings();
  }, [establishmentId]);

  // crear un nuevo servicio
  const addOffering = async (data: {
    name: string;
    description?: string;
    price: number;
    baseTypeId?: string;
    categoryId?: string;
  }) => {
    if (!establishmentId) throw new Error("No establishmentId provided");

    try {
      const newOffering = await apiPost<ClientOfferingType>(
        "/client-offering-types",
        {
          establishmentId,
          baseTypeId: data.baseTypeId,
          name: data.name,
          description: data.description,
          price: data.price,
        },
      );
      setClientOfferings((prev) => [...prev, newOffering]);
      return newOffering;
    } catch (err) {
      console.error("Error creando servicio:", err);
      throw err;
    }
  };

  const addClientCategory = async (data: {
    establishmentId: string;
    name: string;
    description?: string;
  }) => {
    try {
      const newCategory = await apiPost<ClientOfferingCategory>(
        "/client-offering-categories",
        data,
      );
      setCategories((prev) => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      console.error("Error creando categoría de cliente:", err);
      throw err;
    }
  };

  // helper para discriminar
  function isOfferingCategory(
    cat: OfferingCategory | ClientOfferingCategory,
  ): cat is OfferingCategory {
    return (cat as OfferingCategory).types !== undefined;
  }

  // actualizar precio
  const updatePrice = async (id: string, price: number) => {
    try {
      const updated = await apiPatch<ClientOfferingType>(
        `/client-offering-types/${id}/price`,
        { price },
      );
      setClientOfferings((prev) =>
        prev.map((co) => (co.id === id ? { ...co, price: updated.price } : co)),
      );
      return updated;
    } catch (err) {
      console.error("Error actualizando precio:", err);
      throw err;
    }
  };

  // eliminar (soft delete)
  const deleteOffering = async (id: string) => {
    try {
      await apiDelete(`/client-offering-types/${id}`);
      setClientOfferings((prev) => prev.filter((co) => co.id !== id));
    } catch (err) {
      console.error("Error eliminando servicio:", err);
      throw err;
    }
  };

  return {
    categories,
    selectedCategory,
    setSelectedCategory,
    clientOfferings,
    setClientOfferings,
    addOffering,
    updatePrice,
    deleteOffering,
    addClientCategory,
    isOfferingCategory,
    globalCategories,
    loadingCategories,
    loading,
  };
}
