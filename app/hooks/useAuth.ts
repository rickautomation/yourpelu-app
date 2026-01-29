"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { apiGet } from "../lib/apiGet";
import { apiPost } from "../lib/apiPost";

interface User {
  id: string;
  name: string;
  lastname: string;
  phoneNumber: string;
  rol: string;
  avatarUrl?: string;
}

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const data = await apiGet<User>("/auth/me");
      setUser(data);
      setError(null);
    } catch (err: any) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = apiPost<{ ok: boolean }>("/auth/refresh", {}).finally(
          () => {
            isRefreshing = false;
            refreshPromise = null;
          },
        );
      }
      try {
        const refreshRes = await refreshPromise;
        if (refreshRes?.ok) {
          const data = await apiGet<User>("/auth/me");
          setUser(data);
          setError(null);
        } else {
          setError("No autorizado");
          setUser(null);
        }
      } catch {
        setError("No autorizado");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // 👇 ejecutar fetchUser al montar
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = async () => {
    try {
      await apiPost("/auth/logout", {});
    } catch (err) {
      console.error("Error en logout", err);
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  const refreshUser = async (updatedUser?: User) => {
    if (updatedUser) {
      setUser(updatedUser); // 👈 actualiza el estado sin recargar
      setError(null);
      return;
    }
    await fetchUser(); // fallback normal
  };

  const isAuthenticated = !!user && !error;
  const isUnauthorized = !!error && !user;

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isUnauthorized,
    fetchUser,
    refreshUser,
    logout,
    router,
  };
}
