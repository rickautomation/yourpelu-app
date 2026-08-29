"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { FaRegCalendarAlt } from "react-icons/fa";

type Range = {
  id: string;
  label: string;
};

interface RangeSelectorProps {
  ranges: Range[];
  selectedRange: Range;
  onRangeChange: (id: string) => void;
  showCalendar: boolean;
  setShowCalendar: (value: boolean) => void;
}

export default function RangeSelector({
  ranges,
  selectedRange,
  onRangeChange,
  showCalendar,
  setShowCalendar,
}: RangeSelectorProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="flex items-center gap-4 mb-6">
      {/* Dropdown */}
      <div className="relative flex-1">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full px-3 py-2 bg-luminiBrandBlue border border-pink-500/30 text-white rounded-lg flex justify-between items-center text-lg"
        >
          {selectedRange.label}
          <FiChevronDown
            className={`ml-2 text-xl transition-transform duration-200 ${
              showDropdown ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
        {showDropdown && (
          <ul className="absolute top-full left-0 mt-1 w-full max-h-60 overflow-y-auto bg-luminiBrandBlue border border-pink-600 rounded shadow-lg z-10 text-lg">
            {ranges.map((r) => (
              <li
                key={r.id}
                onClick={() => {
                  onRangeChange(r.id);
                  setShowDropdown(false);

                  // Si el usuario elige "Personalizado", abrimos el calendario automáticamente
                  if (r.id === "custom") {
                    setShowCalendar(true);
                  } else {
                    // Si elige cualquier otra opción predeterminada, cerramos el calendario
                    setShowCalendar(false);
                  }
                }}
                className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer border-t border-gray-700"
              >
                {r.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Botón calendario */}
      <button
        onClick={() => setShowCalendar(!showCalendar)}
        className="bg-luminiBrandBlue border border-pink-500/30 px-2 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2"
      >
        <FaRegCalendarAlt className="w-7 h-7" />
      </button>
    </div>
  );
}