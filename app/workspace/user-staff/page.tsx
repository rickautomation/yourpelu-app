"use client";

import { useRouter } from "next/navigation";
import { RiBriefcase2Line } from "react-icons/ri";
import { MdAttachMoney } from "react-icons/md";

export default function UserStaffPage() {
  const router = useRouter();

  return (
    <div className="text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Panel Staff</h1>
      <p className="mb-8 text-gray-300">
        Bienvenido al panel de Staff. Desde aquí podés gestionar tus turnos y
        productos asociados al establecimiento.
      </p>

      <div className="grid grid-cols-2 gap-6">
        {/* Turnos */}
        <div className="bg-luminiBrandBlue p-6 rounded-md flex flex-col items-center">
          <RiBriefcase2Line className="w-12 h-12 mb-3" />
          <h2 className="text-xl font-semibold mb-2">Turnos</h2>
          <p className="text-gray-200 text-center mb-4">
            Visualizá y administrá los turnos asignados.
          </p>
          <button
            onClick={() => router.push("/workspace/user-staff/appointments")}
            className="px-4 py-2 rounded bg-pink-400 hover:bg-pink-500 transition-colors"
          >
            Ir a Turnos
          </button>
        </div>

        {/* Productos */}
        <div className="bg-luminiBrandBlue p-6 rounded-md flex flex-col items-center">
          <MdAttachMoney className="w-12 h-12 mb-3" />
          <h2 className="text-xl font-semibold mb-2">Productos</h2>
          <p className="text-gray-200 text-center mb-4">
            Gestioná los productos disponibles para la venta.
          </p>
          <button
            onClick={() => router.push("/workspace/user-staff/products")}
            className="px-4 py-2 rounded bg-pink-400 hover:bg-pink-500 transition-colors"
          >
            Ir a Productos
          </button>
        </div>
      </div>
    </div>
  );
}
