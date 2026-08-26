import { useEffect, useState } from "react";
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

  const fetchCategories = async () => {
    if (!establishmentId) return;
    try {
      setLoading(true);
      setError(null);

      // Categorías vinculadas al establecimiento
      const linked = await apiGet<ProductCategory[]>(
        `/product-categories/by-establishment/${establishmentId}`
      );

      // Categorías sin establecimiento (plantillas)
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
  };

  useEffect(() => {
    fetchCategories();
  }, [establishmentId]);

  // Crear categoría desde cero
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

  // Crear categoría desde plantilla
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
