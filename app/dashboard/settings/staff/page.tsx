"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/app/lib/apiGet";
import { apiPost } from "@/app/lib/apiPost";
import { useEstablishment } from "@/app/context/EstablishmentContext";

type WorkRelationType = {
  id: string;
  name: string;
  description?: string;
};

function formatName(name: string): string {
  const formatted = name.replace(/_/g, " ");
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export default function StaffSettingsPage() {
  const { activeEstablishment, fetchEstablishmentById } = useEstablishment();

  const [types, setTypes] = useState<WorkRelationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const resTypes = await apiGet<WorkRelationType[]>("/work-relation-types");
        setTypes(resTypes);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTypes();
  }, []);

  console.log("work relations: ", types)

  if (loading) return <p>Cargando modelos de trabajo...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
  
    </div>
  );
}
