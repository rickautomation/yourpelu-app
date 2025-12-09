"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet } from "../lib/apiGet";

export default function UserPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await apiGet("/auth/me");
        setUser(data);
      } catch {
        router.push("/login");
      }
    }
    fetchUser();
  }, [router]);

  if (!user) return <p className="text-white">Cargando perfil...</p>;

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white px-6">
      <h1 className="text-2xl font-bold mb-6">Hola {user.name} 👋</h1>
      <p>Teléfono: {user.phoneNumber}</p>
    </section>
  );
}