"use client";

import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 text-white p-6">
      {/* Apartado de productos */}
      <div className="rounded bg-luminiBrandBlue p-4">
        <h2 className="text-2xl font-semibold mb-2">Productos</h2>
        <p className="mb-2 text-sm">
          Administrá tus productos cargando nombre, stock, precio de costo y
          precio de venta. Además, podés crear categorías propias que se ajusten
          a tu local o usar el catálogo de categorías predeterminadas de
          YourPelu.
        </p>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => router.push("/workspace/commercial/products")}
            className="px-4 py-2 rounded bg-pink-400 hover:bg-pink-500 transition-colors"
          >
            Agregar producto
          </button>
        </div>
      </div>
      {/* Apartado de venta */}
      <div className="rounded bg-luminiBrandBlue p-4">
        <h1 className="text-2xl font-bold mb-2">Venta de productos</h1>
        <p className="mb-2 text-sm">
          Gestioná la venta de artículos afines al salón como pomadas, shampoos
          y ceras. Tenés control de stock, precio de venta y precio de costo,
          además de la posibilidad de organizarlos en categorías.
        </p>
        <div className="flex justify-end mt-2">
          <button
            onClick={() => router.push("/workspace/product-sale")}
            className="px-4 py-2 rounded bg-pink-400 hover:bg-pink-500 transition-colors"
          >
            Hacer venta
          </button>
        </div>
      </div>
    </div>
  );
}
