"use client";

import Image from "next/image";
import React, { useState, use } from "react";
import { Lexend_Deca } from "next/font/google";
import { usePublicBarbershopFeed } from "@/app/hooks/usePublicBarbershopFeed";
import "react-datepicker/dist/react-datepicker.css";
import { apiPost } from "@/app/lib/apiPost";
import {
  FaCalendarAlt,
  FaClock,
  FaUserCheck,
  FaChevronRight,
  FaTimes,
  FaCheckCircle,
  FaUser,
  FaPhoneAlt,
} from "react-icons/fa";

// Carga de la fuente Lexend Deca exclusiva para este componente
const lexendDeca = Lexend_Deca({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

type CreateAppoimentDto = {
  name: string;
  lastname: string;
  phoneNumber: string;
  date: Date;
  staffId: string;
  establishmentId: string;
};

export default function AppointmentsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { establishment, staff, loading, error } =
    usePublicBarbershopFeed(slug);

  const [form, setForm] = useState<Omit<CreateAppoimentDto, "establishmentId">>(
    {
      name: "",
      lastname: "",
      phoneNumber: "",
      date: new Date(),
      staffId: "",
    },
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDays, setOpenDays] = useState(false);
  const [openHours, setOpenHours] = useState(false);
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number | null>(
    null,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  function getNextDaysOfWeek(dayOfWeek: number, count: number): Date[] {
    const dates: Date[] = [];
    const now = new Date();

    let current = new Date(now);
    while (current.getDay() !== dayOfWeek) {
      current.setDate(current.getDate() + 1);
    }

    for (let i = 0; i < count; i++) {
      const d = new Date(current);
      d.setDate(current.getDate() + i * 7);
      dates.push(d);
    }

    return dates;
  }

  function generateSlots(start: string, end: string): string[] {
    const slots: string[] = [];
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    const startDate = new Date();
    startDate.setHours(startH, startM, 0, 0);

    const endDate = new Date();
    endDate.setHours(endH, endM, 0, 0);

    while (startDate < endDate) {
      slots.push(
        startDate.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
      startDate.setMinutes(startDate.getMinutes() + 30);
    }
    return slots;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!establishment?.id) {
      alert("No se encontró el establecimiento");
      return;
    }

    if (!form.staffId) {
      alert("Por favor selecciona un especialista");
      return;
    }

    try {
      setIsSubmitting(true);
      const body: CreateAppoimentDto = {
        ...form,
        establishmentId: establishment.id,
      };

      await apiPost<CreateAppoimentDto>("/public-data/appointments", body);

      alert("¡Turno reservado con éxito!");
      setForm({
        name: "",
        lastname: "",
        phoneNumber: "",
        date: new Date(),
        staffId: "",
      });
    } catch (err: any) {
      alert(err.message || "Error al reservar turno");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getImageSrc = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  };

  const DAYS_MAP: Record<number, string> = {
    1: "Lunes",
    2: "Martes",
    3: "Miércoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado",
    7: "Domingo",
    0: "Domingo",
  };

  if (loading) {
    return (
      <div className={`min-h-screen w-full bg-white flex items-center justify-center ${lexendDeca.className}`}>
        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full bg-white flex flex-col items-center justify-start p-6 sm:p-8 ${lexendDeca.className}`}>
      <div className="w-full max-w-md my-auto">
        {/* Header con Logo y Nombre */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-24 h-24 mb-3">
            {establishment?.profile?.logoUrl ? (
              <Image
                src={getImageSrc(establishment?.profile?.logoUrl)}
                alt={`${establishment.name} logo`}
                fill
                className="rounded-full object-cover shadow-md border-4 border-white"
                unoptimized
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-semibold border-4 border-slate-50 shadow-sm">
                Sin logo
              </div>
            )}
          </div>

          <h1 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
            Reserva tu lugar en
          </h1>
          <span className="text-3xl font-bold text-pink-600 text-center tracking-tight mt-1">
            {establishment?.name || "Cargando..."}
          </span>
        </div>

        {/* Formulario principal */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sección: Datos personales */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-500"></span>
              1. Tus datos
            </h2>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-100/80 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/15 transition-all shadow-xs"
                  required
                />
                <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="lastname"
                  placeholder="Apellido"
                  value={form.lastname}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-100/80 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/15 transition-all shadow-xs"
                  required
                />
                <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              </div>

              <div className="relative">
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Teléfono"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-100/80 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/15 transition-all shadow-xs"
                  required
                />
                <FaPhoneAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              </div>
            </div>
          </div>

          {/* Sección: Fecha y Hora */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-500"></span>
              2. Fecha y Horario
            </h2>
            <div className="grid grid-cols-1 gap-2.5">
              {/* Selector Día */}
              <button
                type="button"
                onClick={() => setOpenDays(true)}
                className="w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-pink-50/60 border border-slate-300 hover:border-pink-400 rounded-2xl transition-all group shadow-xs active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 text-slate-800 group-hover:text-pink-600">
                  <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-semibold">
                    <FaCalendarAlt className="text-sm" />
                  </div>
                  <span className="text-sm font-semibold capitalize">
                    {form.date
                      ? form.date.toLocaleDateString("es-ES", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })
                      : "Seleccionar fecha"}
                  </span>
                </div>
                <FaChevronRight className="text-xs text-slate-400 group-hover:text-pink-500 transition-transform group-hover:translate-x-0.5" />
              </button>

              {/* Selector Hora */}
              <button
                type="button"
                onClick={() => setOpenHours(true)}
                className="w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-pink-50/60 border border-slate-300 hover:border-pink-400 rounded-2xl transition-all group shadow-xs active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 text-slate-800 group-hover:text-pink-600">
                  <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-semibold">
                    <FaClock className="text-sm" />
                  </div>
                  <span className="text-sm font-semibold">
                    {form.date
                      ? form.date.toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        }) + " hs"
                      : "Seleccionar hora"}
                  </span>
                </div>
                <FaChevronRight className="text-xs text-slate-400 group-hover:text-pink-500 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* Sección: Selección de Especialista */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-500"></span>
              3. Especialista
            </h2>
            <div className="space-y-2.5">
              {staff.map((member) => {
                const isSelected = form.staffId === member.id;
                return (
                  <label
                    key={member.id}
                    onClick={() => setForm({ ...form, staffId: member.id })}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all cursor-pointer shadow-xs ${
                      isSelected
                        ? "bg-pink-50/70 border-pink-500 ring-2 ring-pink-500/20"
                        : "bg-slate-50 border-slate-200/80 hover:border-slate-300 hover:bg-slate-100/60"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      {member.userProfile?.avatarUrl ? (
                        <img
                          src={getImageSrc(member.userProfile.avatarUrl)}
                          alt={`${member.name} ${member.lastname}`}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                        />
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-linear-to-br from-pink-500 to-rose-600 text-white font-bold text-sm shadow-md">
                          {member.name.charAt(0)}
                          {member.lastname.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {member.name} {member.lastname}
                        </p>
                        <p className="text-xs font-medium text-slate-500">
                          Especialista
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-pink-500 text-white shadow-xs"
                          : "border-2 border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && <FaCheckCircle className="text-sm" />}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-4 bg-linear-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-pink-500/30 transition-all text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2 cursor-pointer"
          >
            <FaUserCheck className="text-lg" />
            {isSubmitting ? "Procesando..." : "Confirmar Reserva"}
          </button>
        </form>
      </div>

      {/* Modal Selección de Días */}
      {openDays && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs z-50 p-4"
          onClick={() => {
            setOpenDays(false);
            setSelectedDayOfWeek(null);
          }}
        >
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl border border-slate-100 transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">
                {!selectedDayOfWeek
                  ? "Días de atención"
                  : "Selecciona la fecha"}
              </h3>
              <button
                onClick={() => {
                  setOpenDays(false);
                  setSelectedDayOfWeek(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {!selectedDayOfWeek ? (
              <div className="grid grid-cols-2 gap-2">
                {establishment?.profile?.schedules
                  ?.sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                  .map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedDayOfWeek(s.dayOfWeek)}
                      className="py-3 px-3 bg-slate-100 hover:bg-pink-500 hover:text-white border border-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all text-center shadow-2xs"
                    >
                      {DAYS_MAP[s.dayOfWeek] ?? "Día desconocido"}
                    </button>
                  ))}
              </div>
            ) : (
              <div className="space-y-2">
                {getNextDaysOfWeek(selectedDayOfWeek, 4).map((date, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setForm({ ...form, date });
                      setOpenDays(false);
                      setSelectedDayOfWeek(null);
                    }}
                    className="w-full py-3 px-3.5 bg-slate-100 hover:bg-pink-500 hover:text-white border border-slate-200 font-semibold text-slate-700 rounded-xl text-xs transition-all text-left capitalize shadow-2xs"
                  >
                    {date.toLocaleDateString("es-ES", {
                      weekday: "long",
                      day: "numeric",
                      month: "short",
                    })}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedDayOfWeek(null)}
                  className="w-full py-2 text-xs text-slate-500 hover:text-pink-600 mt-2 font-bold"
                >
                  ← Volver a días
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Selección de Horarios */}
      {openHours && form.date && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs z-50 p-4"
          onClick={() => setOpenHours(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 transition-all max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">
                Horarios disponibles
              </h3>
              <button
                onClick={() => setOpenHours(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div className="overflow-y-auto pr-1">
              <div className="grid grid-cols-3 gap-2">
                {establishment?.profile?.schedules
                  ?.find((s) => s.dayOfWeek === form.date.getDay())
                  ?.timeRanges.flatMap((tr) => generateSlots(tr.start, tr.end))
                  .sort((a, b) => {
                    const [ah, am] = a.split(":").map(Number);
                    const [bh, bm] = b.split(":").map(Number);
                    return ah * 60 + am - (bh * 60 + bm);
                  })
                  .map((slot) => (
                    <button
                      key={slot}
                      onClick={() => {
                        const [h, m] = slot.split(":");
                        const target = new Date(form.date);
                        target.setHours(Number(h), Number(m));
                        setForm({ ...form, date: target });
                        setOpenHours(false);
                      }}
                      className="py-2.5 px-3 bg-slate-100 hover:bg-pink-500 hover:text-white border border-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all text-center shadow-2xs"
                    >
                      {slot} hs
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}