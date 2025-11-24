/**
 * Middleware de autenticación y protección de rutas
 * 
 * Este middleware protege las rutas según el rol del usuario:
 * - Rutas admin: solo SUPER_ADMIN, CLUB_ADMIN, PROFESSIONAL
 * - Rutas student: solo STUDENT
 * - Rutas auth: solo usuarios no autenticados
 * - Rutas públicas: acceso libre
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Rutas públicas (acceso sin autenticación)
const publicRoutes = ['/', '/precios', '/contacto', '/demo']

// Rutas de autenticación (solo para no autenticados)
const authRoutes = ['/auth/login', '/auth/register', '/auth/recover']

// Rutas que requieren ADMIN o PROFESSIONAL
const adminRoutes = ['/admin']

// Rutas que requieren STUDENT
const studentRoutes = ['/student']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // TODO: quitar esta excepción cuando terminemos de debuggear roles
  // Permitir acceso a la página de debug sin verificación de roles
  if (pathname.startsWith('/admin/debug/session')) {
    return NextResponse.next()
  }

  // Crear respuesta que podremos modificar
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Crear cliente de Supabase con cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Obtener sesión del usuario
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isAuthenticated = !!session
  const user = session?.user
  const role = user?.user_metadata?.role as string | undefined

  // ========================================
  // 1. RUTAS PÚBLICAS
  // ========================================
  if (publicRoutes.includes(pathname)) {
    return response
  }

  // ========================================
  // 2. RUTAS DE AUTH (login, register, etc)
  // ========================================
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))
  
  if (isAuthRoute) {
    // Si ya está autenticado, redirigir según rol
    if (isAuthenticated && role) {
      return redirectByRole(request, role)
    }
    // Si no está autenticado, permitir acceso
    return response
  }

  // ========================================
  // 3. RUTAS PROTEGIDAS - Verificar autenticación
  // ========================================
  if (!isAuthenticated) {
    // Guardar la URL a la que intentaba acceder
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ========================================
  // 4. RUTAS DE ADMIN
  // ========================================
  const isAdminRoute = pathname.startsWith('/admin')
  
  if (isAdminRoute) {
    // Verificar que el rol sea admin o professional
    if (role === 'SUPER_ADMIN' || role === 'CLUB_ADMIN' || role === 'PROFESSIONAL') {
      return response
    }
    
    // Si es student, redirigir a su panel
    if (role === 'STUDENT') {
      return NextResponse.redirect(new URL('/student', request.url))
    }
    
    // Rol no válido, redirigir a login
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // ========================================
  // 5. RUTAS DE STUDENT
  // ========================================
  const isStudentRoute = pathname.startsWith('/student')
  
  if (isStudentRoute) {
    // Solo students pueden acceder
    if (role === 'STUDENT') {
      return response
    }
    
    // Si es admin/professional, redirigir a admin
    if (role === 'SUPER_ADMIN' || role === 'CLUB_ADMIN' || role === 'PROFESSIONAL') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    
    // Rol no válido, redirigir a login
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // ========================================
  // 6. OTRAS RUTAS - Permitir acceso
  // ========================================
  return response
}

/**
 * Helper para redirigir según el rol del usuario
 */
function redirectByRole(request: NextRequest, role: string) {
  switch (role) {
    case 'SUPER_ADMIN':
    case 'CLUB_ADMIN':
      return NextResponse.redirect(new URL('/admin', request.url))
      
    case 'PROFESSIONAL':
      return NextResponse.redirect(new URL('/admin/turnos', request.url))
      
    case 'STUDENT':
      return NextResponse.redirect(new URL('/student', request.url))
      
    default:
      return NextResponse.redirect(new URL('/', request.url))
  }
}

// Configuración del matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)',
  ],
}
