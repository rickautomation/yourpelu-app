import { useState } from "react";

export default function ConfigurationPage() {
  const [payments, setPayments] = useState({
    efectivo: true,
    tarjeta: false,
    qr: false,
    transferencias: false,
  });

  const [cierreCaja, setCierreCaja] = useState("manual"); // "manual" | "automatico"
  const [feedActivo, setFeedActivo] = useState(false);
  const [turnosActivo, setTurnosActivo] = useState(true);

  return (
    <div className="p-6 flex flex-col space-y-6">
      <h1 className="text-2xl font-bold mb-2 text-center">Configuración</h1>
      <p className="text-pink-400 text-center">
        Administra las opciones generales de tu barbería y personaliza la experiencia.
      </p>

      {/* Métodos de Pago */}
      <section className="border p-4 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Métodos de Pago</h2>
        {Object.keys(payments).map((method) => (
          <label key={method} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={payments[method as keyof typeof payments]}
              onChange={() =>
                setPayments({
                  ...payments,
                  [method]: !payments[method as keyof typeof payments],
                })
              }
            />
            <span className="capitalize">{method}</span>
          </label>
        ))}
      </section>

      {/* Cierre de Caja */}
      <section className="border p-4 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Cierre de Caja</h2>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="cierreCaja"
            checked={cierreCaja === "manual"}
            onChange={() => setCierreCaja("manual")}
          />
          <span>Manual</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="cierreCaja"
            checked={cierreCaja === "automatico"}
            onChange={() => setCierreCaja("automatico")}
          />
          <span>Automático al final del día</span>
        </label>
      </section>

      {/* Feed Interno */}
      <section className="border p-4 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Feed Interno</h2>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={feedActivo}
            onChange={() => setFeedActivo(!feedActivo)}
          />
          <span>Activar publicaciones, fotos y promociones</span>
        </label>
      </section>

      {/* Gestión de Turnos */}
      <section className="border p-4 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Gestión de Turnos</h2>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={turnosActivo}
            onChange={() => setTurnosActivo(!turnosActivo)}
          />
          <span>Activar reservas desde la app</span>
        </label>
      </section>
    </div>
  );
}