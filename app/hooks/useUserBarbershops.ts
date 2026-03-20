//
"use client";
import { useEffect, useState } from "react";
import { apiGet } from "../lib/apiGet";

type Barbershop = {
  id: string;
  name: string;
  address?: string;
  phoneNumber?: string;
  profile?: ProfileData;
};

type BarberImage = { id: string; imageUrl: string };

type ProfileData = {
  id: string;
  lema?: string;
  description?: string;
  openingHours?: string;
  adressCoordinates?: string;
  logoUrl?: string;
  websiteUrl?: string | null;
  images?: BarberImage[];
};

interface User {
  id: string;
  rol: string;
}

export function useUserBarbershops(user: User | null) {
  const [activeBarbershop, setActiveBarbershop] = useState<Barbershop | null>(
    null,
  );
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoading(true);
      try {
        if (user.rol === "admin") {
          const current = await apiGet<{ barbershop: Barbershop }>(
            `/current-barbershops/user/${user.id}/last`,
          );
          if (current?.barbershop) setActiveBarbershop(current.barbershop);

          const all = await apiGet<Barbershop[]>(
            `/barbershops/user/${user.id}/all`,
          );
          setBarbershops(all);
        }

        if (user.rol === "barber" || user.rol === "client") {
          const all = await apiGet<Barbershop[]>(
            `/barbershops/user/${user.id}/all`,
          );
          setBarbershops(all);
          setActiveBarbershop(all.length > 0 ? all[0] : null);
        }
      } catch (err) {
        console.error("Error cargando barberías", err);
      } finally {
        setLoading(false);
      }
    };

    load();

    // 👇 escuchar cambios de barbería
    const handler = () => load();
    window.addEventListener("barbershop-changed", handler);

    return () => window.removeEventListener("barbershop-changed", handler);
  }, [user]);

  useEffect(() => {
    if (!activeBarbershop) return;
    const loadSettings = async () => {
      try {
        const s = await apiGet<any>(
          `/barbershops/${activeBarbershop.id}/settings`,
        );
        setSettings(s);
      } catch (err) {
        console.error("Error cargando settings", err);
      }
    };
    loadSettings();
  }, [activeBarbershop]);

  return {
    activeBarbershop,
    barbershops,
    settings,
    setActiveBarbershop,
    loading,
  };
}
