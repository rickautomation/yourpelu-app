"use client";
import React from "react";
import { usePublicBarbershopFeed } from "../../../../hooks/usePublicBarbershopFeed";
import BarbershopFeed from "@/app/components/public-feed/BarbershopFeed";

export default function PublicFeedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params); // 👈 unwrap del Promise
  const { establishment, loading, error } = usePublicBarbershopFeed(slug);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!establishment) return <p>No se encontró la barbería</p>;

  return <BarbershopFeed barbershop={establishment} />;
}