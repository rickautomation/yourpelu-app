import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || ''

  // 1. Detectamos el subdominio limpiando tanto el entorno local como el de producción
  const currentHost = hostname
    .replace('.yourpelu.com', '')      // Para producción
    .replace('.localhost:8001', '')    // Para tu entorno local

  // 2. Si el subdominio detectado es 'turnos'
  if (currentHost === 'turnos') {
    
    // Evitamos bucles si la ruta ya contiene por alguna razón '/turnos'
    if (pathname.startsWith('/turnos')) {
      return NextResponse.next()
    }

    // Clonamos la URL de la petición y le inyectamos el prefijo interno /turnos
    // Si entran a turnos.yourpelu.com/barberia, por dentro busca app/turnos/barberia
    const requestUrl = new URL(request.url)
    requestUrl.pathname = `/turnos${pathname}`

    return NextResponse.rewrite(requestUrl)
  }

  // 3. Si en el futuro activas el subdominio 'feed'
  if (currentHost === 'feed') {
    if (pathname.startsWith('/feed')) {
      return NextResponse.next()
    }
    const requestUrl = new URL(request.url)
    requestUrl.pathname = `/feed${pathname}`
    return NextResponse.rewrite(requestUrl)
  }

  return NextResponse.next()
}

// El matcher clave que armamos para que NO te rompa los estilos (Tailwind, CSS, JS) ni imágenes
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.css$|.*\\.js$|.*\\.png$|.*\\.jpg$).*)',
  ],
}