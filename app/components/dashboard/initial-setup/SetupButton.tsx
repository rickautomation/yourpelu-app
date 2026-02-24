"use client";
import { useRouter } from "next/navigation";

export default function SetupButton({ setSidebarOpen }: { setSidebarOpen: (v: boolean) => void }) {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        setSidebarOpen(false);
        router.push("/dashboard/initial-setup?step=2");
      }}
      className="px-4 py-2 bg-pink-600 text-white rounded-md shadow hover:bg-pink-700 transition"
    >
      Configura tu barbería
    </button>
  );
}