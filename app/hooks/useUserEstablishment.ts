"use client";
import { useEffect, useState } from "react";
import { apiGet } from "../lib/apiGet";

type Establishment = {
  id: string;
  name: string;
  address?: string;
  phoneNumber?: string;
  profile?: ProfileData;
  type?: EstablishmentType 
};

type EstablishmentImage = { id: string; imageUrl: string };

type ProfileData = {
  id: string;
  lema?: string;
  description?: string;
  openingHours?: string;
  adressCoordinates?: string;
  logoUrl?: string;
  websiteUrl?: string | null;
  images?: EstablishmentImage[];
};

type EstablishmentType = {
  id: string;
  name: string;
  description: string;
};

interface User {
  id: string;
  rol: string;
}

export function useUserEstablishment(user: User | null) {
  const [activeEstablishment, setActiveEstablishment] =
    useState<Establishment | null>(null);
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [types, setTypes] = useState<EstablishmentType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoading(true);
      try {
        if (user.rol === "admin") {
          const current = await apiGet<{ establishment: Establishment }>(
            `/current-establishments/user/${user.id}/last`,
          );
          if (current?.establishment) setActiveEstablishment(current.establishment);

          const all = await apiGet<Establishment[]>(
            `/establishment/user/${user.id}/all`,
          );
          setEstablishments(all);
        }

        if (user.rol === "staff" || user.rol === "client") {
          const all = await apiGet<Establishment[]>(
            `/establishment/user/${user.id}/all`,
          );
          setEstablishments(all);
          setActiveEstablishment(all.length > 0 ? all[0] : null);
        }

        const fetchedTypes =
          await apiGet<EstablishmentType[]>(`/establishment-types`);
        setTypes(fetchedTypes);
      } catch (err) {
        console.error("Error cargando barberías", err);
      } finally {
        setLoading(false);
      }
    };

    load();

    // 👇 escuchar cambios de barbería
    const handler = () => load();
    window.addEventListener("establishment-changed", handler);

    return () => window.removeEventListener("establishment-changed", handler);
  }, [user]);

  useEffect(() => {
    if (!activeEstablishment) return;
    const loadSettings = async () => {
      try {
        const s = await apiGet<any>(
          `/establishments/${activeEstablishment.id}/settings`,
        );
        setSettings(s);
      } catch (err) {
        console.error("Error cargando settings", err);
      }
    };
    loadSettings();
  }, [activeEstablishment]);

  return {
    activeEstablishment,
    establishments,
    settings,
    types,
    setActiveEstablishment,
    loading,
  };
}
