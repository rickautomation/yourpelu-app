"use client";
import { useState, useMemo, useEffect } from "react";
import { apiPost } from "@/app/lib/apiPost";
import { Barbershop } from "@/app/interfaces";
import NewOfferingFromTemplatePage from "@/app/dashboard/offerings/new/from-template/page";
import { useAuth } from "@/app/hooks/useAuth";
import { WizardProvider } from "@/app/context/WizardContext";
import { useRouter } from "next/navigation";
import { apiGet } from "@/app/lib/apiGet";
import { MdUploadFile } from "react-icons/md";
import { useUserEstablishment } from "@/app/hooks/useUserEstablishment";

type Schedule = {
  id: string;
  dayOfWeek: number;
  start: string | null;
  end: string | null;
};

interface WizardProps {
  onFinish?: () => void;
  userName: string;
  userId: string;
  step?: number; // 👈 nuevo prop
}

type EstablishmentType = {
  id: string;
  name: string;
  description: string;
};

type Interval = { start: string; end: string };

type DaySchedule = {
  dayOfWeek: number; // 1 = lunes, 7 = domingo
  intervals: Interval[];
};

export default function BarbershopSetupWizard({
  userName,
  userId,
  step: initialStep = 0,
}: WizardProps) {
  const { user } = useAuth();
  const { activeEstablishment } = useUserEstablishment(user);
  const [types, setTypes] = useState<EstablishmentType[]>([]);
  const [hours, setHours] = useState<
    { dayOfWeek: number; start: string; end: string }[]
  >([]);

  const router = useRouter();

  console.log("user: ", user);
  console.log("activeEstablishment: ", activeEstablishment);

  const [step, setStep] = useState(initialStep); // Si ya se está renderizando, salta al paso 2
  const [formData, setFormData] = useState<{
    name: string;
    address: string;
    phoneNumber: string;
    typeId: string;
    id?: string; // 👈 para guardar el id del establecimiento creado
    logoFile?: File; // 👈 para guardar el archivo del logo
    logoUploaded?: boolean;
  }>({
    name: "",
    address: "",
    phoneNumber: "",
    typeId: "",
  });
  const [success, setSuccess] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [bookingEnabled, setBookingEnabled] = useState<boolean | null>(null);
  const [schedules, setSchedules] = useState<DaySchedule[]>([]);

  const [tempStart, setTempStart] = useState<string>("");
  const [tempEnd, setTempEnd] = useState<string>("");

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const sessionId = useMemo(() => {
    return typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : String(Date.now());
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // agregar un intervalo a un día
  function addInterval(dayOfWeek: number, start: string, end: string) {
    setSchedules((prev) => {
      const existing = prev.find((s) => s.dayOfWeek === dayOfWeek);
      if (existing) {
        return prev.map((s) =>
          s.dayOfWeek === dayOfWeek
            ? { ...s, intervals: [...s.intervals, { start, end }] }
            : s,
        );
      } else {
        return [...prev, { dayOfWeek, intervals: [{ start, end }] }];
      }
    });
  }

  async function saveSchedules(profileId: string) {
    for (const schedule of schedules) {
      await apiPost(
        `/establishment/${profileId}/schedules/${schedule.dayOfWeek}`,
        {
          intervals: schedule.intervals,
        },
      );
    }
  }

  const saveHours = async (
    profileId: string,
    hours: { dayOfWeek: number; start: string; end: string }[],
  ) => {
    try {
      await apiPost(`/profiles/${profileId}/opening-hours`, hours);
      alert("Horarios guardados correctamente");
    } catch (err: any) {
      alert("Error: " + err.message);
      throw err;
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await apiPost<{ establishment: Barbershop }>(
        "/establishment",
        {
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          userId,
          sessionId,
          typeId: formData.typeId,
        },
      );

      const establishment = response.establishment;
      console.log("Establecimiento creado:", establishment);

      await apiPost("/current-establishments/set", {
        userId,
        barbershopId: response.establishment.id,
        sessionId,
      });

      router.refresh();

      setFormData((prev) => ({ ...prev, id: establishment.id })); // 👈 guardar id
      setSuccess(true);
    } catch (error) {
      console.error("Error creando barbería:", error);
    }
  };

  function groupByDay(schedules: Schedule[]) {
    const grouped: Record<number, { start: string; end: string }[]> = {};
    schedules.forEach((s) => {
      if (!grouped[s.dayOfWeek]) grouped[s.dayOfWeek] = [];
      if (s.start && s.end) {
        grouped[s.dayOfWeek].push({ start: s.start, end: s.end });
      }
    });
    return grouped;
  }

  // Función separada
  const handleAddScheduleDays = async () => {
    if (activeEstablishment?.profile?.id) {
      // Mapeamos nombres de días a números (ej: lunes=1, domingo=7)
      const dayMap: Record<string, number> = {
        Lunes: 1,
        Martes: 2,
        Miércoles: 3,
        Jueves: 4,
        Viernes: 5,
        Sábado: 6,
        Domingo: 7,
      };

      const days = selectedDays.map((d) => dayMap[d]);
      await addScheduleDays(activeEstablishment.profile.id, days);

      setStep(6); // avanzar al siguiente paso
      router.push("/dashboard/initial-setup?step=6");
    } else {
      router.refresh()
      alert("Todavía no se creó el establecimiento");
    }
  };

  // 👇 función que usa tu helper apiPost
  async function enableBooking(establishmentId: string) {
    return apiPost(`/establishment/${establishmentId}/enable-booking`, {});
  }

  async function addScheduleDays(profileId: string, days: number[]) {
    return apiPost(`/establishment/${profileId}/schedule-days`, { days });
  }

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const fetchedTypes =
          await apiGet<EstablishmentType[]>(`/establishment-types`);
        setTypes(fetchedTypes);
      } catch (err) {
        console.error("Error cargando tipos de establecimiento:", err);
      }
    };

    setStep(initialStep);
    loadTypes();
  }, [initialStep, activeEstablishment]);

  return (
    <WizardProvider>
      <div className="text-white">
        {step === 0 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Hola {userName}!</h2>
            <p className="mb-6">
              Vamos a configurar tu establecimiento. Completa los datos y la
              crearemos en el sistema.
            </p>
            <button
              onClick={() => setStep(1)}
              className="bg-green-500 px-6 py-2 rounded font-semibold"
            >
              Empezar
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="px-4 py-3">
            <h2 className="text-lg text-center font-bold mb-4">
              Elige el tipo de establecimiento
            </h2>

            <div className="flex flex-col gap-3">
              {types.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setFormData({ ...formData, typeId: t.id });
                    setStep(2);
                  }}
                  className="bg-darkBrandBlue shadow-lg text-white px-4 py-4 rounded hover:bg-pink-500 transition-colors font-semibold"
                >
                  <p>{t.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="px-4 py-3">
            {!success ? (
              <form
                className="flex flex-col gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  await handleSubmit();
                  setSuccess(true);
                }}
              >
                <h2 className="text-xl text-center font-bold mb-4">
                  Vamos a darle vida a tu establecimiento
                </h2>

                <div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Nombre"
                    required
                    className="px-3 py-2 rounded bg-luminiBrandBlue text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Dirección o ciudad"
                    required
                    className="px-3 py-2 rounded bg-luminiBrandBlue text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleChange("phoneNumber", e.target.value)
                    }
                    placeholder="Número de contacto"
                    required
                    className="px-3 py-2 rounded bg-luminiBrandBlue text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors font-semibold"
                >
                  Continuar
                </button>
              </form>
            ) : (
              <div className="mt-4 text-center">
                {/* 👇 Nuevo bloque para subir logo */}
                {!formData.logoUploaded && (
                  <form
                    className="flex flex-col gap-4 mb-6"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!formData.logoFile || !formData.id) return;

                      const fd = new FormData();
                      fd.append("logo", formData.logoFile);

                      try {
                        const res = await fetch(
                          `${process.env.NEXT_PUBLIC_API_URL}/establishment/${formData.id}/upload-logo`,
                          {
                            method: "POST",
                            body: fd,
                            credentials: "include",
                          },
                        );

                        if (!res.ok) {
                          throw new Error(`Error HTTP ${res.status}`);
                        }

                        alert("Logo subido con éxito ✅");
                        setFormData({ ...formData, logoUploaded: true }); // 👈 habilita el botón
                      } catch (err: any) {
                        alert(err.message || "Error al subir logo");
                      }
                    }}
                  >
                    <div className="relative w-full h-32 border-2 border-dashed border-gray-600 rounded flex items-center justify-center bg-luminiBrandBlue overflow-hidden">
                      {/* Input invisible pero funcional */}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            logoFile: e.target.files?.[0],
                          })
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />

                      {/* Ícono o vista previa */}
                      {!formData.logoFile ? (
                        <div className="flex flex-col items-center justify-center gap-2 text-pink-500">
                          <MdUploadFile className=" text-5xl pointer-events-none" />
                          <p>Subir Logo</p>
                        </div>
                      ) : (
                        <img
                          src={URL.createObjectURL(formData.logoFile)}
                          alt="Vista previa del logo"
                          className="absolute inset-0 w-full h-full object-contain rounded pointer-events-none"
                        />
                      )}
                    </div>

                    <button
                      type="submit"
                      className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors font-semibold mt-4"
                    >
                      Guardar
                    </button>
                  </form>
                )}

                {/* 👇 Botón para pasar a configurar servicios */}
                {formData.logoUploaded && (
                  <div className="flex flex-col gap-3">
                    <p className="text-lg mb-4">
                      ¡Logo agregado con éxito! Ahora vamos a configurar los
                      servicios que ofrecerás.
                    </p>

                    <button
                      onClick={() => {
                        setStep(3);
                        router.push("/dashboard/initial-setup?step=3");
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors font-semibold"
                    >
                      Configurar servicios
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <>
            <NewOfferingFromTemplatePage inWizard={true} />
          </>
        )}

        {step === 4 && (
          <div className="text-center p-4 ">
            <h2 className="text-xl font-semibold mb-4">
              ¿Deseas manejar turnos desde la app?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => setBookingEnabled(true)}
                className={`border border-pink-600 px-6 py-2 rounded font-medium transition-colors
          ${bookingEnabled === true && "bg-pink-600 text-white"}`}
              >
                Sí
              </button>
              <button
                type="button"
                onClick={() => setBookingEnabled(false)}
                className={`border border-pink-600 px-6 py-2 rounded font-medium transition-colors
          ${bookingEnabled === false && "bg-pink-600 text-white"}`}
              >
                No
              </button>
            </div>
            <div className="p-4 mt-8">
              <button
                className="bg-pink-600 px-8 py-2 rounded text-lg"
                onClick={async () => {
                  if (bookingEnabled === true) {
                    const establishmentId =
                      formData.id ?? activeEstablishment?.profile?.id; // usa el primero definido

                    if (establishmentId) {
                      await enableBooking(establishmentId);
                      setStep(5);
                      router.push("/dashboard/initial-setup?step=5");
                    } else {
                      alert("Todavía no se creó el establecimiento");
                    }
                  } else {
                    setStep(7);
                  }
                }}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="text-center p-4">
            <h2 className="text-xl font-semibold mb-4">
              Seleccioná los días de atención
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes",
                "Sábado",
                "Domingo",
              ].map((day) => (
                <div
                  key={day}
                  onClick={() =>
                    setSelectedDays((prev) =>
                      prev.includes(day)
                        ? prev.filter((d) => d !== day)
                        : [...prev, day],
                    )
                  }
                  className={`cursor-pointer border border-pink-600 text-pink-600 rounded p-4 font-medium transition-colors
            ${selectedDays.includes(day) && "bg-pink-600 text-white"}`}
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="flex justify-center p-4 mt-8">
              <button
                className="bg-pink-600 px-12 py-2 rounded text-lg"
                onClick={handleAddScheduleDays}
              >
                Hecho
              </button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="text-center p-4">
            <h2 className="text-xl font-semibold mb-4">
              Definí los horarios de atención
            </h2>

            {(() => {
              // agrupamos los schedules por día
              const groupedSchedules: Record<
                number,
                { start: string; end: string }[]
              > = {};
              (activeEstablishment?.profile?.schedules ?? []).forEach((s) => {
                if (!groupedSchedules[s.dayOfWeek])
                  groupedSchedules[s.dayOfWeek] = [];
                if (s.start && s.end) {
                  groupedSchedules[s.dayOfWeek].push({
                    start: s.start,
                    end: s.end,
                  });
                }
              });

              return Object.entries(groupedSchedules).map(
                ([dayOfWeek, intervals]) => (
                  <div key={dayOfWeek} className="mb-6">
                    <h3 className="text-lg font-medium mb-2">
                      {
                        [
                          "Domingo",
                          "Lunes",
                          "Martes",
                          "Miércoles",
                          "Jueves",
                          "Viernes",
                          "Sábado",
                        ][Number(dayOfWeek)]
                      }
                    </h3>

                    {/* Mostrar intervalos ya agregados */}
                    {intervals.map((interval, idx) => (
                      <div key={idx} className="flex justify-center gap-4 mb-2">
                        <span>
                          {interval.start} - {interval.end}
                        </span>
                      </div>
                    ))}

                    {/* Inputs para agregar un nuevo intervalo */}
                    <div className="flex justify-center gap-4">
                      <input
                        type="time"
                        value={tempStart}
                        onChange={(e) => setTempStart(e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                      <input
                        type="time"
                        value={tempEnd}
                        onChange={(e) => setTempEnd(e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                      <button
                        className="bg-pink-600 text-white px-4 py-1 rounded"
                        onClick={() => {
                          if (tempStart && tempEnd) {
                            addInterval(Number(dayOfWeek), tempStart, tempEnd);
                            setTempStart("");
                            setTempEnd("");
                          }
                        }}
                      >
                        Agregar intervalo
                      </button>
                    </div>
                  </div>
                ),
              );
            })()}

            {/* Botón para guardar todos los horarios */}
            <div className="flex justify-center p-4 mt-8">
              <button
                className="bg-pink-600 px-12 py-2 rounded text-lg"
                onClick={async () => {
                  const id = formData.id ?? activeEstablishment?.profile?.id;

                  if (!id) {
                    alert("Todavía no se creó el establecimiento");
                    return;
                  }

                  await saveSchedules(id); // ahora id es seguro string
                  setStep(7); // avanzar al siguiente paso
                  router.push("/dashboard/initial-setup?step=7");
                }}
              >
                Guardar horarios
              </button>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">¡Listo!</h2>
            <p className="mb-6">
              Has completado la configuración de tu barbería. Puedes empezar a
              gestionar tus servicios y barberos.
            </p>
            <p>
              ya puedes agregar barberos y gestionar tu barbería desde el menú
              de navegación.
            </p>

            <button
              onClick={() => {
                window.location.href = "/dashboard";
              }}
              className="mt-4 bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors font-semibold"
            >
              Terminar
            </button>
          </div>
        )}
      </div>
    </WizardProvider>
  );
}
