"use client";

import UnderConstructionPage from "@/app/components/UnderConstructionPage";
import { useParams } from "next/navigation";

export default function ClientInfoPage() {
  const params = useParams<{ id: string }>();
  const clientId = params.id;

  return (
   <UnderConstructionPage/>
  );
}