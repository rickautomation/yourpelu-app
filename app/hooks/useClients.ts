"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/app/lib/apiGet";
import { apiPost } from "@/app/lib/apiPost";

export type BarberClient = {
  id: string;
  name: string;
  lastname: string;
  email?: string;
  phone?: string;
  createdAt: string;
};

export function useClients(barbershopId?: string, clientId?: string) {
  const [clients, setClients] = useState<BarberClient[]>([]);
  const [client, setClient] = useState<BarberClient | null>(null); // 👈 estado para cliente individual
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 obtener clientes de la barbería
  const fetchClients = async () => {
    if (!barbershopId) return;
    setLoading(true);
    try {
      const data = await apiGet<BarberClient[]>(`/barber-clients/barbershop/${barbershopId}`);
      setClients(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 crear cliente
  const createClient = async (clientData: Partial<BarberClient>) => {
    if (!barbershopId) return;
    setLoading(true);
    try {
      const newClient = await apiPost<BarberClient>(
        `/barber-clients/barbershop/${barbershopId}`,
        clientData
      );
      setClients((prev) => [...prev, newClient]);
      setError(null);
      return newClient;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 obtener cliente por id
  const fetchClientById = async (clientId: string): Promise<BarberClient | null> => {
    try {
      const data = await apiGet<BarberClient>(`/barber-clients/client/${clientId}`);
      setClient(data); // 👈 guardamos en estado
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  // 🔹 useEffect para barbershopId
  useEffect(() => {
    if (barbershopId) {
      fetchClients();
    }
  }, [barbershopId]);

  // 🔹 useEffect para clientId
  useEffect(() => {
    if (clientId) {
      fetchClientById(clientId); // 👈 ahora sí se ejecuta y actualiza `client`
    }
  }, [clientId]);

  return { clients, client, loading, error, fetchClients, createClient, fetchClientById };
}