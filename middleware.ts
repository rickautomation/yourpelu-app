import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const domain = "yourpelu.com";

  // 1. En entornos locales o desarrollo no aplicamos reescrituras
  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    return NextResponse.next();
  }

  // 2. Ignorar el dominio raíz, subdominio www y previsualizaciones de Vercel
  if (host === domain || host === `www.${domain}` || host.endsWith(".vercel.app")) {
    return NextResponse.next();
  }

  // 3. ¡CRÍTICO! Ignorar por completo las peticiones dirigidas a tu API en Render
  if (host === `api.${domain}`) {
    return NextResponse.next();
  }

  // 4. Extraer el subdominio del cliente (ej: 'barberia-paco' de 'barberia-paco.yourpelu.com')
  const subdomain = host.replace(`.${domain}`, "");

  const url = req.nextUrl.clone();

  // 5. Interceptar y reescribir las rutas asignadas a los establecimientos
  // Esto cubrirá tanto '/appointments' como '/feed' y cualquier subruta interna como '/feed/[slug]'
  if (url.pathname.startsWith("/appointments") || url.pathname.startsWith("/feed")) {
    
    // Reescribe internamente a la estructura de carpetas que corregimos:
    // /establishment/[subdomain]/appointments... o /establishment/[subdomain]/feed/[slug]...
    url.pathname = `/establishment/${subdomain}${url.pathname}`;
    
    return NextResponse.rewrite(url);
  }

  // Para cualquier otro subdominio o ruta no especificada, continuar normalmente
  return NextResponse.next();
}

// 6. El Matcher filtra las peticiones para evitar procesar archivos estáticos o multimedia
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)',
  ],
};