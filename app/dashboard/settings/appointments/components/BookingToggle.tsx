"use client";

import { BsToggle2Off, BsToggle2On } from "react-icons/bs";

interface BookingToggleProps {
  bookingEnabled: boolean | undefined;
  establishmentName?: string;
  onToggle: () => void;
}

export default function BookingToggle({
  bookingEnabled,
  establishmentName,
  onToggle,
}: BookingToggleProps) {
  return (
    <div className="text-lg">
      <>
        <p className="mb-2 text-center">
          Actualmente <span className="text-pink-500">{establishmentName}</span>{" "}
          no está configurado para manejar turnos desde la app.
        </p>
        <p className="text-center">
          ¿Desea activar el manejo de turnos desde la App?
        </p>
      </>

      <div className="flex flex-col items-center justify-center text-center">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 px-4 py-2 rounded text-3xl"
        >
          {bookingEnabled ? (
            <>
              <BsToggle2On className="text-green-600 text-6xl" />
              <span>SI</span>
            </>
          ) : (
            <>
              <BsToggle2Off className="text-gray-500 text-6xl" />
              <span>NO</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
