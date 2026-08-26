"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { useState } from "react";
import { FaCamera, FaSpinner, FaUser, FaEnvelope, FaPhone, FaUserCheck } from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const { user } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const initials = user
    ? `${user.name?.charAt(0) ?? ""}${user.lastname?.charAt(0) ?? ""}`.toUpperCase()
    : "";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const getAvatarSrc = (avatarUrl: string) => {
    if (!avatarUrl) return null;
    if (avatarUrl.startsWith("http")) {
      return avatarUrl;
    }
    return `${API_URL}${avatarUrl}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (avatarFile && user) {
      setLoading(true);
      try {
        const fd = new FormData();
        fd.append("avatar", avatarFile);

        const res = await fetch(`${API_URL}/user-profiles/${user.id}/avatar`, {
          method: "POST",
          body: fd,
          credentials: "include",
        });

        if (!res.ok) throw new Error("Error al actualizar la foto de perfil");

        const data = await res.json();
        console.log("Avatar actualizado:", data);

        setAvatarFile(null);
        window.location.reload();
      } catch (err) {
        console.error("Error al subir avatar:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!user) {
    return (
      <div className="rounded-2xl border border-pink-600/30 p-8 text-center text-gray-300 min-h-[40vh] flex flex-col items-center justify-center max-w-md mx-auto my-12 shadow-xl">
        <FaUserCheck className="text-4xl text-pink-500 mb-3" />
        <p className="font-semibold text-lg text-white">Sesión no detectada</p>
        <p className="text-sm opacity-80 mt-1">
          Inicia sesión para visualizar y gestionar tu perfil de usuario.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-6 text-white">
      <div className="p-4 sm:p-8 relative overflow-hidden">
        
        {/* Encabezado / Avatar */}
        <div className="flex flex-col items-center justify-center pb-6 border-b border-pink-600/20">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full ring-4 ring-pink-500/40 overflow-hidden bg-gray-900/60 shadow-lg flex items-center justify-center">
              {avatarFile ? (
                <img
                  src={URL.createObjectURL(avatarFile)}
                  alt="Previsualización Avatar"
                  className="w-full h-full object-cover"
                />
              ) : user.userProfile?.avatarUrl ? (
                <img
                  src={getAvatarSrc(user.userProfile.avatarUrl) ?? ""}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-pink-400">
                  {initials || <FaUser className="text-4xl text-pink-400/80" />}
                </span>
              )}
            </div>

            {/* Selector flotante para cambiar foto */}
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-1 right-1 bg-pink-600 hover:bg-pink-700 text-white p-2.5 rounded-full cursor-pointer shadow-lg transition-transform hover:scale-110 flex items-center justify-center border border-pink-400/30"
              title="Cambiar foto de perfil"
            >
              <FaCamera className="text-sm" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <h1 className="mt-4 text-xl sm:text-2xl font-bold text-white tracking-wide text-center">
            {user.name} {user.lastname}
          </h1>
          <span className="text-xs text-pink-400 font-medium bg-pink-950/40 px-3 py-1 rounded-full border border-pink-500/30 mt-1">
            Perfil de Usuario
          </span>

          {/* Formulario/Botón para confirmar carga */}
          {avatarFile && (
            <form onSubmit={handleSubmit} className="w-full max-w-xs mt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
                  loading
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-pink-600 hover:bg-pink-700 text-white shadow-pink-600/30"
                }`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin text-base" />
                    <span>Subiendo imagen...</span>
                  </>
                ) : (
                  <span>Guardar nueva foto</span>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Detalles del perfil */}
        <div className="mt-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Información Personal
          </h2>

          <div className="grid gap-3">
            <div className="flex items-center gap-3.5 bg-gray-900/40 border border-pink-600/20 rounded-xl p-3.5">
              <div className="p-2.5 rounded-lg bg-pink-600/20 text-pink-400">
                <FaUser />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-gray-400">Nombre Completo</p>
                <p className="text-sm font-semibold text-white truncate">
                  {user.name} {user.lastname}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-gray-900/40 border border-pink-600/20 rounded-xl p-3.5">
              <div className="p-2.5 rounded-lg bg-pink-600/20 text-pink-400">
                <FaEnvelope />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-gray-400">Correo Electrónico</p>
                <p className="text-sm font-semibold text-white truncate">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-gray-900/40 border border-pink-600/20 rounded-xl p-3.5">
              <div className="p-2.5 rounded-lg bg-pink-600/20 text-pink-400">
                <FaPhone />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-gray-400">Teléfono</p>
                <p className="text-sm font-semibold text-white truncate">
                  {user.phoneNumber || "No registrado"}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}