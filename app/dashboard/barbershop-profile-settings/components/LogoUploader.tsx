"use client";

import { useRef } from "react";

interface LogoUploaderProps {
  logo: File | null;
  setLogo: (file: File | null) => void;
}

export default function LogoUploader({ logo, setLogo }: LogoUploaderProps) {
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const handleDropLogo = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setLogo(file);
  };

  return (
    <div className="space-y-4">
      {/* Zona de drop */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropLogo}
        className="border-2 border-dashed border-pink-400 rounded-lg p-6 bg-gray-800 text-white flex flex-col items-center space-y-3"
      >
        {logo ? (
          <img
            src={URL.createObjectURL(logo)}
            alt="Logo preview"
            className="mx-auto h-32 object-contain"
          />
        ) : (
          <p>Arrastra el logo aquí</p>
        )}

        {/* Botón Explorar */}
        <button
          type="button"
          onClick={() => logoInputRef.current?.click()}
          className="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-600"
        >
          Explorar
        </button>
        <input
          ref={logoInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setLogo(file);
          }}
        />
      </div>

      {/* Botón Quitar */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setLogo(null)}
          disabled={!logo}
          className={`flex-1 px-4 py-2 rounded font-semibold ${
            logo
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-500 text-gray-300 cursor-not-allowed"
          }`}
        >
          Quitar
        </button>
      </div>
    </div>
  );
}