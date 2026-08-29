import { useEffect, useState, useCallback } from "react";
import { apiGet } from "@/app/lib/apiGet";
import { apiPost } from "@/app/lib/apiPost";

type Product = {
  id: string;
  name: string;
  description?: string;
  brand?: string;
  costPrice: number;
  salePrice: number;
  stock: number;
};

type ProductCategory = {
  id: string;
  name: string;
  description?: string;
  products?: Product[];
  establishment: any | null;
  isLinked?: boolean;
};

export function useProductCategories(establishmentId?: string) {
  const [linkedCategories, setLinkedCategories] = useState<ProductCategory[]>([]);
  const [unassignedCategories, setUnassignedCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    if (!establishmentId) return;
    try {
      setLoading(true);
      setError(null);

      const linked = await apiGet<ProductCategory[]>(
        `/product-categories/by-establishment/${establishmentId}`
      );

      const unassigned = await apiGet<ProductCategory[]>(
        `/product-categories/unassigned`
      );

      setLinkedCategories(linked);
      setUnassignedCategories(unassigned);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [establishmentId]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = async (dto: { name: string; description?: string }) => {
    try {
      await apiPost(`/product-categories`, {
        ...dto,
        establishment: { id: establishmentId },
      });
      await fetchCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const createFromTemplate = async (templateId: string) => {
    try {
      await apiPost(
        `/product-categories/from-template/${templateId}/${establishmentId}`,
        {}
      );
      await fetchCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    linkedCategories,
    unassignedCategories,
    loading,
    error,
    createCategory,
    createFromTemplate,
    refetch: fetchCategories,
  };
}