"use client";

import { useState } from "react";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { useProductCategories } from "@/app/hooks/useProductCategories";
import { useProducts } from "@/app/hooks/useProducts";
import { IoAddSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";
import NewProductForm from "./components/NewProductForm";
import CategoryProductSelector from "./components/CategoryProductSelector";

export default function ProductsPage() {
  const { activeEstablishment } = useEstablishment();
  const { linkedCategories, loading, error, refetch } = useProductCategories(
    activeEstablishment?.id,
  );

  const { createProduct } = useProducts(activeEstablishment?.id);

  const router = useRouter();

  const [showOptions, setShowOptions] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);

  // estados del formulario
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [costPrice, setCostPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  console.log("products: ", linkedCategories)

  if (loading) return <p>Cargando categorías...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const noCategories = linkedCategories.length === 0;
  const noProducts =
    !noCategories &&
    linkedCategories.every((cat) => !cat.products || cat.products.length === 0);

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
    setShowProductForm(false);
    await refetch(); // refresca categorías y productos
  };

  return (
    <div className="p-6 space-y-6">
      {noCategories ? (
        <p className="text-gray-500 italic">
          No hay categorías creadas aún. Es necesario crear categorías para
          poder agregar productos.
        </p>
      ) : noProducts && !showProductForm ? (
        <p className="text-gray-500 italic">
          Aún no se han agregado productos...
        </p>
      ) : (
        !showProductForm && (
          <CategoryProductSelector linkedCategories={linkedCategories} />
        )
      )}

      {/* Popup de opciones */}
      {showOptions && !showProductForm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-70 flex items-center justify-center z-50">
          <div className="border border-pink-500 bg-darkBrandBlue text-white rounded-lg shadow-lg p-6 space-y-3 w-80">
            <p className="font-bold text-center">¿Qué deseas crear?</p>

            <button
              onClick={() => {
                setShowOptions(false);
                router.push("products/new-category");
              }}
              className="w-full px-3 py-2 bg-pink-500 rounded hover:bg-pink-600"
            >
              Nueva categoría
            </button>

            <button
              onClick={() => {
                setShowOptions(false);
                setShowProductForm(true); // 👉 cerramos popup y mostramos form inline
              }}
              className="w-full px-3 py-2 bg-pink-500 rounded hover:bg-pink-600"
            >
              Nuevo producto
            </button>

            <button
              onClick={() => setShowOptions(false)}
              className="w-full px-3 py-2 bg-gray-400 rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Formulario inline */}
      {showProductForm && (
        <NewProductForm
          linkedCategories={linkedCategories}
          onCancel={() => setShowProductForm(false)}
          onSave={handleCreateProduct}
        />
      )}

      <button
        onClick={() => setShowOptions(true)}
        className="fixed bottom-20 right-6 p-2 rounded-full bg-pink-500 text-white shadow-md shadow-black hover:bg-pink-600 transition-colors"
      >
        <IoAddSharp className="text-3xl " />
      </button>
    </div>
  );
}
