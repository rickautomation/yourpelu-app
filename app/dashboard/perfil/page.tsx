"use client";
import { useAuth } from "@/app/hooks/useAuth";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const { user } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const initials = user
    ? `${user.name.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase()
    : "";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (avatarFile && user) {
      setLoading(true); // 👈 activar loading
      try {
        const fd = new FormData();
        fd.append("avatar", avatarFile);

        const res = await fetch(`${API_URL}/user-profiles/${user.id}/avatar`, {
          method: "POST",
          body: fd,
          credentials: "include",
        });

        const data = await res.json();
        console.log("Avatar actualizado:", data);

        // 👇 resetear estado y recargar para mostrar nueva imagen
        setAvatarFile(null);
        window.location.reload();
      } catch (err) {
        console.error("Error al subir avatar:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      {user ? (
        <>
          {/* Avatar */}
          <div className="flex items-end justify-around">
            <div className="relative w-32 h-32">
              {avatarFile ? (
                <img
                  src={URL.createObjectURL(avatarFile)}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover border"
                />
              ) : user.userProfile?.avatarUrl ? (
                <img
                  src={`${API_URL}${user.userProfile.avatarUrl}`}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover border"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-pink-500 flex items-center justify-center text-white text-3xl font-bold border">
                  {initials}
                </div>
              )}

              {/* Ícono editar */}
              <label className="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full cursor-pointer hover:bg-gray-700">
                ✏️
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Botón subir */}
          {avatarFile && (
            <form onSubmit={handleSubmit} className="mt-4">
              <button
                type="submit"
                disabled={loading} // 👈 deshabilitado mientras carga
                className={`rounded p-2 w-full ${
                  loading
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-pink-500 text-white hover:bg-pink-600"
                }`}
              >
                {loading ? "Subiendo..." : "Subir imagen"}
              </button>
            </form>
          )}

          {/* Información del usuario */}
          <div className="mt-6 space-y-2 text-white text-xl">
            <p>
              <strong>Nombre:</strong> {user.name} {user.lastname}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Teléfono:</strong> {user.phoneNumber}
            </p>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">No hay usuario autenticado.</p>
      )}
    </div>
  );
}