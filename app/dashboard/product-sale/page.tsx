"use client";

import { useState, useMemo } from "react";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { useProductCategories } from "@/app/hooks/useProductCategories";
import { useProductSales } from "@/app/hooks/useProductSales";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { AiOutlineDelete } from "react-icons/ai";
import { FiCheckCircle } from "react-icons/fi";

export default function SalesPage() {
  const { activeEstablishment } = useEstablishment();
  const { linkedCategories, loading, error } = useProductCategories(
    activeEstablishment?.id,
  );
  const { createSale } = useProductSales(activeEstablishment?.id);

  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<
    {
      id: string;
      name: string;
      brand: string;
      price: number;
      quantity: number;
    }[]
  >([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Filtrado dinámico por categoría o nombre
  const filteredProducts = useMemo(() => {
    const allProducts = linkedCategories.flatMap((cat) =>
      (cat.products || []).map((p) => ({ ...p, categoryName: cat.name })),
    );

    if (!search.trim()) return allProducts;

    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [linkedCategories, search]);

  // Agregar producto al carrito (incrementa cantidad si ya existe)
  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.salePrice,
          quantity: 1,
        },
      ];
    });
  };

  // Incrementar cantidad
  const incrementQuantity = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  // Decrementar cantidad
  const decrementQuantity = (id: string) => {
    setCart(
      (prev) =>
        prev
          .map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
          )
          .filter((item) => item.quantity > 0), // si llega a 0 se elimina
    );
  };

  // Quitar producto del carrito
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Confirmar venta
  const handleConfirmSale = async () => {
    if (!activeEstablishment) return;

    const dto = {
      establishmentId: activeEstablishment.id,
      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
    };

    await createSale(dto);
    setCart([]); // limpiar carrito
    setShowSuccessPopup(true); // 👈 mostrar popup

    // Ocultar popup automáticamente después de 2 segundos
    setTimeout(() => setShowSuccessPopup(false), 2000);
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Carrito de venta */}
      {cart.length > 0 && (
        <div className="pt-4 border-b pb-4">
          <h2 className="text-2xl font-bold mb-4">Venta en curso</h2>
          <ul className="space-y-2">
            {cart.map((item) => (
              <li key={item.id} className="flex w-full">
                {/* Bloque info producto */}
                <div className="flex justify-between items-center border rounded p-2 bg-white text-black text-sm w-full">
                  <div className="flex flex-col">
                    <span className="">{item.name}</span>
                    <div className="flex gap-4">
                      <span>{item.brand}</span>
                      <span className="font-bold">x {item.quantity}</span>
                    </div>
                  </div>

                  <span className="font-bold text-lg">
                    ${item.price * item.quantity}
                  </span>
                </div>

                {/* Controles de cantidad y eliminar */}
                <div className="flex items-center gap-2 ml-2">
                  {/* Botones de cantidad en columna */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => incrementQuantity(item.id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <IoIosArrowUp className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => decrementQuantity(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <IoIosArrowDown className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Botón eliminar */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <AiOutlineDelete className="w-8 h-8" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-4 font-bold">
            <span>Total:</span>
            <span>
              ${cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}
            </span>
          </div>
          <button
            onClick={handleConfirmSale}
            className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Confirmar Venta
          </button>
        </div>
      )}

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar por categoría o producto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded px-3 py-2 shadow-sm"
      />

      {/* Lista de productos filtrados */}
      <div className="flex flex-col gap-2">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            onClick={() => addToCart(prod)}
            className="bg-luminiBrandBlue shadow-md rounded-lg py-2 px-4 cursor-pointer hover:shadow-lg transition flex items-center justify-between"
          >
            <div>
              <h2 className="font-semibold text-sm">{prod.name}</h2>
              <p className="text-sm text-gray-300">{prod.brand}</p>
              <p className="text-xs text-gray-500">{prod.categoryName}</p>
            </div>
            <p className="text-pink-600 text-lg font-bold mt-2">
              ${prod.salePrice}
            </p>
          </div>
        ))}
      </div>

      {/* Popup de éxito */}
      {showSuccessPopup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-70 flex items-center justify-center z-50">
          <div className="border border-green-500 bg-darkBrandBlue text-white rounded-lg shadow-lg p-6 flex items-center space-x-3">
            <FiCheckCircle className="text-green-400 text-3xl" />
            <span className="font-semibold">¡Venta registrada con éxito!</span>
          </div>
        </div>
      )}
    </div>
  );
}
