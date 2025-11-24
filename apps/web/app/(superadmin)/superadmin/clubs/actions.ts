'use server'

/**
 * Server Actions para crear clubs con usuarios ADMIN
 * 
 * Solo SUPER_ADMIN puede ejecutar estas acciones.
 */

import { createClient } from '@repo/supabase/server'
import { getUser } from '@repo/supabase/server'
import { isSuperAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export interface CreateClubWithAdminData {
  // Datos del Club
  clubNombre: string
  clubEmail?: string
  clubTelefono?: string
  clubDireccion?: string
  clubTheme?: 'theme-sky' | 'theme-sport' | 'theme-neutral'
  
  // Datos del Usuario Admin
  adminNombre: string
  adminApellido: string
  adminEmail: string
  adminPassword: string
  adminTelefono?: string
}

/**
 * Crear un nuevo club con su usuario ADMIN asociado
 * 
 * Este proceso crea:
 * 1. El club en la tabla clubs
 * 2. El usuario en Supabase Auth (usando admin client)
 * 3. El registro en la tabla users vinculado al club
 */
export async function createClubWithAdmin(data: CreateClubWithAdminData) {
  try {
    // Verificar que el usuario es SUPER_ADMIN
    const user = await getUser()
    if (!user || !isSuperAdmin(user)) {
      return { 
        error: 'No autorizado. Solo SUPER_ADMIN puede crear clubs.',
        details: null 
      }
    }

    // Crear cliente normal para operaciones de base de datos
    const supabase = await createClient()

    // Crear cliente admin para operaciones de auth (requiere SERVICE_ROLE_KEY)
    const supabaseAdminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseServiceRoleKey) {
      return {
        error: 'SUPABASE_SERVICE_ROLE_KEY no está configurada. Necesitas agregarla en .env.local',
        details: 'Esta key es necesaria para crear usuarios desde el servidor.'
      }
    }

    const supabaseAdmin = createAdminClient(supabaseAdminUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // PASO 1: Crear el club en la tabla clubs
    const { data: newClub, error: clubError } = await supabase
      .from('clubs')
      .insert({
        nombre: data.clubNombre,
        email: data.clubEmail || null,
        telefono: data.clubTelefono || null,
        direccion: data.clubDireccion || null,
        theme: data.clubTheme || 'theme-sky',
        activa: true,
      })
      .select()
      .single()

    if (clubError) {
      console.error('Error creating club:', clubError)
      return { 
        error: `Error al crear el club: ${clubError.message}`,
        details: clubError.details || null
      }
    }

    if (!newClub) {
      return { 
        error: 'No se pudo crear el club',
        details: null
      }
    }

    // PASO 2: Crear el usuario en Supabase Auth usando admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.adminEmail,
      password: data.adminPassword,
      email_confirm: true, // Confirmar email automáticamente
      user_metadata: {
        nombre: data.adminNombre,
        apellido: data.adminApellido,
        role: 'CLUB_ADMIN',
        club_id: newClub.id,
      },
    })

    if (authError) {
      // Si falla la creación del usuario, eliminar el club creado
      await supabase.from('clubs').delete().eq('id', newClub.id)
      console.error('Error creating auth user:', authError)
      return { 
        error: `Error al crear el usuario: ${authError.message}`,
        details: authError.message || null
      }
    }

    if (!authData.user) {
      await supabase.from('clubs').delete().eq('id', newClub.id)
      return { 
        error: 'No se pudo crear el usuario en Auth',
        details: null
      }
    }

    // PASO 3: Crear el registro en la tabla users
    const { error: userError } = await supabase
      .from('users')
      .insert({
        auth_user_id: authData.user.id,
        club_id: newClub.id,
        role: 'CLUB_ADMIN',
        nombre: data.adminNombre,
        apellido: data.adminApellido,
        email: data.adminEmail,
        telefono: data.adminTelefono || null,
        activo: true,
      })

    if (userError) {
      // Si falla, eliminar el usuario de auth y el club
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      await supabase.from('clubs').delete().eq('id', newClub.id)
      console.error('Error creating user record:', userError)
      return { 
        error: `Error al crear el registro de usuario: ${userError.message}`,
        details: userError.details || null
      }
    }

    // Revalidar páginas
    revalidatePath('/superadmin/clubs')
    revalidatePath('/superadmin')

    return { 
      data: {
        club: newClub,
        user: {
          id: authData.user.id,
          email: data.adminEmail,
        }
      },
      error: null
    }
  } catch (error) {
    const err = error as Error
    console.error('Error in createClubWithAdmin:', err)
    return { 
      error: err.message || 'Error al crear el club y usuario',
      details: null
    }
  }
}

