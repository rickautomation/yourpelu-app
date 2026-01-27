"use client";

import { useState, useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

interface LocationSelectorProps {
  location: { lat: number; lng: number } | null;
  setLocation: React.Dispatch<React.SetStateAction<{ lat: number; lng: number } | null>>;
  defaultAddress?: string; // 👈 nuevo prop
}

export default function LocationSelector({ location, setLocation, defaultAddress }: LocationSelectorProps) {
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (defaultAddress) setAddress(defaultAddress);
  }, [defaultAddress]);

  const handleUseGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  };

  const handleSearchAddress = async () => {
    if (!address) return;
    // Aquí deberías usar fetch a tu backend que llame a Google Geocoding API
    setLocation({ lat: -33.12345, lng: -68.45678 });
  };

  return (
    <div className="px-6 py-4 text-white rounded-lg space-y-6 mb-7">
      <h2 className="text-xl font-bold">📍 Seleccionar ubicación</h2>

      {/* Dirección */}
      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Escribe una dirección..."
          className="px-4 py-2 rounded-lg border shadow focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <button
          onClick={handleSearchAddress}
          className="w-full px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-semibold"
        >
          Buscar dirección
        </button>
      </div>

      {/* GPS */}
      <button
        onClick={handleUseGPS}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
      >
        <FaMapMarkerAlt className="text-lg" /> Usar mi ubicación actual
      </button>

      {/* Preview */}
      {location && (
        <div className="mt-4 p-4 bg-green-600 rounded-lg">
          <p className="font-semibold">Ubicación seleccionada ✅</p>
          <p>
            Lat: <span className="font-mono">{location.lat}</span>, Lng:{" "}
            <span className="font-mono">{location.lng}</span>
          </p>
        </div>
      )}
    </div>
  );
}