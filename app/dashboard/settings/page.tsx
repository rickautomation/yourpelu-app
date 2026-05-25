"use client";

import { useEstablishment } from "@/app/context/EstablishmentContext";
import { AiOutlineRight } from "react-icons/ai";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { activeEstablishment } = useEstablishment();
  const router = useRouter();

  return (
    <div className="p-4 flex flex-col gap-3 text-xl">
      <p className="font-bold">{"Configuracion >"}</p>

      <div
        onClick={() => router.push(`/dashboard/settings/info`)}
        className="flex items-center justify-between rounded-md bg-luminiBrandBlue p-4 text-start cursor-pointer"
      >
        <p>Informacion</p>
        <div className="p-1 bg-ligthBrandBlue rounded-full">
          <AiOutlineRight />
        </div>
      </div>

      <div
        onClick={() => router.push(`/dashboard/settings/appointments`)}
        className="flex items-center justify-between rounded-md bg-luminiBrandBlue p-4 text-start cursor-pointer"
      >
        <p>Turnos</p>
        <div className="p-1 bg-ligthBrandBlue rounded-full">
          <AiOutlineRight />
        </div>
      </div>

      <div
        onClick={() => router.push(`/dashboard/settings/add-register`)}
        className="flex items-center justify-between rounded-md bg-luminiBrandBlue p-4 text-start cursor-pointer"
      >
        <p>Registro</p>
        <div className="p-1 bg-ligthBrandBlue rounded-full">
          <AiOutlineRight />
        </div>
      </div>

      <div
        onClick={() => router.push(`/dashboard/settings/reports`)}
        className="flex items-center justify-between rounded-md bg-luminiBrandBlue p-4 text-start cursor-pointer"
      >
        <p>Reportes</p>
        <div className="p-1 bg-ligthBrandBlue rounded-full">
          <AiOutlineRight />
        </div>
      </div>

      <div
        onClick={() => router.push(`/dashboard/settings/cash-closing`)}
        className="flex items-center justify-between rounded-md bg-luminiBrandBlue p-4 text-start cursor-pointer"
      >
        <p>Cierre de caja</p>
        <div className="p-1 bg-ligthBrandBlue rounded-full">
          <AiOutlineRight />
        </div>
      </div>

      <div
        onClick={() => router.push(`/dashboard/settings/feed`)}
        className="flex items-center justify-between rounded-md bg-luminiBrandBlue p-4 text-start cursor-pointer"
      >
        <p>Feed</p>
        <div className="p-1 bg-ligthBrandBlue rounded-full">
          <AiOutlineRight />
        </div>
      </div>
    </div>
  );
}
