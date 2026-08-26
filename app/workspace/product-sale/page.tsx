"use client";

import { useState, useMemo } from "react";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { useProductCategories } from "@/app/hooks/useProductCategories";
import { useProductSales } from "@/app/hooks/useProductSales";
import { AiOutlineDelete, AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { FiCheckCircle, FiSearch, FiShoppingCart, FiX } from "react-icons/fi";

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

  // Filtrado dinámico por categoría, marca o nombre
  const filteredProducts = useMemo(() => {
    const allProducts = linkedCategories.flatMap((cat) =>
      (cat.products || []).map((p) => ({ ...p, categoryName: cat.name })),
    );

    if (!search.trim()) return allProducts;

    const query = search.toLowerCase();

    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.categoryName.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query),
    );
  }, [linkedCategories, search]);

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
          brand: product.brand || "",
          price: product.salePrice,
          quantity: 1,
        },
      ];
    });
  };

  const incrementQuantity = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decrementQuantity = (id: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalCart = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const handleConfirmSale = async () => {
    if (!activeEstablishment || cart.length === 0) return;

    const dto = {
      establishmentId: activeEstablishment.id,
      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
    };

    await createSale(dto);
    setCart([]);
    setShowSuccessPopup(true);

    setTimeout(() => setShowSuccessPopup(false), 2000);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center p-8 text-sm text-gray-400">
        Cargando catálogo...
      </div>
    );

  if (error)
    return (
      <div className="p-4 text-xs text-red-400 bg-red-950/30 border border-red-800 rounded-lg">
        Error al cargar los productos: {error}
      </div>
    );

  return (
    /* h-[100dvh] bloquea el scroll del cuerpo principal de la página */
    <div className="w-full flex flex-col p-3 sm:p-4 max-w-md mx-auto overflow-hidden pb-20">
      
      {/* 1. SECCIÓN: Carrito de Venta (Con Scroll propio si hay muchos elementos) */}
      {cart.length > 0 && (
        <section className="bg-darkBrandBlue border border-gray-700/80 rounded-2xl p-4 shadow-2xl space-y-3 shrink-0 mb-3">
          {/* Cabecera del carrito */}
          <div className="flex items-center justify-between border-b border-gray-700/60 pb-2">
            <div className="flex items-center gap-2 text-sm text-white font-bold">
              <FiShoppingCart className="text-pink-500 text-base" />
              <span className="text-base">Venta en Curso</span>
            </div>
            <span className="text-xs bg-pink-500/20 text-pink-300 px-2.5 py-0.5 rounded-full font-semibold">
              {cart.reduce((acc, i) => acc + i.quantity, 0)} ítems
            </span>
          </div>

          {/* LISTA DEL CARRITO CON SCROLL PROPIO */}
          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-luminiBrandBlue/50 border border-gray-700/50 px-3 py-2 rounded-xl text-xs gap-2"
              >
                {/* Nombre y marca del producto */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate text-xs leading-snug">
                    {item.name}
                  </h3>
                  {item.brand && (
                    <p className="text-[10px] text-gray-400">{item.brand}</p>
                  )}
                </div>

                {/* Controles y Total */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center bg-gray-900/80 rounded-lg border border-gray-700/80">
                    <button
                      onClick={() => decrementQuantity(item.id)}
                      className="p-1.5 text-gray-400 hover:text-white transition"
                    >
                      <AiOutlineMinus className="w-3 h-3" />
                    </button>
                    <span className="px-1.5 font-bold text-white text-xs min-w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => incrementQuantity(item.id)}
                      className="p-1.5 text-gray-400 hover:text-white transition"
                    >
                      <AiOutlinePlus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="font-bold text-white text-xs min-w-[60px] text-right">
                    ${(item.price * item.quantity).toLocaleString()}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-400 transition p-0.5"
                    title="Eliminar"
                  >
                    <AiOutlineDelete className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total y Botón de Confirmar Venta */}
          <div className="pt-2.5 border-t border-gray-700/60 flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Total a cobrar</span>
              <span className="text-xl font-black text-pink-500">
                ${totalCart.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleConfirmSale}
              className="flex-1 py-2.5 px-3 bg-linear-to-r from-emerald-500 to-green-600 text-white font-bold text-xs rounded-xl shadow-lg hover:from-emerald-600 hover:to-green-700 active:scale-[0.98] transition flex items-center justify-center gap-1.5"
            >
              <FiCheckCircle className="text-base" />
              Confirmar Venta
            </button>
          </div>
        </section>
      )}

      {/* 2. BUSCADOR (Fijo en pantalla) */}
      <div className="relative shrink-0 mb-3">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="text"
          placeholder="Buscar por producto, marca o categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-8 py-2.5 bg-luminiBrandBlue/50 border border-gray-700 rounded-xl text-white text-xs placeholder-gray-400 focus:outline-none focus:border-pink-500 transition shadow-inner"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <FiX className="text-sm" />
          </button>
        )}
      </div>

      {/* 3. SECCIÓN DEL CATÁLOGO DE PRODUCTOS (Con Scroll independiente) */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2">
        {cart.length === 0 && (
          <p className="text-center text-xs text-gray-400 py-1">
            Selecciona productos para iniciar la venta
          </p>
        )}

        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            onClick={() => addToCart(prod)}
            className="group bg-luminiBrandBlue hover:bg-darkBrandBlue border border-gray-700/50 hover:border-pink-500/50 rounded-xl px-3.5 py-3 cursor-pointer transition flex items-center justify-between shadow-sm active:scale-[0.99]"
          >
            <div className="flex flex-col pr-2 min-w-0">
              <span className="text-[9px] uppercase tracking-wider font-semibold text-pink-400 bg-pink-500/10 px-1.5 py-0.2 rounded w-fit">
                {prod.categoryName}
              </span>
              <h3 className="font-semibold text-white text-sm truncate mt-0.5">
                {prod.name}
              </h3>
              {prod.brand && (
                <p className="text-xs text-gray-400 leading-none">
                  {prod.brand}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-pink-400 text-sm font-bold">
                ${prod.salePrice.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-gray-300 bg-gray-800 group-hover:bg-pink-600 group-hover:text-white px-2.5 py-1 rounded-lg transition flex items-center gap-1">
                <AiOutlinePlus className="text-xs" /> Agregar
              </span>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="text-center py-6 text-xs text-gray-500">
            No se encontraron productos.
          </div>
        )}
      </div>

      {/* POPUP DE ÉXITO */}
      {showSuccessPopup && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="border border-emerald-500/50 bg-darkBrandBlue text-white rounded-2xl shadow-2xl p-5 flex items-center space-x-3 max-w-xs animate-in fade-in zoom-in duration-200">
            <FiCheckCircle className="text-emerald-400 text-3xl shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-white">¡Venta Exitosa!</h4>
              <p className="text-xs text-gray-300">
                La transacción se registró correctamente.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}