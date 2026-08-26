"use client";

interface SummaryItem {
  label: string;
  value: string;
}

const summary: SummaryItem[] = [
  { label: "Turnos", value: "12" },
  { label: "Clientes nuevos", value: "3" },
  { label: "Servicio más pedido", value: "Fade clásico" },
  { label: "Ingresos", value: "$45.000" },
];

export function ActivitySummary() {
  return (
    <div className="w-full max-w-lg">
      <h2 className="text-xl text-center font-bold mb-4 text-white">Resumen de hoy</h2>
      <div className="grid grid-cols-2 gap-4">
        {summary.map((item, i) => (
          <div key={i} className="bg-luminiBrandBlue p-4 rounded-md text-center">
            <p className="text-pink-400 font-semibold">{item.label}</p>
            <p className="text-white text-lg">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
