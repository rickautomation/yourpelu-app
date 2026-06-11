import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || ''

  // Extraemos el subdominio limpiando los entornos conocidos
  const currentHost = hostname
    .replace('.yourpelu.com', '')
    .replace('.localhost:8001', '')

  // 1. Si entran a turnos.yourpelu.com o turnos.localhost:8001
  if (currentHost === 'turnos') {
    // Evitamos bucles si la ruta ya contiene de algún modo "/turnos"
    if (pathname.startsWith('/turnos')) {
      return NextResponse.next()
    }

    // Creamos una URL completamente nueva y limpia para el rewrite interno
    // Esto mapeará exactamente a: app/turnos/[slug]/page.tsx
    const rewriteUrl = new URL(`/turnos${pathname}`, request.url)
    return NextResponse.rewrite(rewriteUrl)
  }

  // 2. Si entran a feed.yourpelu.com o feed.localhost:8001
  if (currentHost === 'feed') {
    if (pathname.startsWith('/feed')) {
      return NextResponse.next()
    }

    const rewriteUrl = new URL(`/feed${pathname}`, request.url)
    return NextResponse.rewrite(rewriteUrl)
  }

  return NextResponse.next()
}

// El matcher debe ser lo más permisivo posible con las rutas normales
// pero ignorar por completo recursos estáticos del sistema de Next.js
export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas de solicitud excepto las que empiezan por:
     * - api (rutas de API)
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes en Next.js)
     * - favicon.ico (archivo de icono)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}