"use client";
import { useEffect, useState } from "react";
import { apiGet } from "../lib/apiGet";
import { apiPost } from "../lib/apiPost";
import { apiUpdate } from "../lib/apiUpdate";
import { apiDelete } from "../lib/apiDelete";

type HaircutType = {
  id: string;
  name: string;
  description?: string;
  price?: number;
  baseType?: { id: string };
};

export function useServices(barbershopId?: string) {
  const [globalServices, setGlobalServices] = useState<HaircutType[]>([]);
  const [ownServices, setOwnServices] = useState<HaircutType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const global = await apiGet<HaircutType[]>("/haircut-types");
        setGlobalServices(global);

        if (barbershopId) {
          const own = await apiGet<HaircutType[]>(
            `/client-haircut-types/barbershop/${barbershopId}`
          );
          setOwnServices(own);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    if (barbershopId) fetchServices();
  }, [barbershopId]);

  const addOwnService = async (data: { name: string; description?: string; price: number }) => {
    const newService = await apiPost<HaircutType>(
      `/client-haircut-types/barbershop/${barbershopId}`,
      data
    );
    setOwnServices([...ownServices, newService]);
  };

  const addGlobalService = async (serviceId: string, price: number) => {
    const newService = await apiPost<HaircutType>(
      `/client-haircut-types/barbershop/${barbershopId}/add/${serviceId}`,
      { price }
    );
    setOwnServices([...ownServices, newService]);
  };

  const updateService = async (serviceId: string, updatedData: Partial<HaircutType>) => {
    const updated = await apiUpdate<HaircutType>(
      `/client-haircut-types/${serviceId}`,
      updatedData
    );
    setOwnServices(ownServices.map((s) => (s.id === serviceId ? { ...s, ...updated } : s)));
  };

  const deleteService = async (serviceId: string) => {
    await apiDelete(`/client-haircut-types/soft/${serviceId}`);
    setOwnServices(ownServices.filter((s) => s.id !== serviceId));
  };

  return {
    globalServices,
    ownServices,
    loading,
    error,
    addOwnService,
    addGlobalService,
    updateService,
    deleteService,
  };
}