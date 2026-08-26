"use client";

import Link from "next/link";

interface NewsItem {
  title: string;
  description: string;
  route: string; // ruta a la que va el botón
}

const news: NewsItem[] = [
  {
    title: "Venta de productos",
    description:
      "Gestioná la venta de artículos afines al salón como pomadas, shampoos y ceras. Llevá control de stock y precios fácilmente.",
    route: "/workspace/app-news/products-sale",
  },
  {
    title: "Manejo de turnos",
    description:
      "Organizá tu agenda de clientes, confirmá citas y optimizá la atención con recordatorios automáticos.",
    route: "/workspace/app-news/appointments",
  },
  {
    title: "Equipo",
    description:
      "Agrega miembros a tu equipo de trabajo y establece el tipo de relcion con el establecimiento.",
    route: "/workspace/app-news/staff",
  },
];

export function AppNews() {
  return (
    <div className="w-full max-w-lg">
      <h2 className="text-xl text-center font-bold mb-4 text-white">
        Novedades en YourPelu
      </h2>
      <ul className="space-y-3">
        {news.map((item, i) => (
          <li key={i} className="bg-luminiBrandBlue p-4 rounded-md">
            <h3 className="text-lg font-semibold text-pink-400 mb-1">
              {item.title}
            </h3>
            <p className="text-gray-200 text-sm">{item.description}</p>
            <div className="flex justify-end mt-2">
              <Link
                href={item.route}
                className="px-3 py-2 text-sm rounded font-bold bg-pink-600 hover:bg-pink-700 text-white transition-colors"
              >
                Saber más
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
