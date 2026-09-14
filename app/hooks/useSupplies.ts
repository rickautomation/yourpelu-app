// src/hooks/useSupplies.ts
import { useState, useCallback } from 'react';
import { apiGet } from '../lib/apiGet';
import { apiPost } from '../lib/apiPost';
import { apiPatch } from '../lib/apiPatch';
import { apiDelete } from '../lib/apiDelete';

export interface Supply {
  id: string;
  name: string;
  description: string;
  price: number;
  establishmentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplyDto {
  name: string;
  description: string;
  price: number;
  establishmentId: string;
}

export interface UpdateSupplyDto {
  name?: string;
  description?: string;
  price?: number;
}

export function useSupplies() {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSupplies = useCallback(async (establishmentId: string) => {
    if (!establishmentId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<Supply[]>(`/supplies/establishment/${establishmentId}`);
      setSupplies(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los insumos');
    } finally {
      setLoading(false);
    }
  }, []);

  const createSupply = async (dto: CreateSupplyDto): Promise<Supply | null> => {
    setLoading(true);
    setError(null);
    try {
      const newSupply = await apiPost<Supply>('/supplies', dto);
      setSupplies((prev) => [...prev, newSupply]);
      return newSupply;
    } catch (err: any) {
      setError(err.message || 'Error al crear el insumo');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSupply = async (id: string, dto: UpdateSupplyDto): Promise<Supply | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedSupply = await apiPatch<Supply>(`/supplies/${id}`, dto);
      setSupplies((prev) =>
        prev.map((supply) => (supply.id === id ? updatedSupply : supply))
      );
      return updatedSupply;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el insumo');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteSupply = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiDelete(`/supplies/${id}`);
      setSupplies((prev) => prev.filter((supply) => supply.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el insumo');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    supplies,
    loading,
    error,
    fetchSupplies,
    createSupply,
    updateSupply,
    deleteSupply,
  };
}