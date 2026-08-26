"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/app/lib/apiGet";
import { apiPatch } from "@/app/lib/apiPatch";
import { FaRegCalendarDays } from "react-icons/fa6";
import { IoMdClock } from "react-icons/io";
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaCalendarTimes,
  FaGlobe,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { useAuth } from "@/app/hooks/useAuth";
import { useEstablishment } from "@/app/context/EstablishmentContext";

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
  const { activeEstablishment } = useEstablishment();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const fetchAppointments = async () => {
    if (!activeEstablishment?.id) return;
    setLoading(true);
    try {
      const data = await apiGet<Appointment[]>(
        `/appointments/all?establishmentId=${activeEstablishment.id}`,
      );
      setAppointments(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [activeEstablishment?.id]);

  const formatArgPhone = (phone: string) => {
    let clean = phone.replace(/\D/g, "");

    if (clean.startsWith("0")) clean = clean.slice(1);
    if (clean.startsWith("15")) clean = clean.slice(2);
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

      setPopupMessage(
        accepted
          ? "✅ Turno confirmado correctamente"
          : "❌ Turno rechazado correctamente",
      );

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
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [popupMessage]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="p-4 text-center text-red-400 bg-red-900/20 rounded-md m-4">
        <p>Error al cargar turnos: {error}</p>
      </div>
    );

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      {/* Banner de Estado de Reservas Online */}
      {user?.rol === "admin" && (
        <div className="p-4 rounded-lg bg-luminiBrandBlue border border-pink-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3 text-left">
            <div className="p-3 bg-pink-500/10 text-pink-500 rounded-full">
              <FaGlobe className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-white">Reservas Online</p>
              <p className="text-xs text-gray-300">
                {activeEstablishment?.bookingLink
                  ? "El enlace de reservas públicas está activo para tus clientes."
                  : "No tienes un enlace de reservas públicas configurado actualmente."}
              </p>
            </div>
          </div>

          {activeEstablishment?.bookingLink && (
            <a
              href={activeEstablishment.bookingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white text-sm px-4 py-2 rounded-md font-medium transition-colors w-full sm:w-auto justify-center"
            >
              <span>Ver mi página</span>
              <FaExternalLinkAlt className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* Lista de Turnos o Estado Vacío */}
      {appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-luminiBrandBlue rounded-lg border border-gray-800">
          <FaCalendarTimes className="w-16 h-16 text-gray-500 mb-4 animate-pulse" />
          <h3 className="text-xl font-bold text-white mb-1">
            No tienes turnos agendados
          </h3>
          <p className="text-sm text-gray-400 max-w-md">
            Los turnos solicitados por tus clientes o registrados manualmente
            aparecerán aquí listados en orden cronológico.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
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
                className="border border-pink-500/40 rounded-lg bg-luminiBrandBlue p-4 shadow-md space-y-3"
              >
                {/* Encabezado: Fecha y Hora */}
                <div className="flex items-center justify-between bg-black/20 p-2.5 rounded-md border border-white/5">
                  <div className="flex items-center gap-2 text-pink-400 font-semibold">
                    <FaRegCalendarDays className="w-4 h-4" />
                    <span>{dia}</span>
                  </div>
                  <div className="flex items-center gap-2 text-pink-400 font-semibold">
                    <IoMdClock className="w-5 h-5" />
                    <span>{hora} hs</span>
                  </div>
                </div>

                {/* Detalles de Cliente y Profesional */}
                <div className="text-left space-y-1 text-sm pt-1">
                  <p className="text-gray-200">
                    <strong className="text-white">Cliente:</strong> {a.name}{" "}
                    {a.lastname} ({a.phoneNumber})
                  </p>
                  <p className="text-gray-200">
                    <strong className="text-white">Especialista:</strong>{" "}
                    {a.staff?.name} {a.staff?.lastname || ""}
                  </p>
                </div>

                {/* Estado del Turno */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-sm">
                  <span className="text-gray-400 font-medium">Estado:</span>
                  {a.accepted ? (
                    <span className="flex items-center gap-1.5 text-green-400 bg-green-950/40 px-3 py-1 rounded-full text-xs font-semibold border border-green-800">
                      <FaCheckCircle /> Aceptado
                    </span>
                  ) : a.active ? (
                    <span className="flex items-center gap-1.5 text-yellow-400 bg-yellow-950/40 px-3 py-1 rounded-full text-xs font-semibold border border-yellow-800">
                      <FaHourglassHalf /> Pendiente
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-red-400 bg-red-950/40 px-3 py-1 rounded-full text-xs font-semibold border border-red-800">
                      <FaTimesCircle /> Rechazado
                    </span>
                  )}
                </div>

                {/* Acciones para el Especialista asignado */}
                {user?.id === a.staff?.id && (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleDecision(a, false)}
                      disabled={!a.active && !a.accepted}
                      className={`flex-1 px-3 py-2 rounded-md text-white font-medium text-sm transition-colors ${
                        !a.active && !a.accepted
                          ? "bg-gray-700 opacity-50 cursor-not-allowed"
                          : "bg-rose-600 hover:bg-rose-700"
                      }`}
                    >
                      Rechazar
                    </button>
                    <button
                      onClick={() => handleDecision(a, true)}
                      disabled={a.accepted}
                      className={`flex-1 px-3 py-2 rounded-md text-white font-medium text-sm transition-colors ${
                        a.accepted
                          ? "bg-gray-700 opacity-50 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
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

      {/* Popup Modal de feedback */}
      {popupMessage && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center bg-black/60 z-50 p-4 animate-fade-in"
          onClick={() => setPopupMessage(null)}
        >
          <div
            className="bg-luminiBrandBlue border border-pink-500/50 p-6 rounded-lg shadow-2xl text-center max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-lg font-semibold text-white">{popupMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}