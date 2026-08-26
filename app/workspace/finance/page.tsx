"use client";

import { RiTeamLine } from "react-icons/ri";
import { useNavigation } from "@/app/lib/useNavegation";
import { LiaHandScissors } from "react-icons/lia";
import { IoBagOutline, IoStorefrontOutline } from "react-icons/io5";
import { MdBalance, MdOutlineElectricBolt } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";

export default function FinacePage() {
  const { goTo } = useNavigation();

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4 animate-slideIn">
      {/* Encabezado */}
      <div className="text-center py-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Menú de <span className="text-pink-400">Finanzas</span>
        </h1>
      </div>

      {/* Grid de Accesos */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {/* Staff */}
        <button
          onClick={() => goTo("/workspace/finance/staff")}
          className="flex flex-col items-center justify-center p-4 bg-luminiBrandBlue hover:bg-pink-600/10 border border-pink-600/30 hover:border-pink-500 rounded-2xl h-32 transition-all duration-200 shadow-lg group"
        >
          <RiTeamLine className="w-10 h-10 text-pink-400 group-hover:scale-110 transition-transform duration-200" />
          <p className="text-base font-semibold text-white mt-2">Staff</p>
        </button>

        {/* Productos */}
        <button
          onClick={() => goTo("/workspace/finance/products")}
          className="flex flex-col items-center justify-center p-4 bg-luminiBrandBlue hover:bg-pink-600/10 border border-pink-600/30 hover:border-pink-500 rounded-2xl h-32 transition-all duration-200 shadow-lg group"
        >
          <IoBagOutline className="w-10 h-10 text-pink-400 group-hover:scale-110 transition-transform duration-200" />
          <p className="text-base font-semibold text-white mt-2">Productos</p>
        </button>

        {/* Tienda */}
        <button
          onClick={() => goTo("/workspace/finance/market")}
          className="flex flex-col items-center justify-center p-4 bg-luminiBrandBlue hover:bg-pink-600/10 border border-pink-600/30 hover:border-pink-500 rounded-2xl h-32 transition-all duration-200 shadow-lg group"
        >
          <IoStorefrontOutline className="w-10 h-10 text-pink-400 group-hover:scale-110 transition-transform duration-200" />
          <p className="text-base font-semibold text-white mt-2">Tienda</p>
        </button>

        {/* Servicios */}
        <button
          onClick={() => goTo("/workspace/finance/services")}
          className="flex flex-col items-center justify-center p-4 bg-luminiBrandBlue hover:bg-pink-600/10 border border-pink-600/30 hover:border-pink-500 rounded-2xl h-32 transition-all duration-200 shadow-lg group"
        >
          <LiaHandScissors className="w-10 h-10 text-pink-400 group-hover:scale-110 transition-transform duration-200" />
          <p className="text-base font-semibold text-white mt-2">Servicios</p>
        </button>

        {/* Insumos */}
        <button
          onClick={() => goTo("/workspace/finance/supplies")}
          className="flex flex-col items-center justify-center p-4 bg-luminiBrandBlue hover:bg-pink-600/10 border border-pink-600/30 hover:border-pink-500 rounded-2xl h-32 transition-all duration-200 shadow-lg group"
        >
          <BsBoxSeam className="w-10 h-10 text-pink-400 group-hover:scale-110 transition-transform duration-200" />
          <p className="text-base font-semibold text-white mt-2">Insumos</p>
        </button>

        {/* Servicios básicos */}
        <button
          onClick={() => goTo("/workspace/finance/basic-services")}
          className="flex flex-col items-center justify-center p-4 bg-luminiBrandBlue hover:bg-pink-600/10 border border-pink-600/30 hover:border-pink-500 rounded-2xl h-32 transition-all duration-200 shadow-lg group"
        >
          <MdOutlineElectricBolt className="w-10 h-10 text-pink-400 group-hover:scale-110 transition-transform duration-200" />
          <p className="text-sm font-semibold text-white mt-2 text-center">Servicios básicos</p>
        </button>

        {/* Balance */}
        <button
          onClick={() => goTo("/workspace/finance/balance")}
          className="flex flex-col items-center justify-center p-4 bg-luminiBrandBlue hover:bg-pink-600/10 border border-pink-600/30 hover:border-pink-500 rounded-2xl h-28 col-span-2 transition-all duration-200 shadow-lg group"
        >
          <MdBalance className="w-10 h-10 text-pink-400 group-hover:scale-110 transition-transform duration-200" />
          <p className="text-base font-semibold text-white mt-1">Balance General</p>
        </button>
      </div>
    </div>
  );
}