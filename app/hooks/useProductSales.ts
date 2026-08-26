"use client";

import { useState, useEffect } from "react";
import { apiGet } from "@/app/lib/apiGet";
import { apiPost } from "@/app/lib/apiPost";
import { apiUpdate } from "../lib/apiUpdate";
import { apiDelete } from "@/app/lib/apiDelete";

type ProductSaleItem = {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  costPrice: number; // 👈 nuevo campo
  totalPrice: number;
};

type ProductSale = {
  id: string;
  establishmentId: string;
  items: ProductSaleItem[];
  totalPrice: number;
  totalCost: number; // 👈 nuevo campo
  status: string;
  createdAt: string;
  updatedAt: string;
};

export function useProductSales(establishmentId?: string) {
  const [sales, setSales] = useState<ProductSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<ProductSale[]>(`/product-sales`);
      setSales(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [establishmentId]);

  // 👉 Crear venta con múltiples productos
  const createSale = async (dto: {
    establishmentId: string;
    items: { productId: string; quantity: number; unitPrice: number }[];
  }) => {
    try {
      await apiPost(`/product-sales`, dto);
      await fetchSales(); // refrescar lista
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 👉 Actualizar venta
  const updateSale = async (id: string, dto: Partial<ProductSale>) => {
    try {
      await apiUpdate(`/product-sales/${id}`, dto);
      await fetchSales();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 👉 Eliminar venta
  const deleteSale = async (id: string) => {
    try {
      await apiDelete(`/product-sales/${id}`);
      await fetchSales();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    sales,
    loading,
    error,
    createSale,
    updateSale,
    deleteSale,
    refetch: fetchSales,
  };
}
