/**
 * Hooks personalizados de Supabase
 * 
 * Estos hooks facilitan el trabajo con autenticación en Client Components.
 */

'use client'

import { useEffect, useState } from 'react'
import { createClient } from './client'
import type { SupabaseUser, SupabaseSession, UserRole } from './types'

/**
 * Hook para obtener la sesión actual del usuario
 * 
 * @example
 * ```typescript
 * 'use client'
 * function MyComponent() {
 *   const { session, loading } = useSession()
 *   
 *   if (loading) return 'Loading...'
 *   if (!session) return 'Not logged in'
 *   
 *   return `Welcome ${session.user.email}`
 * }
 * ```
 */
export function useSession() {
  const [session, setSession] = useState<SupabaseSession | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session as SupabaseSession | null)
      setLoading(false)
    })

    // Escuchar cambios en la sesión
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session as SupabaseSession | null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return { session, loading }
}

/**
 * Hook para obtener el usuario actual
 * 
 * @example
 * ```typescript
 * 'use client'
 * function MyComponent() {
 *   const { user, loading } = useUser()
 *   
 *   if (loading) return 'Loading...'
 *   if (!user) return 'Not logged in'
 *   
 *   return `Hello ${user.email}`
 * }
 * ```
 */
export function useUser() {
  const { session, loading } = useSession()
  const user = session?.user as SupabaseUser | null

  return { user, loading }
}

/**
 * Hook completo de autenticación con helpers útiles
 * 
 * @example
 * ```typescript
 * 'use client'
 * function MyComponent() {
 *   const { user, session, loading, isAdmin, isStudent, role } = useAuth()
 *   
 *   if (loading) return 'Loading...'
 *   if (!user) return 'Please login'
 *   
 *   // Renderizar según rol
 *   // if (isAdmin) mostrar AdminPanel
 *   // if (isStudent) mostrar StudentPanel
 *   return `Role: ${role}`
 * }
 * ```
 */
export function useAuth() {
  const { session, loading } = useSession()
  const user = session?.user as SupabaseUser | null
  
  // Extraer role y club_id de user_metadata
  const role = (user?.user_metadata?.role as UserRole) || null
  const clubId = user?.user_metadata?.club_id || null

  // Helpers de rol
  const isAdmin = role === 'CLUB_ADMIN' || role === 'SUPER_ADMIN'
  const isSuperAdmin = role === 'SUPER_ADMIN'
  const isStudent = role === 'STUDENT'
  const isProfessional = role === 'PROFESSIONAL'

  return {
    user,
    session,
    loading,
    role,
    clubId,
    isAdmin,
    isSuperAdmin,
    isStudent,
    isProfessional,
  }
}
