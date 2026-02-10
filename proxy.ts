// proxy.ts en la raíz
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  console.log("Proxy ejecutado:", req.nextUrl.pathname);

  if (req.nextUrl.pathname === "/") {
    const token = req.cookies.get("auth_token");
    console.log("Token:", token);

    if (token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"], // asegura que se aplique en la raíz
};