"use client";
import { useState } from "react";

function EditableFieldPopup({
  label,
  value,
  placeholder,
  multiline = false,
}: {
  label: string;
  value?: string;
  placeholder: string;
  multiline?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || "");

  const hasValue = !!value && value.trim() !== "";

  return (
    <div className="flex items-center justify-center gap-2">
      <span className="font-semibold text-pink-400">{label}:</span>
      <span
        onClick={() => setEditing(true)}
        className={`cursor-pointer ${
          hasValue ? "text-white" : "italic text-gray-400"
        } hover:text-pink-300`}
      >
        {hasValue ? tempValue : placeholder}
      </span>

      {/* Popup modal */}
      {editing && (
        <div
          className="fixed inset-0 flex items-center justify-center 
                  bg-black/30 backdrop-blur-sm z-50 p-2"
        >
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full text-center">
            <h3 className="text-xl font-semibold mb-4 text-white">
              {placeholder}
            </h3>

            {multiline ? (
              <textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded bg-gray-700 text-white 
                     focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            ) : (
              <input
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-700 text-white 
                     focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            )}

            <div className="flex gap-2 justify-center mt-4">
              <button
                onClick={() => {
                  setEditing(false);
                  console.log("Nuevo valor:", tempValue); // 👈 más adelante tu apiPost
                }}
                className="bg-green-500 text-white px-4 py-2 rounded 
                     hover:bg-green-600 transition font-semibold"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setTempValue(value || "");
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded 
                     hover:bg-gray-700 transition font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditableFieldPopup;
