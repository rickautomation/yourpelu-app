"use client";

import { useRef } from "react";

interface CarouselUploaderProps {
  carouselImages: File[];
  setCarouselImages: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function CarouselUploader({
  carouselImages,
  setCarouselImages,
}: CarouselUploaderProps) {
  const carouselInputRef = useRef<HTMLInputElement | null>(null);

  const handleDropCarousel = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length) {
      setCarouselImages((prev) => [...prev, ...files].slice(0, 4));
    }
  };

  return (
    <div className="space-y-4 px-6 py-4">
      {/* Título y descripción */}
      <h3 className="text-xl font-bold text-pink-400 text-center">
        Carrusel de imágenes 📸
      </h3>
      <p className="text-gray-400 text-sm text-center">
        Sube fotos que representen tu barbería: 
        trabajos, ambiente o estilo. Estas imágenes aparecerán en tu feed 
        como una galería visual para tus clientes.
      </p>

      {/* Zona de drop */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropCarousel}
        className="border-2 border-dashed border-pink-400 rounded-lg p-6 bg-gray-800 text-white flex flex-col items-center space-y-3"
      >
        {carouselImages.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 w-full">
            {carouselImages.map((file, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-2">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Imagen ${idx + 1}`}
                  className="h-32 w-full object-cover rounded"
                />
                <button
                  onClick={() =>
                    setCarouselImages((prev) =>
                      prev.filter((_, i) => i !== idx)
                    )
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm font-semibold"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>Arrastra hasta 4 imágenes aquí</p>
        )}

        <button
          type="button"
          onClick={() => carouselInputRef.current?.click()}
          className="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-600"
        >
          Explorar
        </button>
        <input
          ref={carouselInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            if (files.length) {
              setCarouselImages((prev) => [...prev, ...files].slice(0, 4));
            }
          }}
        />
      </div>

      {/* Botón Quitar todas solo si hay imágenes */}
      {carouselImages.length > 0 && (
        <div className="flex justify-center gap-4 mt-2">
          <button
            onClick={() => setCarouselImages([])}
            className="flex-1 px-4 py-2 rounded font-semibold bg-red-500 text-white hover:bg-red-600"
          >
            Quitar todas
          </button>
        </div>
      )}
    </div>
  );
}