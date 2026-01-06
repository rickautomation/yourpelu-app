"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiGet } from "./apiGet";
import { apiPost } from "./apiPost";

type Barbershop = {
  id: string;
  name: string;
};

interface User {
  id: string;
  name: string;
  lastname: string;
  phoneNumber: string;
  rol: string;
  barbershop: Barbershop | null;  
  barbershops?: Barbershop[];  
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

      // 👇 si es admin, pedimos barbería activa y todas
      if (data.rol === "admin") {
        try {
          const current = await apiGet<{ barbershop: Barbershop }>(
            `/current-barbershops/user/${data.id}/last`
          );
          if (current?.barbershop) {
            data.barbershop = current.barbershop;
          }
          const all = await apiGet<Barbershop[]>(
            `/barbershops/user/${data.id}/all`
          );
          data.barbershops = all;
        } catch (err) {
          console.error("Error cargando barberías de admin", err);
        }
      }

      // 👇 si es barber, pedimos su única barbería
      if (data.rol === "barber") {
        try {
          const all = await apiGet<Barbershop[]>(
            `/barbershops/user/${data.id}/all`
          );
          data.barbershops = all;
          data.barbershop = all.length > 0 ? all[0] : null;
        } catch (err) {
          console.error("Error cargando barbería de barber", err);
        }
      }

      // 👇 si es client, pedimos todas sus barberías
      if (data.rol === "client") {
        try {
          const all = await apiGet<Barbershop[]>(
            `/barbershops/user/${data.id}/all`
          );
          data.barbershops = all;
          // opcional: setear la primera como activa
          data.barbershop = all.length > 0 ? all[0] : null;
        } catch (err) {
          console.error("Error cargando barberías de client", err);
        }
      }

      setUser(data);
      setError(null);
    } catch (err: any) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = apiPost<{ ok: boolean }>("/auth/refresh", {}).finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });
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

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const isAuthenticated = !!user && !error;
  const isUnauthorized = !!error && !user;

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

  const refreshUser = async () => {
    await fetchUser();
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isUnauthorized,
    router,
    logout,
    refreshUser,
    avatarUrl: user?.avatarUrl || null,
  };
}