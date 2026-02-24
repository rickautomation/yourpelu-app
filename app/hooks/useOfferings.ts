"use client";

import { useEffect, useState } from "react";
import { apiGet } from "../lib/apiGet";
import { apiPost } from "../lib/apiPost";
import { apiPatch } from "../lib/apiPatch";
import { apiDelete } from "../lib/apiDelete"; // 👈 helper para DELETE

type OfferingCategory = {
  id: string;
  name: string;
  description?: string;
  types: OfferingType[];
};

type OfferingType = {
  id: string;
  name: string;
  description?: string;
  category?: OfferingCategory;
};

type ClientOfferingType = {
  id: string;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  baseType?: OfferingType;
};

export function useOfferings(barbershopId?: string) {
  const [categories, setCategories] = useState<OfferingCategory[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<OfferingCategory | null>(null);

  const [clientOfferings, setClientOfferings] = useState<ClientOfferingType[]>([]);

  // cargar categorías base
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catData = await apiGet<OfferingCategory[]>("/offering-categories");
        setCategories(catData);
        if (catData.length > 0) {
          setSelectedCategory(catData[0]);
        }
      } catch (err) {
        console.error("Error cargando categorías:", err);
      }
    };
    fetchCategories();
  }, []);

  // cargar servicios propios de la barbería
  useEffect(() => {
    const fetchClientOfferings = async () => {
      if (!barbershopId) return;
      try {
        const data = await apiGet<ClientOfferingType[]>(
          `/client-offering-types/barbershop/${barbershopId}`
        );
        setClientOfferings(data);
      } catch (err) {
        console.error("Error cargando servicios de barbería:", err);
      }
    };
    fetchClientOfferings();
  }, [barbershopId]);

  // crear un nuevo servicio
  const addOffering = async (data: {
    name: string;
    description?: string;
    price: number;
    baseTypeId?: string;
  }) => {
    if (!barbershopId) throw new Error("No barbershopId provided");

    try {
      const newOffering = await apiPost<ClientOfferingType>("/client-offering-types", {
        barbershopId,
        baseTypeId: data.baseTypeId,
        name: data.name,
        description: data.description,
        price: data.price,
      });
      setClientOfferings((prev) => [...prev, newOffering]);
      return newOffering;
    } catch (err) {
      console.error("Error creando servicio:", err);
      throw err;
    }
  };

  // actualizar precio
  const updatePrice = async (id: string, price: number) => {
    try {
      const updated = await apiPatch<ClientOfferingType>(
        `/client-offering-types/${id}/price`,
        { price }
      );
      setClientOfferings((prev) =>
        prev.map((co) => (co.id === id ? { ...co, price: updated.price } : co))
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
    addOffering,
    updatePrice,   // 👈 nuevo
    deleteOffering // 👈 nuevo
  };
}