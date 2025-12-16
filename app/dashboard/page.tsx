// app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../lib/useAuth";

export default function DashboardPage() {
  const { user, loading, isUnauthorized, router, isAuthenticated } = useAuth();

  if (loading) return <p>Cargando...</p>;
  if (isUnauthorized) {
    router.push("/login");
    return null;
  }

  console.log("user", 10, user)
  console.log("isUnauthorized", isUnauthorized)
  console.log("isAuthenticated", isAuthenticated)

  return (
    <div className="flex flex-col space-y-2">
     <div className="flex text-center items-center p-6 bg-gray-800 rounded-lg shadow-md">
        <p className="text-2xl">Agregar corte</p>
        <button className="ml-auto bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors">
          +
        </button>
      </div>
      <div className="flex text-center items-center p-6 bg-gray-800 rounded-lg shadow-md">
        <p className="text-2xl">Agregar coloracion</p>
        <button className="ml-auto bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors">
          +
        </button>
      </div>
    </div>
  );
}