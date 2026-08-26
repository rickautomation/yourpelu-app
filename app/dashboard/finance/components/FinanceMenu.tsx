"use client";

import {
  FaBoxOpen,
  FaShoppingBag,
  FaHandHoldingUsd,
  FaWater,
} from "react-icons/fa";
import { MdOutlineElectricBolt, MdBalance } from "react-icons/md";
import { RiTeamLine } from "react-icons/ri";
import { FiPieChart } from "react-icons/fi";
import { useNavigation } from "@/app/lib/useNavegation";

export default function FinanceMenu() {
  const { goTo } = useNavigation();

  return (
    <div className="grid grid-cols-2 gap-2 py-4 w-full">
      <button
        onClick={() => goTo("/dashboard/finance/staff")}
        className="flex flex-col items-center justify-center px-2 py-6 bg-luminiBrandBlue hover:bg-gray-700 border border-gray-600 rounded-md w-full h-32"
      >
        <FaHandHoldingUsd className="w-12 h-12" />
        <p className="text-lg font-bold">Ingresos Staff</p>
      </button>

      <button
        onClick={() => goTo("/dashboard/finance/insumos")}
        className="flex flex-col items-center justify-center px-2 py-6 bg-luminiBrandBlue hover:bg-gray-700 border border-gray-600 rounded-md w-full h-32"
      >
        <FaBoxOpen className="w-12 h-12" />
        <p className="text-lg font-bold">Insumos</p>
      </button>

      <button
        onClick={() => goTo("/dashboard/finance/productos")}
        className="flex flex-col items-center justify-center px-2 py-6 bg-luminiBrandBlue hover:bg-gray-700 border border-gray-600 rounded-md w-full h-32"
      >
        <FaShoppingBag className="w-12 h-12" />
        <p className="text-lg font-bold">Productos</p>
      </button>

      <button
        onClick={() => goTo("/dashboard/finance/servicios-basicos")}
        className="flex flex-col items-center justify-center px-2 py-6 bg-luminiBrandBlue hover:bg-gray-700 border border-gray-600 rounded-md w-full h-32"
      >
        <MdOutlineElectricBolt className="w-12 h-12" />
        <p className="text-lg font-bold">Servicios básicos</p>
      </button>

      <button
        onClick={() => goTo("/dashboard/finance/balance")}
        className="flex flex-col items-center justify-center px-2 py-6 bg-luminiBrandBlue hover:bg-gray-700 border border-gray-600 rounded-md w-full h-32 col-span-2"
      >
        <MdBalance className="w-12 h-12" />
        <p className="text-lg font-bold">Balance</p>
      </button>
    </div>
  );
}
