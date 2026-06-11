// "use client";

// import Image from "next/image";
// import React, { useState } from "react";
// import { usePublicBarbershopFeed } from "@/app/hooks/usePublicBarbershopFeed";
// import "react-datepicker/dist/react-datepicker.css";
// import { use } from "react";
// import { apiPost } from "@/app/lib/apiPost";
// import { FaCalendarAlt, FaClock } from "react-icons/fa";

// type CreateAppoimentDto = {
//   name: string;
//   lastname: string;
//   phoneNumber: string;
//   date: Date;
//   staffId: string;
//   establishmentId: string;
// };

// type TimeRange = { id: string; start: string; end: string };
// type Schedule = { id: string; dayOfWeek: number; timeRanges: TimeRange[] };

// export default function AppointmentsPage({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   const { slug } = use(params);
//   const { establishment, staff, loading, error } =
//     usePublicBarbershopFeed(slug);

//   const [form, setForm] = useState<Omit<CreateAppoimentDto, "establishmentId">>(
//     {
//       name: "",
//       lastname: "",
//       phoneNumber: "",
//       date: new Date(),
//       staffId: "",
//     },
//   );

//   const [openDays, setOpenDays] = useState(false);
//   const [openHours, setOpenHours] = useState(false);
//   const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number | null>(
//     null,
//   );

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   function getNextDaysOfWeek(dayOfWeek: number, count: number): Date[] {
//     const dates: Date[] = [];
//     const now = new Date();

//     let current = new Date(now);
//     // avanzar hasta el próximo díaOfWeek
//     while (current.getDay() !== dayOfWeek) {
//       current.setDate(current.getDate() + 1);
//     }

//     for (let i = 0; i < count; i++) {
//       const d = new Date(current);
//       d.setDate(current.getDate() + i * 7); // cada semana
//       dates.push(d);
//     }

//     return dates;
//   }

//   function generateSlots(start: string, end: string): string[] {
//     const slots: string[] = [];
//     const [startH, startM] = start.split(":").map(Number);
//     const [endH, endM] = end.split(":").map(Number);

//     const startDate = new Date();
//     startDate.setHours(startH, startM, 0, 0);

//     const endDate = new Date();
//     endDate.setHours(endH, endM, 0, 0);

//     while (startDate < endDate) {
//       slots.push(
//         startDate.toLocaleTimeString("es-ES", {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//       );
//       startDate.setMinutes(startDate.getMinutes() + 30);
//     }
//     return slots;
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!establishment?.id) {
//       // mostrar error o evitar enviar
//       console.log("No se encontró el establecimiento");
//       return;
//     }

//     try {
//       const body: CreateAppoimentDto = {
//         ...form,
//         establishmentId: establishment.id,
//       };

//       const res = await apiPost<CreateAppoimentDto>(
//         "/public-data/appointments",
//         body,
//       );

//       alert("Turno reservado con éxito!");
//       setForm({
//         name: "",
//         lastname: "",
//         phoneNumber: "",
//         date: new Date(),
//         staffId: "",
//       });
//     } catch (err: any) {
//       alert(err.message || "Error al reservar turno");
//     }
//   };

//   const getImageSrc = (url?: string) => {
//     if (!url) return "";
//     if (url.startsWith("http")) {
//       return url; // Producción: Cloudinary u otra URL pública
//     }
//     return `${process.env.NEXT_PUBLIC_API_URL}${url}`; // Local: concatenar API_URL
//   };

//   const dayNames = [
//     "Domingo",
//     "Lunes",
//     "Martes",
//     "Miércoles",
//     "Jueves",
//     "Viernes",
//     "Sábado",
//   ];

//   console.log("establishment: ", establishment)
//   console.log("staff: ", staff)

//   return (
//     <div className="flex flex-col items-center px-4 py-2 bg-gray-200 text-black min-h-screen">
//       <div className="rounded-full mt-4">
//         {establishment?.profile?.logoUrl ? (
//           <Image
//             src={getImageSrc(establishment?.profile?.logoUrl)}
//             alt={`${establishment.name} logo`}
//             width={30} // 👈 más grande
//             height={30} // 👈 más grande
//             className="h-30 w-30 rounded-full object-cover shadow-md" // 👈 redondo, sin borde
//             unoptimized
//           />
//         ) : (
//           <div className="w-30 h-30 flex items-center justify-center rounded-full bg-gray-200 text-gray-500">
//             Logo pendiente
//           </div>
//         )}
//       </div>
//       <div className="text-center py-4">
//         <h1 className="text-2xl">
//           Reserva tu lugar en{" "}
//           <span className="text-pink-600">{establishment?.name}</span>
//         </h1>
//       </div>

//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-col gap-4 w-full max-w-sm"
//       >
//         {/* Datos personales */}
//         <div className="px-6">
//           <h2 className="text-lg font-semibold mb-2">Tus datos</h2>
//           <div className="px-2">
//             <input
//               type="text"
//               name="name"
//               placeholder="Nombre"
//               value={form.name}
//               onChange={handleChange}
//               className="border p-2 rounded w-full mb-2"
//               required
//             />
//             <input
//               type="text"
//               name="lastname"
//               placeholder="Apellido"
//               value={form.lastname}
//               onChange={handleChange}
//               className="border p-2 rounded w-full mb-2"
//               required
//             />
//             <input
//               type="text"
//               name="phoneNumber"
//               placeholder="Teléfono"
//               value={form.phoneNumber}
//               onChange={handleChange}
//               className="border p-2 rounded w-full"
//               required
//             />
//           </div>
//         </div>

//         {/* Elección del día */}
//         <div className="px-6">
//           <h2 className="text-lg font-semibold mb-2">Elegí el día y horario</h2>
//           <div className="flex flex-col gap-1 text-lg rounded-md px-2 w-full">
//             <div
//               className="flex items-center p-2 border rounded-md cursor-pointer text-center justify-center gap-3"
//               onClick={() => setOpenDays(true)}
//             >
//               <FaCalendarAlt />
//               <p>
//                 {form.date
//                   ? form.date.toLocaleDateString("es-ES", {
//                       weekday: "long",
//                       day: "numeric",
//                       month: "long",
//                     })
//                   : "Seleccioná fecha"}
//               </p>
//             </div>
//             <div
//               className="flex items-center p-2 border rounded-md cursor-pointer text-center justify-center gap-3"
//               onClick={() => setOpenHours(true)}
//             >
//               <FaClock />
//               <p>
//                 {form.date
//                   ? form.date.toLocaleTimeString("es-ES", {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     }) + " hrs"
//                   : "Seleccioná hora"}
//               </p>
//             </div>
//           </div>

//           {openDays && (
//             <div
//               className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 p-4"
//               onClick={() => {
//                 setOpenDays(false);
//                 setSelectedDayOfWeek(null);
//               }}
//             >
//               <div
//                 className="bg-white p-6 rounded-md shadow-lg"
//                 onClick={(e) => e.stopPropagation()} // 👈 evita que el click dentro cierre
//               >
//                 {!selectedDayOfWeek ? (
//                   <>
//                     <h2 className="font-semibold mb-4">Días disponibles</h2>
//                     <div className="grid grid-cols-3 gap-2 justify-items-center">
//                       {establishment?.profile?.schedules
//                         ?.sort((a, b) => a.dayOfWeek - b.dayOfWeek)
//                         .map((s) => (
//                           <button
//                             key={s.id}
//                             onClick={() => setSelectedDayOfWeek(s.dayOfWeek)}
//                             className="w-24 px-3 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 text-center"
//                           >
//                             {dayNames[s.dayOfWeek]}
//                           </button>
//                         ))}
//                     </div>
//                   </>
//                 ) : (
//                   <div className="flex flex-col gap-2">
//                     {getNextDaysOfWeek(selectedDayOfWeek, 4).map(
//                       (date, idx) => (
//                         <button
//                           key={idx}
//                           onClick={() => {
//                             setForm({ ...form, date });
//                             setOpenDays(false);
//                             setSelectedDayOfWeek(null);
//                           }}
//                           className="px-3 py-1 bg-pink-500 text-white rounded hover:bg-pink-600"
//                         >
//                           {date.toLocaleDateString("es-ES", {
//                             weekday: "long",
//                             day: "numeric",
//                             month: "long",
//                           })}
//                         </button>
//                       ),
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {openHours && form.date && (
//             <div
//               className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-40 z-50 p-4"
//               onClick={() => setOpenHours(false)}
//             >
//               <div
//                 className="bg-white p-6 rounded-md shadow-lg"
//                 onClick={(e) => e.stopPropagation()} // 👈 evita cierre al click interno
//               >
//                 <h2 className="font-semibold mb-4">Horarios disponibles</h2>
//                 <div className="flex flex-wrap gap-2">
//                   {establishment?.profile?.schedules
//                     ?.find((s) => s.dayOfWeek === form.date.getDay())
//                     ?.timeRanges.flatMap((tr) =>
//                       generateSlots(tr.start, tr.end),
//                     )
//                     .sort((a, b) => {
//                       const [ah, am] = a.split(":").map(Number);
//                       const [bh, bm] = b.split(":").map(Number);
//                       return ah * 60 + am - (bh * 60 + bm);
//                     })
//                     .map((slot) => (
//                       <button
//                         key={slot}
//                         onClick={() => {
//                           const [h, m] = slot.split(":");
//                           const target = new Date(form.date);
//                           target.setHours(Number(h), Number(m));
//                           setForm({ ...form, date: target });
//                           setOpenHours(false);
//                         }}
//                         className="px-3 py-1 bg-pink-500 text-white rounded hover:bg-pink-600"
//                       >
//                         {slot}
//                       </button>
//                     ))}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Selección de barbero (hardcodeado) */}
//         <div className="px-6">
//           <h2 className="text-lg font-semibold mb-2">
//             Seleccioná un especialista
//           </h2>
//           <div className="flex flex-col gap-2 px-2">
//             {staff.map((member) => (
//               <label
//                 key={member.id}
//                 className="bg-slate-300 p-3 rounded shadow cursor-pointer flex items-center gap-3"
//               >
//                 {/* Avatar o iniciales */}
//                 {member.userProfile?.avatarUrl ? (
//                   <img
//                     src={getImageSrc(member.userProfile.avatarUrl)}
//                     alt={`${member.name} ${member.lastname}`}
//                     className="w-10 h-10 rounded-full border border-gray-600"
//                   />
//                 ) : (
//                   <div className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-500 text-white font-bold">
//                     {member.name.charAt(0)}
//                     {member.lastname.charAt(0)}
//                   </div>
//                 )}

//                 {/* Nombre */}
//                 <p className="text-lg font-semibold flex-1">
//                   {member.name} {member.lastname}
//                 </p>

//                 {/* Checkbox único */}
//                 <input
//                   type="checkbox"
//                   checked={form.staffId === member.id}
//                   onChange={(e) => {
//                     if (e.target.checked) {
//                       setForm({ ...form, staffId: member.id });
//                     } else {
//                       setForm({ ...form, staffId: "" }); // 👈 deselecciona
//                     }
//                   }}
//                   className="w-5 h-5 accent-pink-500"
//                 />
//               </label>
//             ))}
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="bg-pink-500 text-white py-2 rounded shadow mt-4 text-2xl"
//         >
//           Reservar
//         </button>
//       </form>
//     </div>
//   );
// }

export default function TestPage({ params }: { params: { slug: string } }) {
  return (
    <div style={{ padding: '50px' }}>
      <h1>¡El middleware funciona!</h1>
      <p>Estás en el subdominio de turnos y el slug recibido es: {params.slug}</p>
    </div>
  )
}
