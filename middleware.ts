// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const domain = "yourpelu.com";

  // En local no hacemos nada
  if (host.includes("localhost")) {
    return NextResponse.next();
  }

  // Ignorar dominio raíz y vercel preview
  if (host === domain || host.endsWith(".vercel.app")) {
    return NextResponse.next();
  }

  // Extraer subdominio
  const subdomain = host.replace(`.${domain}`, "");

  // Solo reescribir si la ruta es appointments o feed
  const url = req.nextUrl.clone();
  if (url.pathname.startsWith("/appointments") || url.pathname.startsWith("/feed")) {
    url.pathname = `/establishment/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Para cualquier otra ruta, no tocar nada
  return NextResponse.next();
}
