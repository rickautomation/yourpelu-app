import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Función auxiliar para manejar la renovación del token
async function handleTokenRefresh(request: NextRequest) {
  const refresh = request.cookies.get("refresh_token")?.value;
  if (!refresh) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        cookie: `refresh_token=${refresh}`,
      },
    });

    if (resp.ok) {
      // Redirigimos a la misma URL para que la request se vuelva a ejecutar
      // con las nuevas cookies ya establecidas en el cliente.
      const response = NextResponse.redirect(request.url);
      const setCookieHeader = resp.headers.get("set-cookie");
      if (setCookieHeader) {
        response.headers.set("set-cookie", setCookieHeader);
      }
      return response;
    }
  } catch {
    // Si falla el fetch de refresh
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  let token = request.cookies.get("auth_token")?.value;

  if (pathname.startsWith("/workspace")) {
    if (!token) {
      return await handleTokenRefresh(request);
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload?.rol;

      switch (role) {
        case "user": {
          if (!pathname.startsWith("/initial-setup")) {
            return NextResponse.redirect(new URL("/initial-setup", request.url));
          }
          break;
        }

        case "admin": {
          if (pathname.startsWith("/workspace/initial-setup")) {
            return NextResponse.redirect(new URL("/workspace", request.url));
          }
          break;
        }

        case "manager": {
          if (pathname.startsWith("/workspace/admin-only") || pathname.startsWith("/workspace/initial-setup")) {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
          }
          break;
        }

        case "staff": {
          if (pathname === "/workspace" || pathname === "/workspace/") {
            return NextResponse.redirect(new URL("/workspace/user-staff", request.url));
          }

          const allowedPaths = [
            "/workspace/user-staff",
            "/workspace/profile",
            "/workspace/commercial/offerings/add",
            "/workspace/commercial/offerings/history",
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
      // Si el token está mal formado (falla el atob o JSON.parse)
      return await handleTokenRefresh(request);
    }
  }

  // Lógica de subdominios
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
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.css$\vert{}.*\\.js$|.*\\.png$\vert{}.*\\.jpg$).*)",
  ],
};