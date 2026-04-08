"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/app/lib/apiGet";

type Appointment = {
  id: string;
  date: string; // ISO string, lo podés convertir a Date en el frontend
  active: boolean;
  name: string;
  lastname: string;
  phoneNumber: string;

  // Relación con el barbero
  barber: {
    id: string;
    name: string;
    lastname?: string;
  };

  // Relación con la barbería
  barbershop: {
    id: string;
    name: string;
    address?: string;
  };
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await apiGet<Appointment[]>("/appointments/all");
        setAppointments(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) return <p>Cargando citas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      {appointments.length === 0 ? (
        <p>No hay citas</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {appointments.map((a) => (
            <div
              key={a.id}
              className="border border-pink-600 rounded-md bg-slate-800 p-2 text-center"
            >
              <p>{new Date(a.date).toLocaleString()}</p>
              <strong>
                {a.name} {a.lastname}
              </strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
