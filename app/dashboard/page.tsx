"use client";
import { useAuth } from "../lib/useAuth";

export default function DashboardPage() {
  const { user, loading, isUnauthorized, router } = useAuth();

  if (loading) return <p className="text-white">Cargando...</p>;
  if (isUnauthorized) {
    router.push("/login");
    return null;
  }

  console.log("user", user)

  return (
    <div className="flex flex-col space-y-4 p-4">
      <h3 className="text-white text-2xl font-semibold mb-4">
        ¡Bienvenido, {user?.name}!
      </h3>
      <h4 className="text-white text-lg mb-4">
        1. Desde el menu lateral, accede a "Barbería" para gestionar los detalles de tu negocio.
      </h4>
      <h4 className="text-white text-lg mb-4">
        2. Luego, dirígete a "Servicios" para añadir y personalizar los servicios que ofreces.
      </h4>
      <h4 className="text-white text-lg mb-4">
        3. Agrega tus estilos de corte propios en la sección "Estilos".
      </h4>
      <h4 className="text-white text-lg mb-4">
        4. Ya estás listo para empezar a gestionar tu barbería de manera eficiente. ¡Vamos allá!
      </h4>
    </div>
  );
}