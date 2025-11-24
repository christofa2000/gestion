/**
 * Cliente de Supabase para el navegador (Client Components)
 * 
 * Este archivo crea el cliente de Supabase que se usa en componentes del cliente
 * con manejo automático de cookies para auth.
 */

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

/**
 * Crear cliente de Supabase para el navegador
 * Maneja automáticamente las cookies de autenticación
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Cliente singleton para usar en el navegador
 * Úsalo en Client Components
 * 
 * @example
 * ```tsx
 * 'use client'
 * import { supabase } from '@repo/supabase/client'
 * 
 * const { data } = await supabase.from('users').select()
 * ```
 */
export const supabase = createClient()

/**
 * Alias de createClient para compatibilidad
 * @deprecated Use createClient instead
 */
export const createSupabaseBrowserClient = createClient
