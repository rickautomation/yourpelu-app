"use client";

import { useState } from "react";
import { apiGet } from "../lib/apiGet";
import { apiPost } from "../lib/apiPost";
import { apiPatch } from "../lib/apiPatch";
import { apiDelete } from "../lib/apiDelete";

export type CreateOfferingDto = {
  price: number;
  userId: string;
  clientId?: string | null;
  establishmentId?: string | null;
  clientOfferingTypeId?: string | null;
  clientOfferingCategoryId?: string | null;
  paymentMethodId?: string | null;
};

export type Offering = {
  id: string;
  price: number;
  createdAt?: string;
  client?: { name: string; lastname: string };
  clientOfferingType?: { name: string };
  clientOfferingCategory?: { name: string };
  paymentMethod?: { name: string };
  // Agrega más relaciones según necesites mostrar en la tabla
};

export function useOfferingsCrud() {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // GET all con soporte para filtros de fecha y establecimiento
  async function fetchOfferings(establishmentId?: string, startDate?: string, endDate?: string) {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (establishmentId) params.append("establishmentId", establishmentId);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const query = params.toString() ? `?${params.toString()}` : "";
      const data = await apiGet<Offering[]>(`/offerings${query}`);
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
      setOfferings((prev) => [offering, ...prev]);
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