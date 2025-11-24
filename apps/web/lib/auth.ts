/**
 * Helpers de autenticación
 * 
 * Funciones auxiliares para trabajar con autenticación y roles.
 */

import { redirect } from 'next/navigation'
import type { UserRole, SupabaseUser } from '@repo/supabase'

/**
 * Obtener el rol del usuario desde el objeto user
 */
export function getUserRole(user: SupabaseUser | null): UserRole | null {
  if (!user) return null
  return user.user_metadata?.role as UserRole || null
}

/**
 * Verificar si el usuario es admin (CLUB_ADMIN o SUPER_ADMIN)
 */
export function isAdmin(user: SupabaseUser | null): boolean {
  const role = getUserRole(user)
  return role === 'CLUB_ADMIN' || role === 'SUPER_ADMIN'
}

/**
 * Verificar si el usuario es super admin
 */
export function isSuperAdmin(user: SupabaseUser | null): boolean {
  const role = getUserRole(user)
  return role === 'SUPER_ADMIN'
}

/**
 * Verificar si el usuario es estudiante
 */
export function isStudent(user: SupabaseUser | null): boolean {
  const role = getUserRole(user)
  return role === 'STUDENT'
}

/**
 * Verificar si el usuario es profesional
 */
export function isProfessional(user: SupabaseUser | null): boolean {
  const role = getUserRole(user)
  return role === 'PROFESSIONAL'
}

/**
 * Obtener el club_id del usuario
 */
export function getClubId(user: SupabaseUser | null): string | null {
  if (!user) return null
  return user.user_metadata?.club_id || null
}

/**
 * Redirigir usuario según su rol
 * 
 * @param user Usuario de Supabase
 * @throws {redirect} Redirecciona según el rol
 * 
 * @example
 * ```tsx
 * // En un Server Component después del login
 * const user = await getUser()
 * redirectByRole(user)
 * ```
 */
export function redirectByRole(user: SupabaseUser | null): never {
  if (!user) {
    redirect('/auth/login')
  }

  const role = getUserRole(user)

  switch (role) {
    case 'SUPER_ADMIN':
    case 'CLUB_ADMIN':
      redirect('/admin')
      
    case 'PROFESSIONAL':
      redirect('/admin/turnos') // Los profesionales ven turnos
      
    case 'STUDENT':
      redirect('/student')
      
    default:
      redirect('/auth/login')
  }
}

/**
 * Verificar si el usuario puede acceder a una ruta admin
 */
export function canAccessAdmin(user: SupabaseUser | null): boolean {
  const role = getUserRole(user)
  return role === 'SUPER_ADMIN' || role === 'CLUB_ADMIN' || role === 'PROFESSIONAL'
}

/**
 * Verificar si el usuario puede acceder a una ruta student
 */
export function canAccessStudent(user: SupabaseUser | null): boolean {
  return isStudent(user)
}

/**
 * Verificar si el usuario puede acceder a configuraciones completas
 * (solo SUPER_ADMIN y CLUB_ADMIN)
 */
export function canAccessConfig(user: SupabaseUser | null): boolean {
  return isAdmin(user)
}

/**
 * Verificar si el usuario puede ver datos financieros
 * (solo SUPER_ADMIN y CLUB_ADMIN)
 */
export function canAccessFinancials(user: SupabaseUser | null): boolean {
  return isAdmin(user)
}




