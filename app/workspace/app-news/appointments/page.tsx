"use client";

import { useRouter } from "next/navigation";

export default function AppointmentsPage() {
  const router = useRouter();

  const sampleAppointments = [
    { time: "10:00", client: "Juan Pérez", service: "Corte clásico" },
    { time: "11:00", client: "María Gómez", service: "Coloración" },
    { time: "12:00", client: "Pedro López", service: "Fade moderno" },
  ];

  return (
    <div className="text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Manejo de turnos</h1>
      <p className="mb-6">
        Organizá tu agenda de clientes, confirmá citas y optimizá la atención
        con recordatorios automáticos. Podés visualizar los turnos del día,
        administrar servicios y mantener un control claro de la disponibilidad
        del equipo.
      </p>

      {/* Botones de acción */}
      <div className="flex gap-4 justify-end">
        <button
          onClick={() => router.push("/workspace/commercial/appointments")}
          className="px-4 py-2 rounded bg-pink-500 hover:bg-pink-600 transition-colors"
        >
          Administrar turnos
        </button>
      </div>
    </div>
  );
}
