/**
 * Cliente de Supabase para el servidor (Server Components, Server Actions, Route Handlers)
 * 
 * Este archivo crea el cliente de Supabase que se usa en el servidor
 * con manejo automático de cookies para mantener la sesión del usuario.
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

/**
 * Crear cliente de Supabase para el servidor
 * Usa cookies de Next.js para mantener la sesión
 * 
 * @example
 * ```typescript
 * // En un Server Component
 * import { createClient } from '@repo/supabase/server'
 * 
 * export default async function Page() {
 *   const supabase = await createClient()
 *   const { data } = await supabase.from('users').select()
 *   return data // Renderizar los datos en tu componente
 * }
 * ```
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // El método `set` puede fallar en Server Components
            // Si falla, es porque estamos en un contexto de solo lectura
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // El método `remove` puede fallar en Server Components
          }
        },
      },
    }
  )
}

/**
 * Obtener la sesión del servidor
 * Útil para verificar si el usuario está autenticado
 * 
 * @example
 * ```tsx
 * const session = await getSession()
 * if (!session) {
 *   redirect('/auth/login')
 * }
 * ```
 */
export async function getSession() {
  const supabase = await createClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Error getting session:', error)
    return null
  }
  
  return session
}

/**
 * Obtener el usuario actual del servidor
 * Retorna null si no hay usuario autenticado
 */
export async function getUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Error getting user:', error)
    return null
  }
  
  return user
}

/**
 * Obtener el rol del usuario actual
 * Lee desde user_metadata.role
 */
export async function getUserRole() {
  const user = await getUser()
  if (!user) return null
  
  return user.user_metadata?.role as string | null
}

/**
 * Obtener el club_id del usuario actual
 * Lee desde user_metadata.club_id
 */
export async function getUserClubId() {
  const user = await getUser()
  if (!user) return null
  
  return user.user_metadata?.club_id as string | null
}

