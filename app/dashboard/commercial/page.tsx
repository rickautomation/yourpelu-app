"use client";

import { PiCalendarDots } from "react-icons/pi";
import { LiaBullhornSolid, LiaHandScissors } from "react-icons/lia";
import {
  IoBagOutline,
  IoInformationCircleOutline,
  IoStorefrontOutline,
} from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { BiCategoryAlt } from "react-icons/bi";
import { useNavigation } from "@/app/lib/useNavegation";

export default function CommercialPage() {
  const { goTo } = useNavigation();
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-2 py-4 w-full">
        <button
          onClick={() => goTo("/dashboard/commercial/offerings")}
          className="flex flex-col items-center justify-center px-2 py-6 bg-luminiBrandBlue hover:bg-gray-700 border border-b border-gray-600 rounded-md w-full h-32"
        >
          <LiaHandScissors className="h-12 w-12" />
          <p className="text-lg font-bold">Servicios</p>
        </button>
        <button
          onClick={() => goTo("/dashboard/commercial/appointments")}
          className="flex flex-col items-center justify-center px-2 py-6 bg-luminiBrandBlue hover:bg-gray-700 border border-b border-gray-600 rounded-md w-full h-32"
        >
          <PiCalendarDots className="h-12 w-12" />
          <p className="text-lg font-bold">Turnos</p>
        </button>
        <button
          onClick={() => goTo("/dashboard/commercial/marketing")}
          className="flex flex-col items-center justify-center px-2 py-6 bg-luminiBrandBlue hover:bg-gray-700 border border-b border-gray-600 rounded-md w-full h-32"
        >
          <LiaBullhornSolid className="h-12 w-12" />
          <p className="text-lg font-bold">Marketing</p>
        </button>
        <button
          onClick={() => goTo("/dashboard/commercial/products")}
          className="flex flex-col items-center justify-center px-2 py-6 bg-luminiBrandBlue hover:bg-gray-700 border border-b border-gray-600 rounded-md w-full h-32"
        >
          <IoBagOutline className="h-12 w-12" />
          <p className="text-lg font-bold">Productos</p>
        </button>
        <button
          onClick={() => goTo("/dashboard/commercial/market")}
          className="flex flex-col items-center justify-center px-2 py-6 bg-luminiBrandBlue hover:bg-gray-700 border border-b border-gray-600 rounded-md w-full h-32"
        >
          <IoStorefrontOutline className="h-12 w-12" />
          <p className="text-lg font-bold">Tienda</p>
        </button>
        <button
          onClick={() => goTo("/dashboard/commercial/clients")}
          className="flex flex-col items-center justify-center px-2 py-6 bg-luminiBrandBlue hover:bg-gray-700 border border-b border-gray-600 rounded-md w-full h-32"
        >
          <LuUsers className="h-12 w-12" />
          <p className="text-lg font-bold">Clientes</p>
        </button>
        <button
          onClick={() => goTo("/dashboard/commercial/info")}
          className="flex flex-col items-center justify-center px-2 py-6 bg-luminiBrandBlue hover:bg-gray-700 border border-b border-gray-600 rounded-md w-full h-32"
        >
          <IoInformationCircleOutline className="h-12 w-12" />
          <p className="text-lg font-bold">Info</p>
        </button>
      </div>
    </div>
  );
}
