import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''

  // Limpiamos el host para aislar el subdominio
  const currentHost = hostname
    .replace('.yourpelu.com', '')
    .replace('.localhost:8001', '')

  // 1. Si entran a turnos.yourpelu.com o turnos.localhost:8001
  if (currentHost === 'turnos') {
    // Nos aseguramos de que si entran a la raíz, no se rompa la concatenación
    const path = url.pathname === '/' ? '' : url.pathname
    
    // Forzamos la reescritura interna exacta a la carpeta /turnos
    url.pathname = `/turnos${path}`
    return NextResponse.rewrite(url)
  }

  // 2. Si entran a feed.yourpelu.com o feed.localhost:8001
  if (currentHost === 'feed') {
    const path = url.pathname === '/' ? '' : url.pathname
    url.pathname = `/feed${path}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  // Asegúrate de que el matcher no interfiera con archivos del sistema
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.css$).*)',
  ],
}