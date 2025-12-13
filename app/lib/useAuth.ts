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
  barbershop?: Barbershop; // 👈 ahora el user trae barbería
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
      } catch (err: any) {
        setError(err.message || "No autorizado");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  // Helpers para el estado
  const isAuthenticated = !!user && !error;
  const isUnauthorized = !!error && !user;

  return { user, loading, error, isAuthenticated, isUnauthorized, router };
}