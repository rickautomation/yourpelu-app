"use client";

import { useEstablishment } from "@/app/context/EstablishmentContext";
import { useProductCategories } from "@/app/hooks/useProductCategories";
import { useProducts } from "@/app/hooks/useProducts";
import { useRouter } from "next/navigation";
import NewProductForm from "../components/NewProductForm";

export default function NewProductPage() {
  const { activeEstablishment } = useEstablishment();
  const { linkedCategories, loading, error } = useProductCategories(
    activeEstablishment?.id
  );
  const { createProduct } = useProducts(activeEstablishment?.id);
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <div className="p-4 bg-rose-500/15 border border-rose-500/30 rounded-2xl text-rose-300 text-sm">
          Error al cargar los datos: {error}
        </div>
      </div>
    );
  }

  const handleCreateProduct = async (dto: {
    name: string;
    description?: string;
    brand?: string;
    costPrice: number;
    salePrice: number;
    stock: number;
    categoryId: string;
  }) => {
    await createProduct(dto);
    router.push("/workspace/commercial/products"); // Redirige a la lista tras guardar
  };

  return (
    <div className="p-6">
      <NewProductForm
        linkedCategories={linkedCategories}
        onCancel={() => router.back()}
        onSave={handleCreateProduct}
      />
    </div>
  );
}