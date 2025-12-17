"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet } from "./apiGet";

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
        // Primer intento: con cookie
        const data = await apiGet<User>("/auth/me");
        setUser(data);
        setError(null);
      } catch (err) {
        const token = localStorage.getItem("auth_token");
        if (token) {
          try {
            const res = await fetch(
              process.env.NEXT_PUBLIC_API_URL + "/auth/me",
              {
                headers: { Authorization: `Bearer ${token}` },
                credentials: "include",
              }
            );
            if (res.ok) {
              const data = await res.json();
              setUser(data);
              setError(null);
              return;
            }
          } catch (e) {
            console.error("Fallback también falló", e);
          }
        }
        const errorMsg =
          err instanceof Error ? err.message : "No autorizado";
        setError(errorMsg);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const isAuthenticated = !!user && !error;
  const isUnauthorized = !!error && !user;

  // Helper opcional
  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    router.push("/login");
  };

  return { user, loading, error, isAuthenticated, isUnauthorized, router, logout };
}