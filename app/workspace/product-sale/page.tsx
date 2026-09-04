"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { useProductCategories } from "@/app/hooks/useProductCategories";
import { useProductSales } from "@/app/hooks/useProductSales";
import { AiOutlineDelete, AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import {
  FiCheckCircle,
  FiSearch,
  FiShoppingCart,
  FiX,
  FiAlertCircle,
  FiPlusCircle,
  FiFolderPlus,
} from "react-icons/fi";

export default function SalesPage() {
  const router = useRouter();
  const { activeEstablishment } = useEstablishment();
  const { linkedCategories, loading, error, refetch } = useProductCategories(
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
      stock: number;
    }[]
  >([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Estado para la alerta de stock
  const [stockAlert, setStockAlert] = useState<{
    message: string;
    type: "out_of_stock" | "max_reached";
  } | null>(null);

  // Helper para mostrar la alerta temporalmente arriba del carrito
  const triggerStockAlert = (
    message: string,
    type: "out_of_stock" | "max_reached",
  ) => {
    setStockAlert({ message, type });
    setTimeout(() => {
      setStockAlert(null);
    }, 2500);
  };

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

  const totalProducts = useMemo(() => {
    return linkedCategories.reduce(
      (acc, cat) => acc + (cat.products?.length || 0),
      0,
    );
  }, [linkedCategories]);

  // Manejo de clics en el catálogo
  const handleSelectProduct = (product: any) => {
    // 1. Alerta: Producto sin stock (deshabilitado/agotado)
    if (product.stock <= 0) {
      triggerStockAlert(
        `"${product.name}" está agotado y no tiene stock disponible.`,
        "out_of_stock",
      );
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        // 2. Alerta: Intento de superar el stock disponible
        if (existing.quantity >= product.stock) {
          triggerStockAlert(
            `No puedes agregar más de ${product.stock} un. de "${product.name}" (Stock máximo alcanzado).`,
            "max_reached",
          );
          return prev;
        }

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
          stock: product.stock,
        },
      ];
    });
  };

  // Manejo de incremento desde los botones (+) dentro del carrito
  const incrementQuantity = (id: string) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (item.quantity >= item.stock) {
            triggerStockAlert(
              `Alcanzaste el límite de stock disponible (${item.stock} un.) para "${item.name}".`,
              "max_reached",
            );
            return item;
          }
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      }),
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
    await refetch();
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

  if (!linkedCategories || linkedCategories.length === 0) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <div className="my-8 p-6 bg-white/5 border border-white/10 rounded-2xl text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 mx-auto rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
            <FiAlertCircle className="text-3xl" />
          </div>

          <h3 className="text-xl font-bold text-white">
            Aún no tienes categorías de productos
          </h3>

          <p className="text-sm text-gray-300 leading-relaxed">
            Para comenzar a registrar ventas, primero necesitas crear al menos una categoría de productos.
          </p>

          <button
            type="button"
            onClick={() => router.push("/workspace/commercial/products/new-category")}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-pink-500/25 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-sm mt-2"
          >
            <FiFolderPlus className="text-lg" />
            <span>Crear mi primera categoría</span>
          </button>
        </div>
      </div>
    );
  }

  if (totalProducts === 0) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <div className="my-8 p-6 bg-white/5 border border-white/10 rounded-2xl text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 mx-auto rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
            <FiAlertCircle className="text-3xl" />
          </div>

          <h3 className="text-xl font-bold text-white">
            Aún no has agregado productos
          </h3>

          <p className="text-sm text-gray-300 leading-relaxed">
            Ya tienes categorías disponibles, pero necesitas crear al menos un producto para empezar a vender.
          </p>

          <div className="flex flex-col gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => router.push("/workspace/commercial/products/new-product")}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-pink-500/25 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <FiPlusCircle className="text-lg" />
              <span>Crear mi primer producto</span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/workspace/commercial/products/new-category")}
              className="w-full bg-cyan-950/60 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <FiFolderPlus className="text-base" />
              <span>Agregar otra categoría</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col p-6 sm:p-4 max-w-md mx-auto overflow-hidden pb-20">
      
      {/* ⚠️ ALERTA DE STOCK EN EL FLUJO (Ubicada justo arriba del carrito) */}
      {stockAlert && (
        <div className="mb-3 shrink-0 transition-all duration-200">
          <div
            className={`p-3 rounded-xl border flex items-start gap-2.5 shadow-lg ${
              stockAlert.type === "out_of_stock"
                ? "bg-red-950/40 border-red-500/50 text-red-200"
                : "bg-amber-950/40 border-amber-500/50 text-amber-200"
            }`}
          >
            <FiAlertCircle
              className={`text-base shrink-0 mt-0.5 ${
                stockAlert.type === "out_of_stock"
                  ? "text-red-400"
                  : "text-amber-400"
              }`}
            />
            <div className="flex-1 text-xs leading-tight">
              <p className="font-bold mb-0.5">
                {stockAlert.type === "out_of_stock"
                  ? "Producto Agotado"
                  : "Stock Máximo Alcanzado"}
              </p>
              <p className="opacity-90">{stockAlert.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* 1. SECCIÓN: Carrito de Venta */}
      {cart.length > 0 && (
        <section className="bg-darkBrandBlue border border-gray-700/80 rounded-2xl p-4 shadow-2xl space-y-3 shrink-0 mb-3">
          <div className="flex items-center justify-between border-b border-gray-700/60 pb-2">
            <div className="flex items-center gap-2 text-sm text-white font-bold">
              <FiShoppingCart className="text-pink-500 text-base" />
              <span className="text-base">Venta en Curso</span>
            </div>
            <span className="text-xs bg-pink-500/20 text-pink-300 px-2.5 py-0.5 rounded-full font-semibold">
              {cart.reduce((acc, i) => acc + i.quantity, 0)} ítems
            </span>
          </div>

          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border px-3 py-2 rounded-xl text-xs gap-2 transition bg-luminiBrandBlue/50 border-gray-700/50"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate text-xs leading-snug">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    {item.brand && (
                      <p className="text-[10px] text-gray-400">{item.brand}</p>
                    )}
                    <span className="text-[10px] text-gray-400">
                      (Stock: {item.stock})
                    </span>
                  </div>
                </div>

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

          <div className="pt-2.5 border-t border-gray-700/60 flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Total a cobrar</span>
              <span className="text-xl font-black text-pink-500">
                ${totalCart.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleConfirmSale}
              className="flex-1 py-2.5 px-3 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 bg-linear-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 active:scale-[0.98]"
            >
              <FiCheckCircle className="text-base" />
              Confirmar Venta
            </button>
          </div>
        </section>
      )}

      {/* 2. BUSCADOR */}
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

      {/* 3. CATÁLOGO DE PRODUCTOS */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2">
        {cart.length === 0 && (
          <p className="text-center text-xs text-gray-400 py-1">
            Selecciona productos para iniciar la venta
          </p>
        )}

        {filteredProducts.map((prod) => {
          const isOutOfStock = prod.stock <= 0;

          return (
            <div
              key={prod.id}
              onClick={() => handleSelectProduct(prod)}
              className={`group bg-luminiBrandBlue border rounded-xl px-3.5 py-3 transition flex items-center justify-between shadow-sm cursor-pointer active:scale-[0.99] ${
                isOutOfStock
                  ? "opacity-60 border-red-900/30 hover:border-red-500/50"
                  : "hover:bg-darkBrandBlue hover:border-pink-500/50 border-gray-700/50"
              }`}
            >
              <div className="flex flex-col pr-2 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-pink-400 bg-pink-500/10 px-1.5 py-0.2 rounded w-fit">
                    {prod.categoryName}
                  </span>
                  <span
                    className={`text-[10px] font-medium ${
                      isOutOfStock ? "text-red-400 font-bold" : "text-gray-400"
                    }`}
                  >
                    Stock: {prod.stock}
                  </span>
                </div>
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
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                    isOutOfStock
                      ? "bg-red-950/40 text-red-400 border border-red-800/40"
                      : "text-gray-300 bg-gray-800 group-hover:bg-pink-600 group-hover:text-white"
                  }`}
                >
                  <AiOutlinePlus className="text-xs" />{" "}
                  {isOutOfStock ? "Agotado" : "Agregar"}
                </span>
              </div>
            </div>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="text-center py-6 text-xs text-gray-500">
            No se encontraron productos coincidentes.
          </div>
        )}
      </div>

      {/* POPUP DE ÉXITO */}
      {showSuccessPopup && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50 p-4">
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