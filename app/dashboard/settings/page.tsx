"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { useUserBarbershops } from "@/app/hooks/useUserBarbershops";
import { apiUpdate } from "@/app/lib/apiUpdate";
import { apiGet } from "@/app/lib/apiGet";
import { useState, useEffect } from "react";
import { FiCheckCircle } from "react-icons/fi";

function OnOffToggle({
  value,
  onChange,
  disabled = false,
}: {
  value: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={!disabled ? onChange : undefined}
      className={`relative inline-flex h-8 w-16 px-1 items-center rounded-full transition-colors ${
        disabled
          ? "bg-gray-300 cursor-not-allowed"
          : value
            ? "bg-green-500"
            : "bg-gray-400"
      }`}
    >
      <span
        className={`absolute left-2 text-md font-bold text-white ${value ? "opacity-100" : "opacity-0"}`}
      >
        SI
      </span>
      <span
        className={`absolute right-2 text-md font-bold text-white ${value ? "opacity-0" : "opacity-100"}`}
      >
        NO
      </span>
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
          value ? "translate-x-8" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { activeBarbershop } = useUserBarbershops(user);

  // Estados
  const [feedActivo, setFeedActivo] = useState(false);
  const [turnosDesdeFeed, setTurnosDesdeFeed] = useState(false);
  const [turnosDesdeYourpelu, setTurnosDesdeYourpelu] = useState(false);
  const [clientsIncludes, setClientsIncludes] = useState(false);
  const [cierreCaja, setCierreCaja] = useState(false);
  const [cierreDiario, setCierreDiario] = useState(false);
  const [cierreHorario, setCierreHorario] = useState("18:00");
  const [cierreSemanal, setCierreSemanal] = useState(false);
  const [cierreDiaSemana, setCierreDiaSemana] = useState("Sábado");
  const [showDiasPopup, setShowDiasPopup] = useState(false);
  const [cierreMensual, setCierreMensual] = useState(false);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [initialSettings, setInitialSettings] = useState<any>(null);

  useEffect(() => {
    const loadSettings = async () => {
      if (!activeBarbershop?.id) return;
      try {
        const settings = await apiGet<any>(
          `/barbershops/${activeBarbershop.id}/settings`,
        );
        if (settings) {
          // setear estados con lo que viene del backend
          setFeedActivo(settings.public_feed);
          setTurnosDesdeFeed(settings.appointments_from_feed);
          setTurnosDesdeYourpelu(settings.appointments_from_page);
          setClientsIncludes(settings.clients_in_offerings);
          setCierreCaja(settings.cash_closure_enabled);
          setCierreDiario(settings.cash_closure_daily);
          setCierreHorario(settings.cash_closure_daily_time || "18:00");
          setCierreSemanal(settings.cash_closure_weekly);
          setCierreDiaSemana(settings.cash_closure_weekly_day || "Sábado");
          setCierreMensual(settings.cash_closure_monthly);

          // guardar referencia inicial para comparar cambios
          setInitialSettings(settings);
        }
      } catch (err) {
        console.error("Error cargando configuración:", err);
      }
    };
    loadSettings();
  }, [activeBarbershop?.id]);

  // luego podés calcular hasChanges comparando contra initialSettings
  const hasChanges =
    initialSettings &&
    (feedActivo !== initialSettings.public_feed ||
      turnosDesdeFeed !== initialSettings.appointments_from_feed ||
      turnosDesdeYourpelu !== initialSettings.appointments_from_page ||
      clientsIncludes !== initialSettings.clients_in_offerings ||
      cierreCaja !== initialSettings.cash_closure_enabled ||
      cierreDiario !== initialSettings.cash_closure_daily ||
      cierreHorario !== (initialSettings.cash_closure_daily_time || "18:00") ||
      cierreSemanal !== initialSettings.cash_closure_weekly ||
      cierreDiaSemana !==
        (initialSettings.cash_closure_weekly_day || "Sábado") ||
      cierreMensual !== initialSettings.cash_closure_monthly);

  const handleSave = async () => {
    const payload = {
      public_feed: feedActivo,
      appointments_from_feed: turnosDesdeFeed,
      appointments_from_page: turnosDesdeYourpelu,
      clients_in_offerings: clientsIncludes,
      cash_closure_enabled: cierreCaja,
      cash_closure_daily: cierreDiario,
      cash_closure_daily_time: cierreHorario,
      cash_closure_weekly: cierreSemanal,
      cash_closure_weekly_day: cierreDiaSemana,
      cash_closure_monthly: cierreMensual,
    };

    try {
      await apiUpdate(`/barbershops/${activeBarbershop?.id}/settings`, payload);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000); // popup se cierra solo
    } catch (err) {
      console.error("Error al guardar configuración:", err);
    }
  };

  return (
    <div className="px-4 py-2 flex flex-col space-y-2">
      <section className="p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Feed Público</h2>
        <OnOffToggle
          value={feedActivo}
          onChange={() => setFeedActivo(!feedActivo)}
        />
      </section>

      {/* Gestión de Turnos */}
      <section className="p-4">
        <h2 className="text-lg font-semibold">Gestión de Turnos</h2>
        <div className="mt-2 py-1 flex justify-between items-center">
          <h2 className="text-lg ml-3">Desde feed público</h2>
          <OnOffToggle
            value={turnosDesdeFeed}
            onChange={() => setTurnosDesdeFeed(!turnosDesdeFeed)}
            disabled={!feedActivo}
          />
        </div>
        <div className="mt-2 py-1 flex justify-between items-center">
          <h2 className="text-lg ml-3">Desde yourpelu-turnos</h2>
          <OnOffToggle
            value={turnosDesdeYourpelu}
            onChange={() => setTurnosDesdeYourpelu(!turnosDesdeYourpelu)}
          />
        </div>
      </section>

      {/* Registro de Servicios */}
      <section className="p-4">
        <h2 className="text-lg font-semibold">Registro de Servicios</h2>
        <div className="mt-2 py-2 flex justify-between items-center">
          <h2 className="text-lg ml-3">Incluir selección clientes</h2>
          <OnOffToggle
            value={clientsIncludes}
            onChange={() => setClientsIncludes(!clientsIncludes)}
          />
        </div>
      </section>

      {/* Cierre de Caja */}
      <section className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Cierre de Caja Automático</h2>
          <OnOffToggle
            value={cierreCaja}
            onChange={() => setCierreCaja(!cierreCaja)}
          />
        </div>

        {cierreCaja && (
          <div className="mt-4 space-y-4">
            {/* Diario */}
            <div className="flex justify-between items-center">
              <span className="font-medium">Diario</span>
              <OnOffToggle
                value={cierreDiario}
                onChange={() => setCierreDiario(!cierreDiario)}
              />
            </div>
            {cierreDiario && (
              <div className="mt-2 ml-3 flex justify-around items-center gap-3">
                <label className="block text-sm font-medium">
                  Horario de cierre:{" "}
                </label>
                <input
                  type="text"
                  placeholder="HH:MM"
                  value={cierreHorario}
                  onFocus={() => setCierreHorario("")}
                  onChange={(e) => setCierreHorario(e.target.value)}
                  className="mt-1 w-40 border rounded-md px-2 py-1"
                />
              </div>
            )}

            {/* Semanal */}
            <div className="flex justify-between items-center">
              <span className="font-medium">Semanal</span>
              <OnOffToggle
                value={cierreSemanal}
                onChange={() => setCierreSemanal(!cierreSemanal)}
              />
            </div>
            {cierreSemanal && (
              <div className="mt-2 ml-3 flex justify-around items-center gap-3">
                <label className="block text-sm font-medium">
                  Día de cierre:{" "}
                </label>
                <button
                  onClick={() => setShowDiasPopup(true)}
                  className="w-40 px-3 py-1 text-start rounded-md border"
                >
                  {cierreDiaSemana ? cierreDiaSemana : "Seleccionar día"}
                </button>
              </div>
            )}

            {/* Mensual */}
            <div className="flex justify-between items-center">
              <span className="font-medium">Mensual</span>
              <OnOffToggle
                value={cierreMensual}
                onChange={() => setCierreMensual(!cierreMensual)}
              />
            </div>
          </div>
        )}
      </section>

      {/* Popup de días de la semana */}
      {showDiasPopup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center">
          <div className="w-48 bg-gray-900 rounded-md p-2 shadow-lg">
            {[
              "Lunes",
              "Martes",
              "Miércoles",
              "Jueves",
              "Viernes",
              "Sábado",
              "Domingo",
            ].map((dia) => (
              <button
                key={dia}
                onClick={() => {
                  setCierreDiaSemana(dia);
                  setShowDiasPopup(false);
                }}
                className="block w-full text-left px-3 py-2 hover:bg-pink-100 rounded-md"
              >
                {dia}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Botón de guardar configuración */}
      {hasChanges && (
        <div className="p-4 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-pink-600 text-white rounded-md font-semibold hover:bg-pink-700"
          >
            Guardar configuración
          </button>
        </div>
      )}

      {/* Popup de éxito */}
      {showSuccessPopup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-70 flex items-center justify-center z-50">
          <div className="border border-green-500 bg-gray-800 text-white rounded-lg shadow-lg p-6 flex items-center space-x-3">
            <FiCheckCircle className="text-green-400 text-3xl" />
            <span className="font-semibold">
              Configuración guardada con éxito!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
