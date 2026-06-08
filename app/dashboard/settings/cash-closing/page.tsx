"use client";

import { useEstablishment } from "@/app/context/EstablishmentContext";
import { apiPatch } from "@/app/lib/apiPatch";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsToggle2Off, BsToggle2On } from "react-icons/bs";

export interface EstablishmentSettings {
  id: string;
  public_feed: boolean;
  appointments_from_feed: boolean;
  appointments_from_page: boolean;
  clients_in_offerings: boolean;
  cash_closure_enabled: boolean;
  cash_closure_daily: boolean;
  cash_closure_daily_time: string | null; // puede ser hora en formato "HH:mm" o null
  cash_closure_weekly: boolean;
  cash_closure_weekly_day: string | null; // ej: "MONDAY", "TUESDAY" o null
  cash_closure_monthly: boolean;
  registerView: string; // ej: "default"
  establishmentId: string;
}

export default function CashClosingPage() {
  const { activeEstablishment, settings } = useEstablishment();
  const router = useRouter();

  console.log("act: ", activeEstablishment);

  const cashClosureEnabled = settings?.cash_closure_enabled ?? false;
  const dailyCashEnabled = settings?.cash_closure_daily ?? false;
  const weeklyCashEnabled = settings?.cash_closure_weekly ?? false;
  const monthlyCashEnabled = settings?.cash_closure_monthly ?? false;

  // Estados locales
  const [tempCashClosure, setTempCashClosure] =
    useState<boolean>(cashClosureEnabled);
  const [daily, setDaily] = useState<boolean>(dailyCashEnabled);
  const [weekly, setWeekly] = useState<boolean>(weeklyCashEnabled);
  const [monthly, setMonthly] = useState<boolean>(monthlyCashEnabled);

  const handleToggle = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setter((prev) => !prev);
  };

  console.log("set: ", settings);

  const handleSave = async () => {
    try {
      const updated = await apiPatch(
        `/establishments/${activeEstablishment?.id}/settings`,
        {
          cash_closure_enabled: tempCashClosure,
        },
      );
      console.log("Actualizado en backend:", updated);
      window.location.reload();
    } catch (err) {
      console.error("Error al guardar settings:", err);
    }
  };

  const handleUpdate = async (
    field: keyof EstablishmentSettings,
    value: boolean | string | null,
  ) => {
    try {
      const updated = await apiPatch<EstablishmentSettings>(
        `/establishments/${activeEstablishment?.id}/settings`,
        { [field]: value }, // 👈 solo se manda la variable que cambió
      );

      console.log("Actualizado en backend:", updated);

      // 👇 sincronizar todos los estados locales con la respuesta del backend
      setTempCashClosure(updated.cash_closure_enabled ?? false);
      setDaily(updated.cash_closure_daily ?? false);
      setWeekly(updated.cash_closure_weekly ?? false);
      setMonthly(updated.cash_closure_monthly ?? false);
    } catch (err) {
      console.error("Error al guardar settings:", err);
    }
  };

  const hasMainChange =
    tempCashClosure !== (settings?.cash_closure_enabled ?? false);

  // 👇 Detectar cambios respecto a settings originales
  const hasChanges =
    daily !== (settings?.cash_closure_daily ?? false) ||
    weekly !== (settings?.cash_closure_weekly ?? false) ||
    monthly !== (settings?.cash_closure_monthly ?? false);

  useEffect(() => {
    if (settings) {
      setTempCashClosure(settings.cash_closure_enabled ?? false);
      setDaily(settings.cash_closure_daily ?? false);
      setWeekly(settings.cash_closure_weekly ?? false);
      setMonthly(settings.cash_closure_monthly ?? false);
    }
  }, [settings]);

  return (
    <div className="p-6">
      <header className="flex gap-1 border-b border-gray-700 pb-4 text-start text-xl">
        <p onClick={() => router.push(`/dashboard/settings`)}>Configuracion</p>
        <p>{">"}</p>
        <p>Cierre de caja</p>
      </header>

      {!cashClosureEnabled ? (
        <div className="flex flex-col items-center text-center">
          <p className="mb-3 text-gray-300 max-w-md text-lg">
            El cierre de caja no está activado para este establecimiento.
            Actívalo con el toggle y guarda los cambios para habilitarlo.
          </p>

          <button
            onClick={() => handleToggle(setTempCashClosure)}
            className="flex items-center gap-2 px-3 py-1 rounded text-3xl"
          >
            {tempCashClosure ? (
              <>
                <BsToggle2On className="text-green-600 text-5xl" />
                <span>SI</span>
              </>
            ) : (
              <>
                <BsToggle2Off className="text-gray-500 text-5xl" />
                <span>NO</span>
              </>
            )}
          </button>

          {hasMainChange && (
            <button
              onClick={handleSave}
              className="bg-pink-600 hover:bg-pink-700 mt-4 px-4 py-2 rounded text-lg"
            >
              Guardar
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 py-4">
          <div className="flex justify-between items-center">
            <span>Desactivar cierre de caja</span>
            <button
              onClick={async () => {
                try {
                  const updated = await apiPatch(
                    `/establishments/${activeEstablishment?.id}/settings`,
                    {
                      cash_closure_enabled: false,
                      cash_closure_daily: false,
                      cash_closure_weekly: false,
                      cash_closure_monthly: false,
                    },
                  );
                  console.log("Cierre de caja desactivado:", updated);
                  setTempCashClosure(false); // 👈 actualizar estado local
                  window.location.reload();
                } catch (err) {
                  console.error("Error al desactivar cierre de caja:", err);
                }
              }}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
            >
              Desactivar
            </button>
          </div>

          <div className="p-4 border rounded flex justify-between items-center">
            <span>Cierre diario</span>
            <button
              onClick={() => {
                const newVal = !daily;
                setDaily(newVal);
                handleUpdate("cash_closure_daily", newVal);
              }}
            >
              {daily ? (
                <BsToggle2On className="text-green-600 text-3xl" />
              ) : (
                <BsToggle2Off className="text-gray-500 text-3xl" />
              )}
            </button>
          </div>

          <div className="p-4 border rounded flex justify-between items-center">
            <span>Cierre semanal</span>
            <button
              onClick={() => {
                const newVal = !weekly;
                setWeekly(newVal);
                handleUpdate("cash_closure_weekly", newVal);
              }}
            >
              {weekly ? (
                <BsToggle2On className="text-green-600 text-3xl" />
              ) : (
                <BsToggle2Off className="text-gray-500 text-3xl" />
              )}
            </button>
          </div>

          <div className="p-4 border rounded flex justify-between items-center">
            <span>Cierre mensual</span>
            <button
              onClick={() => {
                const newVal = !monthly;
                setMonthly(newVal);
                handleUpdate("cash_closure_monthly", newVal);
              }}
            >
              {monthly ? (
                <BsToggle2On className="text-green-600 text-3xl" />
              ) : (
                <BsToggle2Off className="text-gray-500 text-3xl" />
              )}
            </button>
          </div>

          {hasChanges && (
            <button
              onClick={handleSave}
              className="bg-pink-600 hover:bg-pink-700 mt-4 px-4 py-2 rounded text-lg"
            >
              Guardar cambios
            </button>
          )}
        </div>
      )}
    </div>
  );
}
