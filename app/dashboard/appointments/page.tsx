"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/app/lib/apiGet";
import { apiPatch } from "@/app/lib/apiPatch"; // 👈 importamos tu helper
import { FaRegCalendarDays } from "react-icons/fa6";
import { IoMdClock } from "react-icons/io";
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaRegCopy,
  FaTimesCircle,
} from "react-icons/fa";
import { useAuth } from "@/app/hooks/useAuth";
import { useUserEstablishment } from "@/app/hooks/useUserEstablishment";

type Appointment = {
  id: string;
  date: string;
  active: boolean;
  name: string;
  lastname: string;
  phoneNumber: string;
  accepted?: boolean;

  staff: {
    id: string;
    name: string;
    lastname?: string;
  };

  establishment: {
    id: string;
    name: string;
    address?: string;
  };
};

export default function AppointmentsPage() {
  const { user } = useAuth();
  const { activeEstablishment } = useUserEstablishment(user);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("user: ", user);
  console.log("appointments: ", appointments);
  console.log("active: ", activeEstablishment);

  const [popupMessage, setPopupMessage] = useState<string | null>(null);

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

  useEffect(() => {
    fetchAppointments();
  }, []);

  const formatArgPhone = (phone: string) => {
    let clean = phone.replace(/\D/g, "");

    if (clean.startsWith("0")) {
      clean = clean.slice(1);
    }

    if (clean.startsWith("15")) {
      clean = clean.slice(2);
    }

    if (clean.startsWith("549")) return clean;

    if (clean.startsWith("9")) return "549" + clean.slice(1);

    return "549" + clean;
  };

  const handleDecision = async (
    appointment: Appointment,
    accepted: boolean,
  ) => {
    try {
      await apiPatch<Appointment>(`/appointments/${appointment.id}/accept`, {
        accepted,
      });

      await fetchAppointments();

      // Popup dinámico
      setPopupMessage(
        accepted
          ? "✅ Turno confirmado correctamente"
          : "❌ Turno rechazado correctamente",
      );

      // Construimos mensaje de WhatsApp
      const formattedPhone = formatArgPhone(appointment.phoneNumber);
      const message = accepted
        ? `Hola ${appointment.name}, tu turno en ${appointment.establishment.name} fue CONFIRMADO ✅.\n\nFecha: ${new Date(appointment.date).toLocaleDateString()} - Hora: ${new Date(appointment.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}\n\n¡Te esperamos!`
        : `Hola ${appointment.name}, lamentamos informarte que tu turno en ${appointment.establishment.name} fue RECHAZADO ❌.\n\nPor favor, comunicate con nosotros para reprogramar.`;

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    } catch (err: any) {
      setPopupMessage("Error al actualizar turno: " + err.message);
    }
  };

  useEffect(() => {
    if (popupMessage) {
      const timer = setTimeout(() => {
        setPopupMessage(null);
      }, 2000); // 2 segundos

      return () => clearTimeout(timer); // limpiamos el timer si cambia antes
    }
  }, [popupMessage]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      {activeEstablishment?.bookingLink && user?.rol === "admin" && (
        <div className="mt-4 py-4 rounded bg-luminiBrandBlue text-center text-lg mb-2">
          <p className="text-sm text-start p-2 font-semibold">
            📎 Comparte tu link de reservas:
          </p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-pink-500 break-all">
              {activeEstablishment.bookingLink}
            </p>
            <button
              onClick={() => {
                if (activeEstablishment?.bookingLink) {
                  navigator.clipboard.writeText(
                    activeEstablishment.bookingLink,
                  );
                  alert("Link copiado al portapapeles ✅"); // feedback rápido
                }
              }}
              className="flex items-center gap-1 px-2 py-1 rounded border border-pink-500 hover:bg-pink-100 text-pink-500 transition"
            >
              <FaRegCopy />
            </button>
          </div>
        </div>
      )}
      {appointments.length === 0 ? (
        <p>No hay citas</p>
      ) : (
        <div className="flex flex-col gap-3">
          {appointments.map((a) => {
            const fecha = new Date(a.date);
            const dia = fecha.toLocaleDateString();
            const hora = fecha.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={a.id}
                className="border border-pink-600 rounded-md bg-luminiBrandBlue p-3 text-center space-y-2"
              >
                <div className="flex items-center justify-around text-lg">
                  <div className="flex gap-3">
                    <FaRegCalendarDays className="w-5 h-5 items-center" />
                    <p>{dia}</p>
                  </div>
                  <div className="flex gap-3">
                    <IoMdClock className="w-6 h-6" />
                    <p>{hora}</p>
                  </div>
                </div>
                <p>
                  <strong>Cliente:</strong> {a.name} {a.lastname} (
                  {a.phoneNumber})
                </p>
                <p>
                  <strong>Especialista:</strong> {a.staff?.name}{" "}
                  {a.staff?.lastname || ""}
                </p>
                <p className="text-sm flex items-center justify-center gap-2">
                  Estado:{" "}
                  {a.accepted ? (
                    <span className="flex items-center gap-1 text-green-500">
                      <FaCheckCircle /> Aceptado
                    </span>
                  ) : a.active ? (
                    <span className="flex items-center gap-1 text-yellow-500">
                      <FaHourglassHalf /> Pendiente
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-500">
                      <FaTimesCircle /> Rechazado
                    </span>
                  )}
                </p>
                {user?.id === a.staff?.id && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleDecision(a, false)}
                      disabled={!a.active && !a.accepted} // deshabilitado si ya está rechazado
                      className={`flex-1 px-3 py-2 rounded text-white 
        ${
          !a.active && !a.accepted
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-rose-600 hover:bg-red-700"
        }`}
                    >
                      Rechazar
                    </button>
                    <button
                      onClick={() => handleDecision(a, true)}
                      disabled={a.accepted} // deshabilitado si ya está aceptado
                      className={`flex-1 px-3 py-2 rounded text-white 
        ${
          a.accepted
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-green-700"
        }`}
                    >
                      Confirmar
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {/* Popup modal */}
      {popupMessage && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center bg-opacity-50 z-50"
          onClick={() => setPopupMessage(null)}
        >
          <div
            className="bg-luminiBrandBlue p-6 rounded-md shadow-lg text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-lg font-semibold">{popupMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
