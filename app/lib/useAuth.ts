"use client";
import { useEffect, useState } from "react";
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
  barbershop?: Barbershop;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await apiGet<User>("/auth/me");
        setUser(data);
        setError(null);
      } catch (err) {
        // Si falla con 401, intentamos refresh
        try {
          const refreshRes = await apiPost<{ ok: boolean }>(
            "/auth/refresh",
            {}
          );
          if (refreshRes.ok) {
            const data = await apiGet<User>("/auth/me");
            setUser(data);
            setError(null);
          } else {
            setError("No autorizado");
            setUser(null);
          }
        } catch (refreshErr) {
          setError("No autorizado");
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const isAuthenticated = !!user && !error;
  const isUnauthorized = !!error && !user;

  // Logout: pide al backend que limpie las cookies
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

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isUnauthorized,
    router,
    logout,
  };
}
