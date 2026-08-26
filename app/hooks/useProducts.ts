import { useState, useEffect } from "react";
import { apiGet } from "@/app/lib/apiGet";
import { apiPost } from "@/app/lib/apiPost";
import { apiUpdate } from "../lib/apiUpdate";
import { apiDelete } from "@/app/lib/apiDelete";

type Product = {
  id: string;
  name: string;
  description?: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  brand?: string; // 👉 nueva propiedad
  categoryId: string;
};

export function useProducts(establishmentId?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<Product[]>(`/products`);
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [establishmentId]);

  // 👉 Crear producto
  const createProduct = async (dto: {
    name: string;
    description?: string;
    costPrice: number;
    salePrice: number;
    stock: number;
    brand?: string; // 👉 incluir brand en el DTO
    categoryId: string;
  }) => {
    try {
      await apiPost(`/products`, dto);
      await fetchProducts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 👉 Actualizar producto
  const updateProduct = async (id: string, dto: Partial<Product>) => {
    try {
      await apiUpdate(`/products/${id}`, dto);
      await fetchProducts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 👉 Eliminar producto
  const deleteProduct = async (id: string) => {
    try {
      await apiDelete(`/products/${id}`);
      await fetchProducts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
