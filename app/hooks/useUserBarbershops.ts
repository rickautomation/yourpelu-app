"use client";
import { useEffect, useState } from "react";
import { apiGet } from "../lib/apiGet";

type Barbershop = {
  id: string;
  name: string;
  address?: string;
  phoneNumber?: string;
  profile?: ProfileData
};

type BarberImage = {
  id: string;
  imageUrl: string;
};

type ProfileData = {
  id: string;
  lema?: string;
  description?: string;
  openingHours?: string;
  adressCoordinates?: string;
  logoUrl?: string;
  websiteUrl?: string | null;
  images?: BarberImage[]; // 👈 incluir imágenes
};

interface User {
  id: string;
  rol: string;
}

export function useUserBarbershops(user: User | null) {
  const [activeBarbershop, setActiveBarbershop] = useState<Barbershop | null>(null);
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoading(true);
      try {
        if (user.rol === "admin") {
          const current = await apiGet<{ barbershop: Barbershop }>(
            `/current-barbershops/user/${user.id}/last`
          );
          console.log("current barbershop in useUserBarbershop", current)
          if (current?.barbershop) setActiveBarbershop(current.barbershop);

          const all = await apiGet<Barbershop[]>(`/barbershops/user/${user.id}/all`);
          setBarbershops(all);
        }

        if (user.rol === "barber") {
          const all = await apiGet<Barbershop[]>(`/barbershops/user/${user.id}/all`);
          setBarbershops(all);
          setActiveBarbershop(all.length > 0 ? all[0] : null);
        }

        if (user.rol === "client") {
          const all = await apiGet<Barbershop[]>(`/barbershops/user/${user.id}/all`);
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
  }, [user]);

  return { activeBarbershop, barbershops, setActiveBarbershop, loading };
}