import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas públicas que no requieren autenticación
const publicRoutes = ["/", "/precios", "/contacto", "/demo"];
const authRoutes = ["/auth/login", "/auth/register", "/auth/recover"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir rutas públicas y de auth
  if (publicRoutes.includes(pathname) || authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // TODO: Integrar con Supabase Auth en el próximo paso
  // Por ahora, usamos mock de autenticación
  const isAuthenticated = request.cookies.get("mock_authenticated")?.value === "true";
  const userRole = request.cookies.get("mock_user_role")?.value;

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Proteger rutas de admin
  if (pathname.startsWith("/admin")) {
    if (userRole !== "super_admin" && userRole !== "club_admin" && userRole !== "professional") {
      return NextResponse.redirect(new URL("/student", request.url));
    }
  }

  // Proteger rutas de student
  if (pathname.startsWith("/student")) {
    if (userRole !== "student") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
};

