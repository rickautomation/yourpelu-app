"use client";
import { useState } from "react";
import { apiGet } from "@/app/lib/apiGet";
import { useAuth } from "@/app/lib/useAuth";
import DarkDatePicker from "@/app/components/DarkDatePicker";

type BalanceItem = { label: string; totalIncome: number };
type CloseDayResponse = {
  byBarber: BalanceItem[];
  byType: BalanceItem[];
  byStyle: BalanceItem[];
  total: number;
};
type BalanceResponse = { items: BalanceItem[]; total: number };

export default function ReportsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"barber" | "style" | "type" | "month">(
    "month"
  );
  const [balance, setBalance] = useState<BalanceResponse | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);

  const [closeDay, setCloseDay] = useState<CloseDayResponse | null>(null);
  const [loadingDay, setLoadingDay] = useState(false);

  const [dailyBalance, setDailyBalance] = useState<CloseDayResponse | null>(
    null
  );
  const [loadingDaily, setLoadingDaily] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const [view, setView] = useState<"none" | "balance" | "closeDay" | "daily">(
    "none"
  );

  // Balance anual
  const fetchBalance = async (
    selectedFilter?: "barber" | "style" | "type" | "month"
  ) => {
    const effectiveFilter = selectedFilter ?? filter;
    console.log("filter en fetchBalance: ", effectiveFilter);
    if (!user?.barbershop?.id) return;
    setLoadingBalance(true);
    try {
      const year = new Date().getFullYear();
      const data = await apiGet<BalanceResponse>(
        `/reports/barbershop/${user.barbershop.id}/balance?year=${year}&filter=${effectiveFilter}`
      );
      setBalance(data);
      setView("balance");
    } catch (err) {
      console.error("Error al obtener el balance", err);
    } finally {
      setLoadingBalance(false);
    }
  };

  // Cierre de caja del día actual
  const fetchCloseDay = async () => {
    if (!user?.barbershop?.id) return;
    setLoadingDay(true);
    try {
      const data = await apiGet<CloseDayResponse>(
        `/reports/barbershop/${user.barbershop.id}/close-today`
      );
      setCloseDay(data);
      setView("closeDay");
    } catch (err) {
      console.error("Error al obtener cierre de caja", err);
    } finally {
      setLoadingDay(false);
    }
  };

  // Balance diario por fecha
  const fetchDailyBalance = async () => {
    if (!user?.barbershop?.id) return;
    setLoadingDaily(true);
    try {
      const data = await apiGet<CloseDayResponse>(
        `/reports/barbershop/${user.barbershop.id}/daily-balance?date=${selectedDate}`
      );
      setDailyBalance(data);
      setView("daily");
    } catch (err) {
      console.error("Error al obtener balance diario", err);
    } finally {
      setLoadingDaily(false);
    }
  };

  return (
    <div className="px-1 space-y-4">
      {/* Menú inicial */}
      {view === "none" && (
        <div className="space-y-4">
          <div className="bg-gray-900 p-4 rounded-lg flex items-center justify-between">
            <span className="text-lg font-bold text-white">Cierre de Caja</span>
            <button
              onClick={fetchCloseDay}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-4 py-3 rounded"
            >
              Cerrar día
            </button>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg flex items-center justify-between">
            <span className="text-lg font-bold text-white">Balance Anual</span>
            <button
              onClick={() => fetchBalance()} // ahora sí coincide con MouseEventHandler
              className="bg-green-600 hover:bg-green-700 text-white text-lg px-4 py-3 rounded"
            >
              Ver balance
            </button>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg flex items-center justify-between">
            <span className="text-lg font-bold text-white">Balance Diario</span>
            <button
              onClick={() => setView("daily")}
              className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-4 py-3 rounded"
            >
              Ver balance
            </button>
          </div>
        </div>
      )}

      {/* Balance anual */}
      {view === "balance" && balance && (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="text-white mr-2">Filtrar por:</label>
            <select
              value={filter}
              onChange={(e) => {
                const newFilter = e.target.value as
                  | "barber"
                  | "style"
                  | "type"
                  | "month";
                setFilter(newFilter);
                fetchBalance(newFilter); // aquí sí pasás el argumento explícito
              }}
              className="bg-gray-700 text-white px-3 py-2 rounded"
            >
              <option value="barber">Barberos</option>
              <option value="style">Estilos</option>
              <option value="type">Tipos</option>
              <option value="month">Meses</option>
            </select>
          </div>

          {loadingBalance ? (
            <p className="text-gray-400">Cargando balance...</p>
          ) : (
            <>
              <ul className="text-gray-300">
                {balance.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between border-b border-gray-700 py-1"
                  >
                    <span>
                      {filter === "month"
                        ? new Date(item.label).toLocaleDateString("es-AR", {
                            month: "long",
                          })
                        : item.label}
                    </span>
                    <span className="text-green-400 font-bold">
                      ${item.totalIncome.toLocaleString("es-AR")}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between mt-4 border-t border-gray-600 pt-2">
                <span className="text-white font-semibold">TOTAL</span>
                <span className="text-yellow-400 text-xl font-bold">
                  ${balance.total.toLocaleString("es-AR")}
                </span>
              </div>
            </>
          )}

          <div className="mt-4 text-center">
            <button
              onClick={() => setView("none")}
              className="bg-gray-600 hover:bg-gray-700 text-white text-lg px-6 py-3 rounded"
            >
              Volver
            </button>
          </div>
        </div>
      )}

      {/* Cierre de caja diario */}
      {view === "closeDay" && closeDay && (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Por Barbero
            </h3>
            <ul className="text-gray-300">
              {closeDay.byBarber.map((item, idx) => (
                <li
                  key={idx}
                  className="flex justify-between border-b border-gray-700 py-1"
                >
                  <span>{item.label}</span>
                  <span className="text-green-400 font-bold">
                    ${item.totalIncome.toLocaleString("es-AR")}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Por Tipo</h3>
            <ul className="text-gray-300">
              {closeDay.byType.map((item, idx) => (
                <li
                  key={idx}
                  className="flex justify-between border-b border-gray-700 py-1"
                >
                  <span>{item.label}</span>
                  <span className="text-green-400 font-bold">
                    ${item.totalIncome.toLocaleString("es-AR")}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Por Estilo
            </h3>
            <ul className="text-gray-300">
              {closeDay.byStyle.map((item, idx) => (
                <li
                  key={idx}
                  className="flex justify-between border-b border-gray-700 py-1"
                >
                  <span>{item.label}</span>
                  <span className="text-green-400 font-bold">
                    ${item.totalIncome.toLocaleString("es-AR")}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between mt-4 border-t border-gray-600 pt-2">
            <span className="text-white font-semibold">TOTAL DEL DÍA</span>
            <span className="text-yellow-400 text-xl font-bold">
              ${closeDay.total.toLocaleString("es-AR")}
            </span>
          </div>

          {/* Botón volver */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setView("none")}
              className="bg-gray-600 hover:bg-gray-700 text-white text-lg px-6 py-3 rounded"
            >
              Volver
            </button>
          </div>
        </div>
      )}

      {view === "daily" && (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <DarkDatePicker
              selectedDate={selectedDate ? new Date(selectedDate) : null}
              setSelectedDate={(date) =>
                setSelectedDate(date ? date.toISOString().split("T")[0] : "")
              }
            />
            <button
              onClick={fetchDailyBalance}
              className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-4 py-2 rounded-lg"
            >
              Consultar
            </button>
          </div>

          {loadingDaily && (
            <p className="text-gray-400">Cargando balance diario...</p>
          )}

          {dailyBalance && (
            <>
              {/* Por Barbero */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Por Barbero
                </h3>
                <ul className="text-gray-300">
                  {dailyBalance.byBarber.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between border-b border-gray-700 py-1"
                    >
                      <span>{item.label}</span>
                      <span className="text-green-400 font-bold">
                        ${item.totalIncome.toLocaleString("es-AR")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Por Tipo */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Por Tipo
                </h3>
                <ul className="text-gray-300">
                  {dailyBalance.byType.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between border-b border-gray-700 py-1"
                    >
                      <span>{item.label}</span>
                      <span className="text-green-400 font-bold">
                        ${item.totalIncome.toLocaleString("es-AR")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Por Estilo */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Por Estilo
                </h3>
                <ul className="text-gray-300">
                  {dailyBalance.byStyle.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between border-b border-gray-700 py-1"
                    >
                      <span>{item.label}</span>
                      <span className="text-green-400 font-bold">
                        ${item.totalIncome.toLocaleString("es-AR")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Total */}
              <div className="flex justify-between mt-4 border-t border-gray-600 pt-2">
                <span className="text-white font-semibold">TOTAL DEL DÍA</span>
                <span className="text-yellow-400 text-xl font-bold">
                  ${dailyBalance.total.toLocaleString("es-AR")}
                </span>
              </div>
            </>
          )}

          {/* Botón volver */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setView("none")}
              className="bg-gray-600 hover:bg-gray-700 text-white text-lg px-6 py-3 rounded"
            >
              Volver
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
