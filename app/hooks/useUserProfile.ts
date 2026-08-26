"use client";
import { useState, useEffect, useCallback } from "react";
import { apiGet } from "../lib/apiGet";
import { apiPost } from "../lib/apiPost";

interface UserProfile {
  id: string;
  avatarUrl?: string;
  bio?: string;
  birthDate?: string;
  address?: string;
}

export function useUserProfile(userId?: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      // 👇 usar /user/:id en lugar de /user-profiles/:id
      const data = await apiGet<{ userProfile: UserProfile }>(`/user/${userId}`);
      setProfile(data.userProfile || null);
      setError(null);
    } catch (err) {
      console.error("Error cargando perfil", err);
      setError("No se pudo cargar el perfil");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userId) return;
    try {
      // 👇 endpoint para actualizar perfil
      const updated = await apiPost<UserProfile>(`/user/${userId}/profile`, updates);
      setProfile(updated);
      return updated;
    } catch (err) {
      console.error("Error actualizando perfil", err);
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
  };
}
