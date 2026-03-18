"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { apiGet } from "../lib/apiGet";
import { apiPost } from "../lib/apiPost";

interface UserProfile {
  id: string;
  avatarUrl?: string;
  bio?: string;
  birthDate?: string;
  address?: string;
}

interface User {
  id: string;
  name: string;
  lastname: string;
  phoneNumber: string;
  email: string;
  rol: string;
  userProfile?: UserProfile;
}

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const data = await apiGet<User>("/auth/me");
      setUser(data); // 👈 ya trae userProfile embebido
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

          let profile: UserProfile | null = null;
          if (data?.id) {
            try {
              profile = await apiGet<UserProfile>(`/user-profiles/${data.id}`);
            } catch {
              profile = null;
            }
          }

          setUser({ ...data, userProfile: profile || undefined });
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
      // 👇 este finally se ejecuta siempre, tanto si el try inicial funciona como si falla
      setLoading(false);
    }
  }, []);

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
