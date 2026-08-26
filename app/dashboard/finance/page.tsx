"use client";

import { RiTeamLine } from "react-icons/ri";
import { useNavigation } from "@/app/lib/useNavegation";
import {  LiaHandScissors } from "react-icons/lia";
import { IoBagOutline, IoStorefrontOutline } from "react-icons/io5";
import { MdBalance, MdOutlineElectricBolt } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";

export default function FinacePage() {
  const { goTo } = useNavigation();

  return (
    <div className="grid grid-cols-2 gap-2 p-4 w-full">
      {/* Staff */}
      <button
        onClick={() => goTo("/dashboard/finance/staff")}
        className="flex flex-col items-center justify-center px-2 py-6 
                   bg-luminiBrandBlue hover:bg-gray-700 border border-gray-600 
                   rounded-md w-full h-32"
      >
        <RiTeamLine className="w-12 h-12 text-white" />
        <p className="text-lg font-bold text-white">Staff</p>
      </button>

      {/* Productos */}
      <button
        onClick={() => goTo("/dashboard/finance/products")}
        className="flex flex-col items-center justify-center px-2 py-6 
                   bg-luminiBrandBlue hover:bg-gray-700 border border-gray-600 
                   rounded-md w-full h-32"
      >
        <IoBagOutline className="w-12 h-12 text-white" />
        <p className="text-lg font-bold text-white">Productos</p>
      </button>

      {/* Market */}
      <button
        onClick={() => goTo("/dashboard/finance/market")}
        className="flex flex-col items-center justify-center px-2 py-6 
                   bg-luminiBrandBlue hover:bg-gray-700 border border-gray-600 
                   rounded-md w-full h-32"
      >
        <IoStorefrontOutline className="w-12 h-12 text-white" />
        <p className="text-lg font-bold text-white">Tienda</p>
      </button>

      {/* Servicios */}
      <button
        onClick={() => goTo("/dashboard/finance/services")}
        className="flex flex-col items-center justify-center px-2 py-6 
                   bg-luminiBrandBlue hover:bg-gray-700 border border-gray-600 
                   rounded-md w-full h-32"
      >
        <LiaHandScissors className="w-12 h-12 text-white" />
        <p className="text-lg font-bold text-white">Servicios</p>
      </button>

      <button
        onClick={() => goTo("/dashboard/finance/supplies")}
        className="flex flex-col items-center justify-center px-2 py-6 
                         bg-luminiBrandBlue hover:bg-gray-700 border border-gray-600 
                         rounded-md w-full h-32"
      >
        <BsBoxSeam className="w-12 h-12 text-white" />
        <p className="text-lg font-bold text-white">Insumos</p>
      </button>

      {/* Servicios básicos (incluye alquiler) */}
      <button
        onClick={() => goTo("/dashboard/finance/basic-services")}
        className="flex flex-col items-center justify-center px-2 py-6 
                         bg-luminiBrandBlue hover:bg-gray-700 border border-gray-600 
                         rounded-md w-full h-32"
      >
        <MdOutlineElectricBolt className="w-12 h-12 text-white" />

        <p className="text-sm font-bold text-white">Servicios básicos</p>
      </button>

      {/* Total */}
      <button
        onClick={() => goTo("/dashboard/finance/balance")}
        className="flex flex-col items-center justify-center px-2 py-6 
                   bg-luminiBrandBlue hover:bg-gray-700 border border-gray-600 
                   rounded-md w-full h-32 col-span-2"
      >
        <MdBalance className="w-12 h-12 text-white" />
        <p className="text-lg font-bold text-white">Balance</p>
      </button>
    </div>
  );
}
