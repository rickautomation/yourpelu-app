
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
  FaInfoCircle,
  FaSpinner,
  FaWhatsapp,
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

export default function StaffAppointmentsPage() {
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
        `/appointments/all?establishmentId=${activeEstablishment.id}`
      );
      setAppointments(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar turnos");
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
    accepted: boolean
  ) => {
    try {
      await apiPatch<Appointment>(`/appointments/${appointment.id}/accept`, {
        accepted,
      });

      await fetchAppointments();

      setPopupMessage(
        accepted
          ? "✅ Turno confirmado correctamente"
          : "❌ Turno rechazado correctamente"
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
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-pink-400">
        <FaSpinner className="w-10 h-10 animate-spin" />
        <span className="text-sm font-medium text-gray-300">Cargando tus turnos...</span>
      </div>
    );

  if (error)
    return (
      <div className="p-4 text-center text-red-300 bg-red-950/40 border border-red-500/30 rounded-xl m-4">
        <p>Error al obtener la lista de turnos: {error}</p>
      </div>
    );

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4 animate-slideIn">
      {/* Banner Informativo para el Staff */}
      <div className="p-4 rounded-xl bg-luminiBrandBlue border border-pink-600/30 flex items-center gap-3 shadow-lg">
        <div className="p-3 bg-pink-600/20 text-pink-400 rounded-full shrink-0">
          <FaInfoCircle className="w-5 h-5" />
        </div>
        <div className="text-left text-xs sm:text-sm">
          <p className="font-semibold text-white">
            Agenda de {user?.name || "Especialista"}
          </p>
          <p className="text-gray-300">
            {activeEstablishment?.bookingLink
              ? `El establecimiento ${activeEstablishment.name} tiene activas las reservas online.`
              : `Las reservas online de ${activeEstablishment?.name || "este local"} están gestionadas directamente por recepción.`}
          </p>
        </div>
      </div>

      {/* Listado de Turnos */}
      {appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-luminiBrandBlue rounded-2xl border border-pink-600/20">
          <FaCalendarTimes className="w-14 h-14 text-gray-500 mb-3 animate-pulse" />
          <h3 className="text-lg font-bold text-white mb-1">
            No tenés turnos asignados
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 max-w-sm">
            Los turnos agendados por tus clientes o desde recepción aparecerán aquí en orden de atención.
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
                className="border border-pink-600/30 rounded-2xl bg-luminiBrandBlue p-4 sm:p-5 shadow-xl space-y-3"
              >
                {/* Encabezado con Fecha y Hora */}
                <div className="flex items-center justify-between bg-gray-900/50 p-3 rounded-xl border border-pink-600/20">
                  <div className="flex items-center gap-2 text-pink-400 font-semibold text-sm">
                    <FaRegCalendarDays className="w-4 h-4" />
                    <span>{dia}</span>
                  </div>
                  <div className="flex items-center gap-2 text-pink-400 font-semibold text-sm">
                    <IoMdClock className="w-5 h-5" />
                    <span>{hora} hs</span>
                  </div>
                </div>

                {/* Info del Cliente */}
                <div className="text-left space-y-1 text-xs sm:text-sm pt-1">
                  <p className="text-gray-200">
                    <strong className="text-white">Cliente:</strong> {a.name}{" "}
                    {a.lastname}
                  </p>
                  <p className="text-gray-200 flex items-center gap-1.5">
                    <strong className="text-white">Teléfono:</strong> {a.phoneNumber}
                  </p>
                </div>

                {/* Estado Actual */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-800 text-xs sm:text-sm">
                  <span className="text-gray-400 font-medium">Estado del turno:</span>
                  {a.accepted ? (
                    <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/40">
                      <FaCheckCircle /> Confirmado
                    </span>
                  ) : a.active ? (
                    <span className="flex items-center gap-1.5 text-amber-400 bg-amber-950/40 px-3 py-1 rounded-full text-xs font-semibold border border-amber-500/40">
                      <FaHourglassHalf /> Pendiente
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-rose-400 bg-rose-950/40 px-3 py-1 rounded-full text-xs font-semibold border border-rose-500/40">
                      <FaTimesCircle /> Rechazado
                    </span>
                  )}
                </div>

                {/* Botones de Acción (Confirmar / Rechazar + WhatsApp) */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleDecision(a, false)}
                    disabled={!a.active && !a.accepted}
                    className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-1.5 ${
                      !a.active && !a.accepted
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                        : "bg-rose-600/90 hover:bg-rose-600 text-white shadow-md shadow-rose-600/20"
                    }`}
                  >
                    <FaTimesCircle />
                    <span>Rechazar</span>
                  </button>

                  <button
                    onClick={() => handleDecision(a, true)}
                    disabled={a.accepted}
                    className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-1.5 ${
                      a.accepted
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                        : "bg-pink-600 hover:bg-pink-700 text-white shadow-md shadow-pink-600/20"
                    }`}
                  >
                    <FaCheckCircle />
                    <span>Confirmar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Popup / Toast Modal */}
      {popupMessage && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center bg-black/60 z-50 p-4 animate-fadeIn"
          onClick={() => setPopupMessage(null)}
        >
          <div
            className="bg-luminiBrandBlue border border-pink-600/50 p-6 rounded-2xl shadow-2xl text-center max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-base font-semibold text-white">{popupMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}