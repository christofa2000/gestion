/**
 * Middleware de autenticación y protección de rutas
 * 
 * Este middleware protege las rutas según el rol del usuario:
 * - Rutas superadmin: solo SUPER_ADMIN
 * - Rutas admin: SUPER_ADMIN, CLUB_ADMIN, PROFESSIONAL
 * - Rutas student: STUDENT (SUPER_ADMIN también puede acceder)
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
  // V1: Usar getUser() en lugar de getSession() para evitar warnings y problemas de seguridad
  let isAuthenticated = false
  let user = null
  let role: string | undefined = undefined
  
  try {
    const { data: { user: authUser }, error } = await supabase.auth.getUser()
    if (!error && authUser) {
      isAuthenticated = true
      user = authUser
      role = authUser.user_metadata?.role as string | undefined
    }
  } catch (error) {
    // Si hay error, el usuario no está autenticado
    isAuthenticated = false
  }

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
  // 4. RUTAS DE SUPER_ADMIN (solo SUPER_ADMIN)
  // ========================================
  const isSuperAdminRoute = pathname.startsWith('/superadmin')
  
  if (isSuperAdminRoute) {
    // Solo SUPER_ADMIN puede acceder
    if (role === 'SUPER_ADMIN') {
      return response
    }
    
    // Cualquier otro rol, redirigir según corresponda
    if (role === 'CLUB_ADMIN' || role === 'PROFESSIONAL') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    
    if (role === 'STUDENT') {
      return NextResponse.redirect(new URL('/student', request.url))
    }
    
    // No autenticado o rol inválido
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // ========================================
  // 5. RUTAS DE ADMIN
  // ========================================
  const isAdminRoute = pathname.startsWith('/admin')
  
  if (isAdminRoute) {
    // Verificar que el rol sea admin o professional
    // SUPER_ADMIN también puede acceder a /admin
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
  // 6. RUTAS DE STUDENT
  // ========================================
  const isStudentRoute = pathname.startsWith('/student')
  
  if (isStudentRoute) {
    // Solo students pueden acceder
    // SUPER_ADMIN también puede acceder para ver el portal de alumnos
    if (role === 'STUDENT' || role === 'SUPER_ADMIN') {
      return response
    }
    
    // Si es admin/professional, redirigir a admin
    if (role === 'CLUB_ADMIN' || role === 'PROFESSIONAL') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    
    // Rol no válido, redirigir a login
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // ========================================
  // 7. OTRAS RUTAS - Permitir acceso
  // ========================================
  return response
}

/**
 * Helper para redirigir según el rol del usuario
 * 
 * V1: Reglas de redirección consistentes con redirectByRole en lib/auth.ts:
 * - SUPER_ADMIN → /superadmin
 * - CLUB_ADMIN → /admin
 * - PROFESSIONAL → /admin/turnos
 * - STUDENT → /student
 */
function redirectByRole(request: NextRequest, role: string) {
  switch (role) {
    case 'SUPER_ADMIN':
      return NextResponse.redirect(new URL('/superadmin', request.url))
      
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
