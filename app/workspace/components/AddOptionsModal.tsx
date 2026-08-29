"use client";

import { IoMdClose } from "react-icons/io";
import { IoBagAddOutline } from "react-icons/io5";
import { LiaHandScissors } from "react-icons/lia";
import { useRouter } from "next/navigation";

export default function AddOptionsModal({
  onClose,
  setSidebarOpen,
}: {
  onClose: () => void;
  setSidebarOpen: (open: boolean) => void;
}) {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
    setSidebarOpen(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-md bg-black/30 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="absolute bottom-14 left-0 w-full flex items-center justify-center p-3 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center gap-3.5 bg-darkBrandBlue border border-pink-600/30 rounded-2xl shadow-2xl shadow-pink-950/50 py-2.5 px-4 w-full max-w-[280px]">
          {/* Producto */}
          <button
            onClick={() => handleNavigate("/workspace/product-sale")}
            className="flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl bg-luminiBrandBlue border border-emerald-400/40 text-emerald-400 shadow-md shadow-emerald-950/20 hover:bg-emerald-500/40 hover:border-emerald-300/60 hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-150 group cursor-pointer"
          >
            <IoBagAddOutline className="w-6 h-6 mb-0.5 text-white group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold tracking-wide text-emerald-100">
              Producto
            </span>
          </button>

          {/* Servicio */}
          <button
            onClick={() =>
              handleNavigate("/workspace/commercial/offerings/add")
            }
            className="flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl bg-pink-600 border border-pink-500/30 text-pink-400 shadow-md shadow-pink-950/20 hover:bg-pink-500/25 hover:border-pink-400/50 hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-150 group cursor-pointer"
          >
            <LiaHandScissors className="w-6 h-6 mb-0.5 text-white group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold tracking-wide text-pink-100">
              Servicio
            </span>
          </button>

          {/* Cerrar */}
          <button
            onClick={onClose}
            className="flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl bg-slate-700/65 border border-slate-500/40 text-slate-300 shadow-md hover:bg-slate-700/40 hover:border-slate-400/60 hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-150 group cursor-pointer"
          >
            <IoMdClose className="w-6 h-6 mb-0.5 text-white group-hover:rotate-90 transition-transform" />
            <span className="text-[10px] font-bold tracking-wide text-slate-200">
              Cerrar
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
