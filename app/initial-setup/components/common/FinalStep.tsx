"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FiCheck } from "react-icons/fi";

const FinalStep: React.FC = () => {
  const router = useRouter();

  const handleFinish = () => {
    router.push("/workspace");
  };

  return (
    <div className="max-w-md mx-auto text-center py-2 animate-in fade-in duration-300">
      {/* Icono de Celebración / Check */}
      <div className="mb-6 flex justify-center">
        <div className="w-20 h-20 rounded-full bg-pink-500/10 border-2 border-pink-500 flex items-center justify-center text-pink-400 shadow-xl shadow-pink-500/20">
          <FiCheck className="text-4xl stroke-[2.5]" />
        </div>
      </div>

      <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
        ¡Todo listo!
      </h2>
      
      <p className="text-gray-300 text-base sm:text-lg mb-6 leading-relaxed">
        Has completado la configuración inicial de tu establecimiento con éxito.
      </p>

      {/* Tarjeta Informativa de Próximos Pasos */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 text-left space-y-3 shadow-lg">
        <p className="text-sm text-gray-300 leading-relaxed">
          Desde tu panel principal ya puedes empezar a:
        </p>
        <ul className="text-sm text-gray-400 space-y-2 pl-1">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
            Crear tus servicios y precios.
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
            Invitar a los miembros de tu equipo.
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
            Gestionar tus reservas y productos.
          </li>
        </ul>
      </div>

      <button
        type="button"
        onClick={handleFinish}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-pink-500/25 transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
      >
        <span>Ir al panel principal</span>
      </button>
    </div>
  );
};

export default FinalStep;