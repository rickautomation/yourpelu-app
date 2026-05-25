// BookingActive.tsx
"use client";
import SchedulesSetup from "@/app/components/common/SchedulesSetup";

interface UserProfile {
  id: string;
  avatarUrl?: string;
  bio?: string;
  birthDate?: string;
  address?: string;
}

interface BookingActiveProps {
  establishmentName?: string;
}

export default function BookingActive({ establishmentName }: BookingActiveProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Turnos habilitados</h1>
      <p className="mb-6 text-gray-600">
        {establishmentName} ya tiene habilitado el manejo de turnos.
      </p>

      {/* Reutilizamos el setup de horarios */}
      <SchedulesSetup />
    </div>
  );
}
