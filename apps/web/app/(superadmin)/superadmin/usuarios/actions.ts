'use server'

/**
 * Server Actions para gestión de usuarios ADMIN (SUPER_ADMIN)
 */

import { createClient } from '@repo/supabase/server'
import { isSuperAdmin } from '@/lib/auth'
import { getUser } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function deleteUserAdmin(userId: string) {
  try {
    // Verificar autenticación y permisos
    const user = await getUser()
    if (!user || !isSuperAdmin(user)) {
      return { error: 'No autorizado. Solo SUPER_ADMIN puede eliminar usuarios ADMIN.' }
    }

    // Crear cliente de Supabase del servidor
    const supabase = await createClient()

    // Obtener información del usuario a eliminar
    const { data: userToDelete, error: fetchError } = await supabase
      .from('users')
      .select('auth_user_id, role')
      .eq('id', userId)
      .single()

    if (fetchError || !userToDelete) {
      return { error: 'Usuario no encontrado' }
    }

    // No permitir eliminar SUPER_ADMIN
    if (userToDelete.role === 'SUPER_ADMIN') {
      return { error: 'No se puede eliminar un usuario SUPER_ADMIN' }
    }

    // Eliminar de la tabla users
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (deleteError) {
      console.error('Error deleting user:', deleteError)
      return { error: deleteError.message || 'Error al eliminar el usuario' }
    }

    // Eliminar de Supabase Auth usando service_role si está disponible
    // Nota: Esto requiere SUPABASE_SERVICE_ROLE_KEY
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (supabaseServiceRoleKey && userToDelete.auth_user_id) {
      try {
        const supabaseAdmin = createAdminClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          supabaseServiceRoleKey,
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          }
        )
        
        await supabaseAdmin.auth.admin.deleteUser(userToDelete.auth_user_id)
      } catch (authError) {
        // Si falla la eliminación de auth, loguear pero no fallar
        console.warn('No se pudo eliminar el usuario de Auth:', authError)
      }
    }

    // Revalidar páginas
    revalidatePath('/superadmin/usuarios')

    return { success: true, error: null }
  } catch (error) {
    const err = error as Error
    console.error('Error in deleteUserAdmin:', err)
    return { error: err.message || 'Error al eliminar el usuario' }
  }
}

