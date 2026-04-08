"use client";

import Image from "next/image";
import React, { useState } from "react";
import { usePublicBarbershopFeed } from "@/app/hooks/usePublicBarbershopFeed";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { use } from "react";
import { apiPost } from "@/app/lib/apiPost";

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
  params: Promise<{ establishmentId: string }>;
}) {
  const { establishmentId } = use(params);
  const { establishment, staff, loading, error } =
    usePublicBarbershopFeed(establishmentId);

  const [form, setForm] = useState<Omit<CreateAppoimentDto, "establishmentId">>(
    {
      name: "",
      lastname: "",
      phoneNumber: "",
      date: new Date(),
      staffId: "",
    },
  );

  const [openCalendar, setOpenCalendar] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body: CreateAppoimentDto = { ...form, establishmentId };

      const res = await apiPost<CreateAppoimentDto>(
        "/public-data/appointments",
        body,
      );

      alert("Turno reservado con éxito!");
      setForm({
        name: "",
        lastname: "",
        phoneNumber: "",
        date: new Date(),
        staffId: "",
      });
    } catch (err: any) {
      alert(err.message || "Error al reservar turno");
    }
  };

  const getImageSrc = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http")) {
      return url; // Producción: Cloudinary u otra URL pública
    }
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`; // Local: concatenar API_URL
  };

  return (
    <div className="flex flex-col items-center px-4 py-2 bg-gray-200 text-black min-h-screen">
      <div className="rounded-full">
        {establishment?.profile?.logoUrl ? (
          <Image
            src={getImageSrc(establishment?.profile?.logoUrl)}
            alt={`${establishment.name} logo`}
            width={30} // 👈 más grande
            height={30} // 👈 más grande
            className="h-30 w-30 rounded-full object-cover shadow-md" // 👈 redondo, sin borde
            unoptimized
          />
        ) : (
          <div className="w-30 h-30 flex items-center justify-center rounded-full bg-gray-200 text-gray-500">
            Logo pendiente
          </div>
        )}
      </div>
      <h1 className="text-2xl py-4">
        Reserva tu lugar en{" "}
        <span className="text-pink-600">{establishment?.name}</span>
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm"
      >
        {/* Datos personales */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Tus datos</h2>
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-2"
            required
          />
          <input
            type="text"
            name="lastname"
            placeholder="Apellido"
            value={form.lastname}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-2"
            required
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Teléfono"
            value={form.phoneNumber}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* Elección del día */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Elegí el día y horario</h2>
          <div className="flex justify-between items-center gap-2 ">
            <div className="flex gap-2 text-md text-pink-600 border border-white rounded-md px-2 py-1">
              <p>
                {form.date
                  ? form.date.toLocaleDateString("es-ES", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })
                  : "Seleccioná fecha y hora"}
              </p>
              <p>
                {form.date.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                }) + " hrs"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpenCalendar(!openCalendar)}
              className="flex items-center gap-2 p-2 bg-pink-500 text-white rounded px-2 py-1 "
            >
              Cambiar
            </button>
          </div>

          {openCalendar && (
            <div className="fixed inset-0 backdrop-blur-sm bg-opacity-70 flex items-center justify-center bg-opacity-40 z-50">
              <div className="border border-pink-600 bg-slate-200 p-6 rounded-md shadow-lg flex flex-col items-center">
                <DatePicker
                  selected={form.date}
                  onChange={(date: Date | null) => {
                    if (date) {
                      setForm({ ...form, date });
                    }
                  }}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  dateFormat="dd/MM/yyyy HH:mm"
                  inline
                />
                <button
                  type="button"
                  onClick={() => setOpenCalendar(false)}
                  className="mt-2 bg-pink-500 text-white py-1 px-7 rounded shadow"
                >
                  Confirmar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Selección de barbero (hardcodeado) */}
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Seleccioná un especialista
          </h2>
          <div className="flex flex-col gap-2">
            {staff.map((member) => (
              <label
                key={member.id}
                className="bg-slate-300 p-3 rounded shadow cursor-pointer flex items-center gap-3"
              >
                {/* Avatar o iniciales */}
                {member.userProfile?.avatarUrl ? (
                  <img
                    src={getImageSrc(member.userProfile.avatarUrl)}
                    alt={`${member.name} ${member.lastname}`}
                    className="w-10 h-10 rounded-full border border-gray-600"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-500 text-white font-bold">
                    {member.name.charAt(0)}
                    {member.lastname.charAt(0)}
                  </div>
                )}

                {/* Nombre */}
                <p className="text-lg font-semibold flex-1">
                  {member.name} {member.lastname}
                </p>

                {/* Checkbox único */}
                <input
                  type="checkbox"
                  checked={form.staffId === member.id}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setForm({ ...form, staffId: member.id });
                    } else {
                      setForm({ ...form, staffId: "" }); // 👈 deselecciona
                    }
                  }}
                  className="w-5 h-5 accent-pink-500"
                />
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-pink-500 text-white py-2 rounded shadow mt-4"
        >
          Reservar
        </button>
      </form>
    </div>
  );
}
