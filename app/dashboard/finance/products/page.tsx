"use client";

import { useEstablishment } from "@/app/context/EstablishmentContext";
import { useFinanceIncomeProduct } from "@/app/hooks/useFinanceIncomeProduct";
import { FiPlus } from "react-icons/fi";
import { IoMdTrendingDown, IoMdTrendingUp } from "react-icons/io";
import { TbMoneybag } from "react-icons/tb";

export default function FinanceDashboard() {
  const { activeEstablishment } = useEstablishment();
  const { data, loading, error } = useFinanceIncomeProduct(
    activeEstablishment?.id,
  );

  if (loading) return <p>Cargando ingresos...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col gap-2 text-lg">
        <div className="bg-luminiBrandBlue rounded p-4 flex items-center gap-3">
          <IoMdTrendingUp className="text-green-600 w-10 h-10 " />
          <p className="font-bold">Ingresos: <span className="text-2xl font-light">$ {data?.totalIncome}</span></p>
        </div>
        <div className="bg-luminiBrandBlue rounded p-4 flex items-center gap-3">
          <IoMdTrendingDown className="text-red-600 w-10 h-10" />
          <p className="font-bold">Costos: <span className="text-2xl font-light">$ {data?.totalCost}</span></p>
        </div>
        <div className="bg-luminiBrandBlue rounded p-4 flex items-end gap-3">
          <TbMoneybag className="w-10 h-10 text-green-600" />
          <p className="font-bold">Ganancia: <span className="text-2xl font-light">$ {data?.margin}</span></p>
        </div>
      </div>
    </div>
  );
}
