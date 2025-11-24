/**
 * Package Supabase
 * 
 * Este package exporta los clientes de Supabase (browser y server),
 * tipos y utilidades para autenticación.
 */

// Cliente para navegador (Client Components)
export { createClient, supabase, createSupabaseBrowserClient } from './client'

// Cliente para servidor (Server Components, API Routes)
export {
  createClient as createServerClient,
  getSession,
  getUser,
  getUserRole,
  getUserClubId
} from './server'

// Tipos
export type {
  Database,
  Json,
  UserRole,
  UserMetadata,
  SupabaseUser,
  SupabaseSession,
  Tables,
  TablesInsert,
  TablesUpdate
} from './types'

// Hooks
export { useAuth, useUser, useSession } from './hooks'
