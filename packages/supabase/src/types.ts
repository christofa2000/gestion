/**
 * Tipos TypeScript generados de Supabase
 * 
 * Para regenerar estos tipos:
 * ```bash
 * npx supabase gen types typescript --project-id "tu-project-id" > packages/supabase/src/types.ts
 * ```
 */

// Placeholder para Database type
// En producción, esto se generará automáticamente desde Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clubs: {
        Row: {
          id: string
          nombre: string
          logo_url: string | null
          theme: string
          direccion: string | null
          telefono: string | null
          email: string | null
          activa: boolean
          configuracion: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          logo_url?: string | null
          theme?: string
          direccion?: string | null
          telefono?: string | null
          email?: string | null
          activa?: boolean
          configuracion?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          logo_url?: string | null
          theme?: string
          direccion?: string | null
          telefono?: string | null
          email?: string | null
          activa?: boolean
          configuracion?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          auth_user_id: string
          club_id: string
          role: string
          nombre: string
          apellido: string
          telefono: string | null
          email: string
          avatar_url: string | null
          activo: boolean
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_user_id: string
          club_id: string
          role: string
          nombre: string
          apellido: string
          telefono?: string | null
          email: string
          avatar_url?: string | null
          activo?: boolean
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_user_id?: string
          club_id?: string
          role?: string
          nombre?: string
          apellido?: string
          telefono?: string | null
          email?: string
          avatar_url?: string | null
          activo?: boolean
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          club_id: string
          nombre: string
          apellido: string
          apodo: string | null
          telefono: string | null
          email: string | null
          estado: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          club_id: string
          nombre: string
          apellido: string
          apodo?: string | null
          telefono?: string | null
          email?: string | null
          estado?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          club_id?: string
          nombre?: string
          apellido?: string
          apodo?: string | null
          telefono?: string | null
          email?: string | null
          estado?: string
          created_at?: string
          updated_at?: string
        }
      }
      branches: {
        Row: {
          id: string
          club_id: string
          nombre: string
          direccion: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          club_id: string
          nombre: string
          direccion?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          club_id?: string
          nombre?: string
          direccion?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          club_id: string
          nombre: string
          descripcion: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          club_id: string
          nombre: string
          descripcion?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          club_id?: string
          nombre?: string
          descripcion?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      professionals: {
        Row: {
          id: string
          club_id: string
          nombre: string
          apellido: string
          email: string | null
          telefono: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          club_id: string
          nombre: string
          apellido: string
          email?: string | null
          telefono?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          club_id?: string
          nombre?: string
          apellido?: string
          email?: string | null
          telefono?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      time_slots: {
        Row: {
          id: string
          club_id: string
          branch_id: string
          actividad_id: string
          professional_id: string
          fecha: string
          hora_inicio: string
          hora_fin: string
          cupo_maximo: number
          estado: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          club_id: string
          branch_id: string
          actividad_id: string
          professional_id: string
          fecha: string
          hora_inicio: string
          hora_fin: string
          cupo_maximo: number
          estado?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          club_id?: string
          branch_id?: string
          actividad_id?: string
          professional_id?: string
          fecha?: string
          hora_inicio?: string
          hora_fin?: string
          cupo_maximo?: number
          estado?: string
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          slot_id: string
          student_id: string
          estado: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slot_id: string
          student_id: string
          estado?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slot_id?: string
          student_id?: string
          estado?: string
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          club_id: string
          student_id: string
          monto: number
          fecha: string
          metodo_pago: string
          estado: string
          observaciones: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          club_id: string
          student_id: string
          monto: number
          fecha: string
          metodo_pago: string
          estado?: string
          observaciones?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          club_id?: string
          student_id?: string
          monto?: number
          fecha?: string
          metodo_pago?: string
          estado?: string
          observaciones?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          club_id: string
          monto: number
          fecha: string
          categoria: string
          descripcion: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          club_id: string
          monto: number
          fecha: string
          categoria: string
          descripcion?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          club_id?: string
          monto?: number
          fecha?: string
          categoria?: string
          descripcion?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// ============================================================================
// TIPOS DE AUTENTICACIÓN
// ============================================================================

/**
 * Roles de usuario del sistema
 */
export type UserRole = 'SUPER_ADMIN' | 'CLUB_ADMIN' | 'PROFESSIONAL' | 'STUDENT'

/**
 * Metadata del usuario almacenada en auth.users
 */
export interface UserMetadata {
  role: UserRole
  club_id: string
  nombre?: string
  apellido?: string
  avatar_url?: string
}

/**
 * Usuario extendido con metadata
 */
export interface SupabaseUser {
  id: string
  email?: string
  user_metadata: UserMetadata
  app_metadata: {
    provider?: string
    providers?: string[]
  }
  aud: string
  created_at?: string
}

/**
 * Sesión de Supabase con usuario
 */
export interface SupabaseSession {
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at?: number
  token_type: string
  user: SupabaseUser
}

// ============================================================================
// TIPOS HELPER
// ============================================================================

/**
 * Tipo helper para obtener el Row type de una tabla
 */
export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row']

/**
 * Tipo helper para obtener el Insert type de una tabla
 */
export type TablesInsert<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert']

/**
 * Tipo helper para obtener el Update type de una tabla
 */
export type TablesUpdate<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update']
