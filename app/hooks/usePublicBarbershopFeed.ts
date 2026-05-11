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
  schedules?: Schedule[];
};

export type TimeRange = {
  id: string;
  start: string; // formato "HH:mm"
  end: string;   // formato "HH:mm"
};

export type Schedule = {
  id: string;
  dayOfWeek: number; // 1 = lunes, 2 = martes, etc.
  timeRanges: TimeRange[];
};


type UserProfile = {
  id: string;
  avatarUrl?: string;
};

type Staff = {
  id: string;
  name: string;
  lastname: string; // 👈 coincide con la respuesta del backend
  phoneNumber?: string;
  email?: string;
  activationLink?: string | null;
  userProfile?: UserProfile; // 👈 agregado para el avatar
};

type Establishment = {
  id: string;
  name: string;
  address?: string;
  phoneNumber?: string;
  profile?: ProfileData;
  staff?: Staff[];
};
export function usePublicBarbershopFeed(slug: string) {
  const [establishment, setEstablishment] = useState<Establishment | null>(null);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      setLoading(true);
      try {
        const data = await apiGet<{ establishment: Establishment }>(
          `/public-data/establishment/${slug}/feed`,
        );
        setEstablishment(data.establishment);

        const staffData = await apiGet<Staff[]>(
          `/public-data/establishment/${slug}/staff`,
        );
        setStaff(staffData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  return { establishment, staff, loading, error };
}