'use server'

/**
 * Server Actions para gestión de turnos
 */

import { createClient } from '@repo/supabase/server'
import { getClubId } from '@/lib/auth'
import { getUser } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteTurno(turnoId: string) {
  try {
    // Verificar autenticación
    const user = await getUser()
    if (!user) {
      return { error: 'No autenticado' }
    }

    // Obtener club_id
    const clubId = getClubId(user)
    if (!clubId) {
      return { error: 'No se pudo obtener el club del usuario' }
    }

    // Crear cliente de Supabase del servidor
    const supabase = await createClient()

    // Eliminar turno (hard delete)
    // Nota: Esto también eliminará las reservas asociadas por CASCADE si está configurado en la BD
    const { error: deleteError } = await supabase
      .from('time_slots')
      .delete()
      .eq('id', turnoId)
      .eq('club_id', clubId) // Asegurar que solo se elimine del club del usuario

    if (deleteError) {
      console.error('Error deleting turno:', deleteError)
      return { error: deleteError.message || 'Error al eliminar el turno' }
    }

    // Revalidar páginas
    revalidatePath('/admin/turnos')

    return { success: true, error: null }
  } catch (error) {
    const err = error as Error
    console.error('Error in deleteTurno:', err)
    return { error: err.message || 'Error al eliminar el turno' }
  }
}

