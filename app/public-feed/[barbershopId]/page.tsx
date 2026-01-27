"use client";
import React from "react";
import { usePublicBarbershopFeed } from "../../hooks/usePublicBarbershopFeed";
import BarbershopFeed from "@/app/components/public-feed/BarbershopFeed";

export default function PublicFeedPage({ params }: { params: Promise<{ barbershopId: string }> }) {
  const { barbershopId } = React.use(params); // 👈 unwrap del Promise
  const { barbershop, loading, error } = usePublicBarbershopFeed(barbershopId);

  console.log("barbershop: ", barbershop)

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!barbershop) return <p>No se encontró la barbería</p>;

  return <BarbershopFeed barbershop={barbershop.barbershop} />;
}