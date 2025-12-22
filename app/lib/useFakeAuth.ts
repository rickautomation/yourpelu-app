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
  barbershopId?: string;
}

export function useFakeAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        // Primer intento: con cookie
        const data = await apiGet<User>("/user/userId");
        setUser(data);
        setLoading(false);
        setError(null);
      } catch (err) {}
    }
    fetchUser();
  }, []);

  const isAuthenticated = !!user && !error;
  const isUnauthorized = !!error && !user;

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isUnauthorized,
    router,
  };
}
