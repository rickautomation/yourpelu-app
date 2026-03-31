"use client";
import { useEffect, useState } from "react";
import { apiGet } from "../lib/apiGet";

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
  images?: BarberImage[];
};

type UserProfile = {
  id: string;
  avatarUrl?: string;
};

type Barber = {
  id: string;
  name: string;
  lastname: string;        // 👈 coincide con la respuesta del backend
  phoneNumber?: string;
  email?: string;
  activationLink?: string | null;
  userProfile?: UserProfile; // 👈 agregado para el avatar
};

type Barbershop = {
  id: string;
  name: string;
  address?: string;
  phoneNumber?: string;
  profile?: ProfileData;
  barbers?: Barber[];
};

export function usePublicBarbershopFeed(barbershopId: string) {
  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!barbershopId) return;

    const load = async () => {
      setLoading(true);
      try {
        // 👇 desempaquetamos la respuesta para quedarnos solo con la barbería
        const data = await apiGet<{ barbershop: Barbershop }>(
          `/public-data/barbershop/${barbershopId}/feed`,
        );
        setBarbershop(data.barbershop);

        const barbersData = await apiGet<Barber[]>(
          `/public-data/barbershop/${barbershopId}/barbers`,
        );

        setBarbers(barbersData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [barbershopId]);

  return { barbershop, barbers, loading, error };
}
