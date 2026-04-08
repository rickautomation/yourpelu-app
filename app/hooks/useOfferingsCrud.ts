"use client";

import { useState } from "react";
import { apiGet } from "../lib/apiGet";
import { apiPost } from "../lib/apiPost";
import { apiPatch } from "../lib/apiPatch";
import { apiDelete } from "../lib/apiDelete";

// DTO que coincide con tu backend
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
// Tipo de respuesta mínima (podés ampliarlo según tu entidad Offering)
export type Offering = {
  id: string;
  price: number;
  // relaciones mínimas que quieras mostrar
};

export function useOfferingsCrud() {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // GET all
  async function fetchOfferings() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<Offering[]>("/offerings");
      setOfferings(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  // POST create
  async function createOffering(dto: CreateOfferingDto): Promise<Offering | null> {
    setLoading(true);
    setError(null);
    try {
      const offering = await apiPost<Offering>("/offerings", dto);
      setOfferings((prev) => [...prev, offering]);
      return offering;
    } catch (err: any) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }

  // PATCH update
  async function updateOffering(id: string, dto: Partial<CreateOfferingDto>): Promise<Offering | null> {
    setLoading(true);
    setError(null);
    try {
      const updated = await apiPatch<Offering>(`/offerings/${id}`, dto);
      setOfferings((prev) => prev.map((o) => (o.id === id ? updated : o)));
      return updated;
    } catch (err: any) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }

  // DELETE
  async function deleteOffering(id: string) {
    setLoading(true);
    setError(null);
    try {
      await apiDelete(`/offerings/${id}`);
      setOfferings((prev) => prev.filter((o) => o.id !== id));
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return {
    offerings,
    loading,
    error,
    fetchOfferings,
    createOffering,
    updateOffering,
    deleteOffering,
  };
}