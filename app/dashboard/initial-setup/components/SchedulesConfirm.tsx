"use client";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import { apiDelete } from "@/app/lib/apiDelete";
import { useRouter } from "next/navigation";

interface ActionButtonsProps {
  setStep: (step: number) => void;
}

const SchedulesConfirm: React.FC<ActionButtonsProps> = ({ setStep }) => {
  const { activeEstablishment } = useEstablishment();
  const router = useRouter();

  const schedules = (activeEstablishment?.profile?.schedules || []).sort(
    (a, b) => {
      const order = [1, 2, 3, 4, 5, 6, 0]; // Lunes primero, Domingo último
      return order.indexOf(a.dayOfWeek) - order.indexOf(b.dayOfWeek);
    },
  );

  const dayNames: Record<number, string> = {
    0: "Domingo",
    1: "Lunes",
    2: "Martes",
    3: "Miércoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado",
  };

  const handleContinue = () => {
    if (setStep) {
      setStep(10); // solo si existe
    }
  };

  const handleEdit = async () => {
    try {
      // 👇 ejecuta DELETE antes de navegar
      await apiDelete<{ ok: boolean }>(
        `/establishment/${activeEstablishment?.id}/schedules`,
      );

      // si todo salió bien, avanza al paso 7
      setStep(7);
      router.push("/dashboard/initial-setup?step=7");
    } catch (err: any) {
      alert(`Error al borrar horarios: ${err.message}`);
    }
  };
  return (
    <div>
      <div className="mt-6 text-left max-w-md mx-auto px-2">
        {schedules
          .filter((sch) => sch.timeRanges && sch.timeRanges.length > 0)
          .map((sch) => (
            <div key={sch.id} className="mb-2 flex items-center">
              <p className="font-semibold w-24">{dayNames[sch.dayOfWeek]}</p>
              <p className="text-sm">
                {sch.timeRanges
                  .map((tr) => `${tr.start} a ${tr.end}`)
                  .join(" y de ")}
              </p>
            </div>
          ))}
      </div>
      <div className="mt-6 flex gap-4 w-full max-w-md mx-auto px-2">
        <button
          onClick={handleEdit}
          className="flex-1 bg-pink-600 text-white px-6 py-2 rounded font-semibold hover:bg-pink-700 transition-colors"
        >
          Editar
        </button>
        <button
          onClick={handleContinue}
          className="flex-1 bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default SchedulesConfirm;
