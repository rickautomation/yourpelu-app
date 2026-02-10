"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/useAuth";

console.log("tu hermana")

export default function HomePage() {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    router.refresh(); // fuerza revalidación al montar
  }, [router]);

  useEffect(() => {
    if (!loading) {
      console.log("redirigiendo, isAuth:", isAuthenticated);
      if (isAuthenticated) {
        router.replace("/dashboard");
        router.refresh(); // fuerza revalidación
      } else {
        router.replace("/login");
        router.refresh();
      }
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <p className="text-white">Cargando sesión...</p>;
  }

  return null; // no renderiza nada más, solo redirige
}