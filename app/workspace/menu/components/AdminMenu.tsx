"use client";

import { useTransition } from "react";
import { RiBriefcase2Line, RiTeamLine } from "react-icons/ri";
import { MdAttachMoney } from "react-icons/md";
import { LuChartNoAxesCombined } from "react-icons/lu";
import { useNavigation } from "@/app/lib/useNavegation";

export default function AdminMenu({ setSidebarOpen }: { setSidebarOpen: (open: boolean) => void }) {
  const { goTo } = useNavigation();
  const [isPending, startTransition] = useTransition();

  const handleNavigate = (path: string) => {
    startTransition(() => {
      goTo(path);
      // Cerramos el sidebar dentro del transition para sincronizarlo con el cambio de ruta
      setSidebarOpen(false);
    });
  };

  return (
    <div className={`w-full space-y-4 py-2 animate-slideIn ${isPending ? "opacity-50 pointer-events-none" : ""}`}>
      {/* Encabezado del Menú */}
      <div className="text-center py-2">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Menú de <span className="text-pink-400">Administración</span>
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Seleccioná un área para gestionar tu negocio.
        </p>
      </div>

      {/* Grid de Accesos */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <button
          onClick={() => handleNavigate("/workspace/staff")}
          className="flex flex-col items-center justify-center p-4 bg-luminiBrandBlue hover:bg-pink-600/10 border border-pink-600/30 hover:border-pink-500 rounded-2xl h-32 transition-all duration-200 shadow-lg group"
        >
          <RiTeamLine className="w-10 h-10 text-pink-400 group-hover:scale-110 transition-transform duration-200" />
          <p className="text-base font-semibold text-white mt-2">Equipo</p>
        </button>

        <button
          onClick={() => handleNavigate("/workspace/finance")}
          className="flex flex-col items-center justify-center p-4 bg-luminiBrandBlue hover:bg-pink-600/10 border border-pink-600/30 hover:border-pink-500 rounded-2xl h-32 transition-all duration-200 shadow-lg group"
        >
          <MdAttachMoney className="w-10 h-10 text-pink-400 group-hover:scale-110 transition-transform duration-200" />
          <p className="text-base font-semibold text-white mt-2">Finanzas</p>
        </button>

        <button
          onClick={() => handleNavigate("/workspace/commercial")}
          className="flex flex-col items-center justify-center p-4 bg-luminiBrandBlue hover:bg-pink-600/10 border border-pink-600/30 hover:border-pink-500 rounded-2xl h-32 transition-all duration-200 shadow-lg group"
        >
          <RiBriefcase2Line className="w-10 h-10 text-pink-400 group-hover:scale-110 transition-transform duration-200" />
          <p className="text-base font-semibold text-white mt-2">Comercial</p>
        </button>

        <button
          onClick={() => handleNavigate("/workspace/metrics")}
          className="flex flex-col items-center justify-center p-4 bg-luminiBrandBlue hover:bg-pink-600/10 border border-pink-600/30 hover:border-pink-500 rounded-2xl h-32 transition-all duration-200 shadow-lg group"
        >
          <LuChartNoAxesCombined className="w-10 h-10 text-pink-400 group-hover:scale-110 transition-transform duration-200" />
          <p className="text-base font-semibold text-white mt-2">Métricas</p>
        </button>
      </div>
    </div>
  );
}