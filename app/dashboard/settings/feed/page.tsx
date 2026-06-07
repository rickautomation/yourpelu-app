"use client";

import { useEstablishment } from "@/app/context/EstablishmentContext";
import { useState } from "react";
import { BsToggle2Off, BsToggle2On } from "react-icons/bs";

export default function FeedPage() {
  const { activeEstablishment, settings } = useEstablishment();

  // Valor real desde settings
  const publicFeed = settings?.public_feed ?? false;

  // Valor temporal para edición
  const [tempPublicFeed, setTempPublicFeed] = useState(publicFeed);

  // Guardar cambios en API
  const handleSave = async () => {
    try {
      const res = await fetch(
        `/api/establishments/${activeEstablishment?.id}/settings`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_feed: tempPublicFeed }),
        },
      );
      if (!res.ok) throw new Error("Error al actualizar settings");
      console.log("Actualizado en backend:", tempPublicFeed);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      {!publicFeed ? (
        <div className="flex flex-col items-center text-center">
          {/* Texto explicativo arriba */}
          <p className="mb-3 text-gray-300 max-w-md text-lg">
            El feed público no está activado para este establecimiento. Actívalo
            con el toggle y guarda los cambios para habilitarlo.
          </p>

          {/* Toggle controlado por tempPublicFeed */}
          <button
            onClick={() => setTempPublicFeed(!tempPublicFeed)}
            className="flex items-center gap-2 px-3 py-1 rounded text-3xl"
          >
            {tempPublicFeed ? (
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

          {/* Botón Guardar más pequeño */}
          <button
            onClick={handleSave}
            className="bg-pink-600 hover:bg-pink-700 mt-4 px-4 py-2 rounded text-lg"
          >
            Guardar
          </button>
        </div>
      ) : (
        <>
          {/* Sección: Galería de 4 imágenes */}
          <section className="rounded-lg p-4 bg-exposeBrandBlue shadow-md">
            <h3 className="text-xl font-semibold mb-4">Galería</h3>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-700 rounded flex items-center justify-center text-gray-400"
                >
                  Imagen {i + 1}
                </div>
              ))}
            </div>
            <button className="mt-3 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">
              Subir imágenes
            </button>
          </section>

          {/* Sección: Lema */}
          <section className="rounded-lg p-4 bg-exposeBrandBlue shadow-md">
            <h3 className="text-xl font-semibold mb-4">Lema</h3>
            <input
              type="text"
              placeholder="Escribe tu lema..."
              className="w-full px-3 py-2 rounded bg-gray-800 text-white"
            />
            <div className="flex gap-4 mt-3">
              <button className="flex-1 bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm">
                Guardar
              </button>
              <button className="flex-1 bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm">
                Editar
              </button>
            </div>
          </section>

          {/* Sección: Imagen de portada */}
          <section className="rounded-lg p-4 bg-exposeBrandBlue shadow-md">
            <h3 className="text-xl font-semibold mb-4">Imagen de portada</h3>
            <div className="h-40 bg-gray-700 rounded flex items-center justify-center text-gray-400">
              Portada
            </div>
            <button className="mt-3 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">
              Subir portada
            </button>
          </section>

          {/* Sección: Tema de color */}
          <section className="rounded-lg p-4 bg-exposeBrandBlue shadow-md">
            <h3 className="text-xl font-semibold mb-4">Tema de color</h3>
            <div className="flex gap-4">
              <button className="w-10 h-10 rounded bg-pink-600"></button>
              <button className="w-10 h-10 rounded bg-blue-600"></button>
              <button className="w-10 h-10 rounded bg-green-600"></button>
              <button className="w-10 h-10 rounded bg-yellow-600"></button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
