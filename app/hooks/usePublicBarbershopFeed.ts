"use client";
import { useEffect, useState } from "react";
import { apiGet } from "../lib/apiGet";

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

type Barbershop = {
  id: string;
  name: string;
  address?: string;
  phoneNumber?: string;
  profile?: ProfileData;
  barbershop: Barbershop;
};

export function usePublicBarbershopFeed(barbershopId: string) {
  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!barbershopId) return;

    const load = async () => {
      setLoading(true);
      try {
        const data = await apiGet<Barbershop>(
          `/current-barbershops/${barbershopId}/feed`
        );
        setBarbershop(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [barbershopId]);

  return { barbershop, loading, error };
}