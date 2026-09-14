"use client";

import { PiCalendarDots } from "react-icons/pi";
import { LiaBullhornSolid, LiaHandScissors } from "react-icons/lia";
import {
  IoBagOutline,
  IoInformationCircleOutline,
  IoStorefrontOutline,
} from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { useNavigation } from "@/app/lib/useNavegation";
import { BsBoxSeam } from "react-icons/bs";

export default function CommercialPage() {
  const { goTo } = useNavigation();

  return (
    <div className="px-4 py-2 max-w-4xl mx-auto space-y-4 animate-slideIn">
      {/* Encabezado */}
      <div className="text-center pb-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Menú <span className="text-pink-400">Comercial</span>
        </h1>
      </div>

      {/* Grid de Accesos */}
      <div className="grid grid-cols-2 gap-2 w-full">
        {/* Servicios */}
        <button
          onClick={() => goTo("/workspace/commercial/offerings")}
          className="flex flex-col items-center justify-center p-4 bg-luminiBrandBlue hover:bg-pink-600/10 border border-pink-600/30 hover:border-pink-500 rounded-2xl h-32 transition-all duration-200 shadow-lg group"
        >
          <LiaHandScissors className="w-10 h-10 text-pink-400 group-hover:scale-110 transition-transform duration-200" />
          <p className="text-base font-semibold text-white mt-2">Servicios</p>
        </button>

        {/* Turnos */}
        <button
          onClick={() => goTo("/workspace/commercial/appointments")}
          className="flex flex-col items-center justify-center p-4 bg-luminiBrandBlue hover:bg-pink-600/10 border border-pink-600/30 hover:border-pink-500 rounded-2xl h-32 transition-all duration-200 shadow-lg group"
        >
          <PiCalendarDots className="w-10 h-10 text-pink-400 group-hover:scale-110 transition-transform duration-200" />
          <p className="text-base font-semibold text-white mt-2">Turnos</p>
        </button>

        {/* Marketing */}
        <button
          onClick={() => goTo("/workspace/commercial/marketing")}
          className="flex flex-col items-center justify-center p-4 bg-luminiBrandBlue hover:bg-pink-600/10 border border-pink-600/30 hover:border-pink-500 rounded-2xl h-32 transition-all duration-200 shadow-lg group"
        >
          <LiaBullhornSolid className="w-10 h-10 text-pink-400 group-hover:scale-110 transition-transform duration-200" />
          <p className="text-base font-semibold text-white mt-2">Marketing</p>
        </button>

        {/* Productos */}
        <button
          onClick={() => goTo("/workspace/commercial/products")}
          className="flex flex-col items-center justify-center p-4 bg-luminiBrandBlue hover:bg-pink-600/10 border border-pink-600/30 hover:border-pink-500 rounded-2xl h-32 transition-all duration-200 shadow-lg group"
        >
          <IoBagOutline className="w-10 h-10 text-pink-400 group-hover:scale-110 transition-transform duration-200" />
          <p className="text-base font-semibold text-white mt-2">Productos</p>
        </button>

        {/* Tienda */}
        {/* <button
          onClick={() => goTo("/workspace/commercial/market")}
          className="flex flex-col items-center justify-center p-4 bg-luminiBrandBlue hover:bg-pink-600/10 border border-pink-600/30 hover:border-pink-500 rounded-2xl h-32 transition-all duration-200 shadow-lg group"
        >
          <IoStorefrontOutline className="w-10 h-10 text-pink-400 group-hover:scale-110 transition-transform duration-200" />
          <p className="text-base font-semibold text-white mt-2">Tienda</p>
        </button> */}

        {/* Insumos */}
        <button
          onClick={() => goTo("/workspace/commercial/supplies")}
          className="flex flex-col items-center justify-center p-4 bg-luminiBrandBlue hover:bg-pink-600/10 border border-pink-600/30 hover:border-pink-500 rounded-2xl h-32 transition-all duration-200 shadow-lg group"
        >
          <BsBoxSeam className="w-10 h-10 text-pink-400 group-hover:scale-110 transition-transform duration-200" />
          <p className="text-base font-semibold text-white mt-2">Insumos</p>
        </button>

        {/* Clientes */}
        <button
          onClick={() => goTo("/workspace/commercial/clients")}
          className="flex flex-col items-center justify-center p-4 bg-luminiBrandBlue hover:bg-pink-600/10 border border-pink-600/30 hover:border-pink-500 rounded-2xl h-32 transition-all duration-200 shadow-lg group"
        >
          <LuUsers className="w-10 h-10 text-pink-400 group-hover:scale-110 transition-transform duration-200" />
          <p className="text-base font-semibold text-white mt-2">Clientes</p>
        </button>

        {/* Info */}
        <button
          onClick={() => goTo("/workspace/commercial/info")}
          className="flex flex-col items-center justify-center p-4 bg-luminiBrandBlue hover:bg-pink-600/10 border border-pink-600/30 hover:border-pink-500 rounded-2xl h-32 col-span-2 transition-all duration-200 shadow-lg group"
        >
          <IoInformationCircleOutline className="w-10 h-10 text-pink-400 group-hover:scale-110 transition-transform duration-200" />
          <p className="text-base font-semibold text-white mt-1">Información</p>
        </button>
      </div>
    </div>
  );
}
