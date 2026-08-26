"use client";

import { useRouter } from "next/navigation";

export default function StaffPage() {
  const router = useRouter();

  const workRelations = [
    {
      name: "Empleado",
      description: "Empleado fijo con salario mensual.",
      attributes: [
        { name: "salario_fijo", description: "Monto de salario fijo." },
      ],
    },
    {
      name: "Arrendador",
      description: "Especialista que alquila una silla en el local.",
      attributes: [
        {
          name: "importe_de_alquiler",
          description: "Monto de alquiler de la silla.",
        },
      ],
    },
    {
      name: "Contratista",
      description: "Especialista independiente que trabaja a comisión.",
      attributes: [
        {
          name: "porcentaje_de_comision",
          description: "Porcentaje de comisión sobre ingresos.",
        },
      ],
    },
  ];

  return (
    <div className="text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Equipo de trabajo</h1>
      <p className="mb-6 text-sm">
        En YourPelu podés agregar miembros a tu equipo y definir la relación de
        trabajo que tienen con el establecimiento. Esto permite organizar mejor
        la administración y los aportes de cada integrante.
      </p>

      <div className="space-y-2">
        {workRelations.map((relation, i) => (
          <div key={i} className="bg-luminiBrandBlue p-3 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold text-pink-400 mb-2">
              {relation.name}
            </h2>
            <p className="mb-4">{relation.description}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-end py-4">
        <button
        onClick={() => router.push("/workspace/staff")}
        className="px-4 py-2 rounded bg-pink-400 hover:bg-pink-500 transition-colors"
      >
        Administrar Equipo
      </button>
      </div>
    </div>
  );
}
