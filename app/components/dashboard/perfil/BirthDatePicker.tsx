"use client";

import { useState } from "react";
import { Listbox } from "@headlessui/react";

interface BirthDatePickerProps {
  value?: string; // formato YYYY-MM-DD
  onChange: (date: string) => void;
}

export default function BirthDatePicker({ value, onChange }: BirthDatePickerProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());
  const months = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];

  // Estados como string, con valores iniciales "Año", "Mes", "Día"
  const [year, setYear] = useState<string>(
    value ? value.split("-")[0] : "Año"
  );
  const [month, setMonth] = useState<string>(
    value ? value.split("-")[1] : "Mes"
  );
  const [day, setDay] = useState<string>(
    value ? value.split("-")[2] : "Día"
  );

  const daysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate();

  const handleChange = (newYear: string, newMonth: string, newDay: string) => {
    if (newYear !== "Año" && newMonth !== "Mes" && newDay !== "Día") {
      const formatted = `${newYear}-${newMonth.padStart(2,"0")}-${newDay.padStart(2,"0")}`;
      onChange(formatted);
    }
  };

  const baseButton =
    "bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 w-full text-sm text-left";
  const baseOptions =
    "absolute mt-1 max-h-40 w-full overflow-auto rounded-lg bg-gray-700 text-white shadow-lg z-50";

  return (
    <div className="flex gap-3">
      {/* Año */}
      <div className="flex-1 relative">
        <Listbox value={year} onChange={(y) => { setYear(y); handleChange(y, month, day); }}>
          <div className="relative">
            <Listbox.Button className={baseButton}>
              {year}
            </Listbox.Button>
            <Listbox.Options className={baseOptions}>
              <Listbox.Option value="Año" className="cursor-pointer px-3 py-1 hover:bg-pink-600">
                Año
              </Listbox.Option>
              {years.map((y) => (
                <Listbox.Option
                  key={y}
                  value={y}
                  className="cursor-pointer px-3 py-1 hover:bg-pink-600"
                >
                  {y}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>

      {/* Mes */}
      <div className="flex-1 relative">
        <Listbox value={month} onChange={(m) => { setMonth(m); handleChange(year, m, day); }}>
          <Listbox.Button className={baseButton}>
            {month}
          </Listbox.Button>
          <Listbox.Options className={baseOptions}>
            <Listbox.Option value="Mes" className="cursor-pointer px-3 py-1 hover:bg-pink-600">
              Mes
            </Listbox.Option>
            {months.map((m, idx) => (
              <Listbox.Option
                key={idx+1}
                value={(idx+1).toString()}
                className="cursor-pointer px-3 py-1 hover:bg-pink-600"
              >
                {m}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
      </div>

      {/* Día */}
      <div className="flex-1 relative">
        <Listbox value={day} onChange={(d) => { setDay(d); handleChange(year, month, d); }}>
          <Listbox.Button className={baseButton}>
            {day}
          </Listbox.Button>
          <Listbox.Options className={baseOptions}>
            <Listbox.Option value="Día" className="cursor-pointer px-3 py-1 hover:bg-pink-600">
              Día
            </Listbox.Option>
            {year !== "Año" && month !== "Mes"
              ? Array.from({ length: daysInMonth(parseInt(year), parseInt(month)) }, (_, i) => (i+1).toString()).map((d) => (
                  <Listbox.Option
                    key={d}
                    value={d}
                    className="cursor-pointer px-3 py-1 hover:bg-pink-600"
                  >
                    {d}
                  </Listbox.Option>
                ))
              : null}
          </Listbox.Options>
        </Listbox>
      </div>
    </div>
  );
}