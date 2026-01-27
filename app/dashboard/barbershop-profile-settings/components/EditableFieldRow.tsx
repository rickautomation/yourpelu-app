import { useState } from "react";
import { FaEdit } from "react-icons/fa";

export default function EditableFieldRow({
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

  const handleSave = () => {
    setEditing(false);
    console.log("Nuevo valor:", tempValue); // luego API
  };

  const handleCancel = () => {
    setEditing(false);
    setTempValue(value || "");
  };

  return (
    <div className="w-full">
      {/* Título + icono */}
      <div className="flex flex-col items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-pink-400">{label}</span>
          <button
            onClick={() => setEditing(true)}
            className="text-pink-400 hover:text-pink-600"
          >
            <FaEdit />
          </button>
        </div>
        <div>
          <span
            className={`text-lg ${
              hasValue ? "text-white" : "italic text-gray-400"
            }`}
          >
            {hasValue ? tempValue : placeholder}
          </span>
        </div>
      </div>

      {/* Popup modal */}
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-2">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full text-center">
            {multiline ? (
              <textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            ) : (
              <input
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            )}

            <div className="flex gap-2 justify-center mt-4">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition font-semibold"
              >
                Guardar
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition font-semibold"
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
