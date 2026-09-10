"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { apiGet } from "../lib/apiGet";
import { apiPost } from "../lib/apiPost";
import { User } from "../interfaces";

export function useSecureAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const data = await apiGet<User>("/auth/me");
      setUser(data);
      setError(null);
    } catch {
      setUser(null);
      setError("No autorizado");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = async () => {
    try {
      // 1. Petición al backend para limpiar las cookies en la respuesta
      await apiPost("/auth/logout", {});
    } catch (err) {
      console.error("Error en logout", err);
    } finally {
      setUser(null);

      if (typeof window !== "undefined") {
        // 2. Limpieza de respaldo de cookies client-side por si el backend no mandó Set-Cookie expirado
        document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // 3. Limpiar cachés de la PWA/Service Worker para evitar respuestas cacheadas
        if ("caches" in window) {
          try {
            const cacheKeys = await caches.keys();
            await Promise.all(cacheKeys.map((key) => caches.delete(key)));
          } catch (cErr) {
            console.error("Error limpiando cache PWA", cErr);
          }
        }

        // 4. Redirección HTTP dura (obliga a Next.js a ejecutar el Middleware desde cero)
        window.location.href = "/login";
      }
    }
  };

  return {
    user,
    loading,
    error,
    fetchUser,
    logout,
    router,
  };
}