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
    fetchUser,
    logout,
    router,
  };
}
