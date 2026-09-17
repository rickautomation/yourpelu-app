// src/app/hooks/useBasicServices.ts
import { useState, useCallback } from 'react';
import { apiGet } from '../lib/apiGet';
import { apiPost } from '../lib/apiPost';
import { apiDelete } from '../lib/apiDelete';

export enum BillingPeriod {
  MONTHLY = 'monthly',
  BIMONTHLY = 'bimonthly',
  WEEKLY = 'weekly',
  ANNUAL = 'annual',
}

export interface ServiceBill {
  id: string;
  name: string; // <-- Nuevo: Ej. "Agosto", "Julio/Agosto", "Año 2017"
  price: number;
  serviceDate: string;
  description?: string;
  isPaid: boolean;
  baseServiceId: string;
  createdAt: string;
}

export interface BaseService {
  id: string;
  name: string;     // Ej. "LUZ"
  provider: string; // <-- Nuevo: Ej. "EDEMSA"
  category?: string;
  description?: string;
  billingPeriod: BillingPeriod;
  establishmentId: string;
  bills?: ServiceBill[];
  createdAt: string;
}

export function useBasicServices() {
  const [baseServices, setBaseServices] = useState<BaseService[]>([]);
  const [bills, setBills] = useState<ServiceBill[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBaseServices = useCallback(async (establishmentId: string) => {
    if (!establishmentId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<BaseService[]>(`/basic-services/base/establishment/${establishmentId}`);
      setBaseServices(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los servicios base');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBills = useCallback(async (establishmentId: string) => {
    if (!establishmentId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<ServiceBill[]>(`/basic-services/bills/establishment/${establishmentId}`);
      setBills(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las facturas');
    } finally {
      setLoading(false);
    }
  }, []);

  const createBaseService = async (dto: any): Promise<boolean> => {
    setLoading(true);
    try {
      await apiPost('/basic-services/base', dto);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al crear el servicio base');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createBill = async (dto: any): Promise<boolean> => {
    setLoading(true);
    try {
      await apiPost('/basic-services/bills', dto);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al registrar la factura');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteBaseService = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      await apiDelete(`/basic-services/base/${id}`);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el servicio base');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteBill = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      await apiDelete(`/basic-services/bills/${id}`);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la factura');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    baseServices,
    bills,
    loading,
    error,
    fetchBaseServices,
    fetchBills,
    createBaseService,
    createBill,
    deleteBaseService,
    deleteBill,
  };
}