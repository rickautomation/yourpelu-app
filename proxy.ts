import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // --- Lógica de auth ---
  let token = request.cookies.get("auth_token")?.value;

  if (pathname.startsWith("/workspace")) {
    if (!token) {
      // Intentar refrescar con refresh_token
      const refresh = request.cookies.get("refresh_token")?.value;
      if (refresh) {
        try {
          const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
            method: "POST",
            headers: {
              cookie: `refresh_token=${refresh}`,
            },
          });

          if (resp.ok) {
            // si refrescó bien, dejar pasar
            return NextResponse.next();
          }
        } catch {
          // si falla, redirigir
          return NextResponse.redirect(new URL("/login", request.url));
        }
      }

      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload?.rol;

      switch (role) {
        case "admin":
          break; // acceso completo

        case "manager":
          if (pathname.startsWith("/workspace/admin-only")) {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
          }
          break;

        case "staff": {
          // 1. Redirección automática si intenta acceder directamente a /workspace o /workspace/
          if (pathname === "/workspace" || pathname === "/workspace/") {
            return NextResponse.redirect(new URL("/workspace/user-staff", request.url));
          }

          // 2. Rutas permitidas para Staff (incluyendo /workspace/profile)
          const allowedPaths = [
            "/workspace/user-staff",
            "/workspace/profile",
            "/workspace/commercial/offerings/add",
            "/workspace/commercial/clients",
            "/workspace/commercial/appointments",
          ];

          const isAllowed = allowedPaths.some((path) => pathname.startsWith(path));

          if (!isAllowed) {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
          }
          break;
        }

        default:
          return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    } catch {
      // si el token está corrupto, intentar refrescar
      const refresh = request.cookies.get("refresh_token")?.value;
      if (refresh) {
        try {
          const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
            method: "POST",
            headers: {
              cookie: `refresh_token=${refresh}`,
            },
          });

          if (resp.ok) {
            return NextResponse.next();
          }
        } catch {
          return NextResponse.redirect(new URL("/login", request.url));
        }
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // --- Lógica de subdominios ---
  const currentHost = hostname
    .replace(".yourpelu.com", "")
    .replace(".localhost:8001", "");

  if (currentHost === "turnos") {
    if (!pathname.startsWith("/turnos")) {
      const requestUrl = new URL(request.url);
      requestUrl.pathname = `/turnos${pathname}`;
      return NextResponse.rewrite(requestUrl);
    }
  }

  if (currentHost === "feed") {
    if (!pathname.startsWith("/feed")) {
      const requestUrl = new URL(request.url);
      requestUrl.pathname = `/feed${pathname}`;
      return NextResponse.rewrite(requestUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.css$|.*\\.js$|.*\\.png$|.*\\.jpg$).*)",
  ],
};