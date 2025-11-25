'use server'

/**
 * Server Actions para gestión de sedes (clubs)
 */

import { createClient } from '@repo/supabase/server'
import { getClubId } from '@/lib/auth'
import { getUser } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'

export interface CreateSedeData {
  nombre: string
  telefono?: string
  email?: string
  direccion?: string
  theme?: 'theme-sky' | 'theme-sport' | 'theme-neutral'
  activa?: boolean
}

export async function createSede(data: CreateSedeData) {
  try {
    // Crear cliente de Supabase del servidor
    const supabase = await createClient()
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return { error: 'No autenticado', details: authError?.message }
    }

    // Obtener club_id
    const clubId = getClubId(user)
    if (!clubId) {
      return { error: 'No se pudo obtener el club del usuario' }
    }

    // Limpiar datos vacíos
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
    )

    // Verificar si el club ya existe
    const { data: existingClub } = await supabase
      .from('clubs')
      .select('id')
      .eq('id', clubId)
      .single()

    let newSede
    let insertError

    if (existingClub) {
      // Si el club ya existe, actualizarlo
      const result = await supabase
        .from('clubs')
        .update({
          ...cleanData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', clubId)
        .select()
        .single()
      
      newSede = result.data
      insertError = result.error
    } else {
      // Si no existe, crearlo
      const result = await supabase
        .from('clubs')
        .insert({
          ...cleanData,
          id: clubId,
        })
        .select()
        .single()
      
      newSede = result.data
      insertError = result.error
    }

    if (insertError) {
      console.error('Error inserting sede:', insertError)
      return { 
        error: insertError.message || 'Error al crear la sede',
        details: insertError.details || null,
        code: insertError.code || null
      }
    }

    // Revalidar la página de sedes
    revalidatePath('/admin/sedes')

    return { data: newSede, error: null }
  } catch (error) {
    const err = error as Error
    console.error('Error in createSede:', err)
    return { error: err.message || 'Error al crear la sede' }
  }
}

export async function updateSede(sedeId: string, data: Partial<CreateSedeData>) {
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

    // Limpiar datos vacíos
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
    )

    // Actualizar sede
    const { data: updatedSede, error: updateError } = await supabase
      .from('clubs')
      .update({
        ...cleanData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sedeId)
      .eq('id', clubId) // Asegurar que solo se actualice la sede del club actual
      .select()
      .single()

    if (updateError) {
      console.error('Error updating sede:', updateError)
      return { error: updateError.message || 'Error al actualizar la sede' }
    }

    // Revalidar páginas
    revalidatePath('/admin/sedes')
    revalidatePath(`/admin/sedes/${sedeId}`)

    return { data: updatedSede, error: null }
  } catch (error) {
    const err = error as Error
    console.error('Error in updateSede:', err)
    return { error: err.message || 'Error al actualizar la sede' }
  }
}

export async function deleteSede(sedeId: string) {
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

    // Nota: En V1, las sedes están en la tabla clubs, pero en el futuro pueden estar en branches
    // Por ahora, solo se puede desactivar la sede (soft delete)
    const { error: updateError } = await supabase
      .from('clubs')
      .update({
        activa: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sedeId)
      .eq('id', clubId) // Asegurar que solo se actualice la sede del club actual

    if (updateError) {
      console.error('Error deleting sede:', updateError)
      return { error: updateError.message || 'Error al eliminar la sede' }
    }

    // Revalidar páginas
    revalidatePath('/admin/sedes')

    return { success: true, error: null }
  } catch (error) {
    const err = error as Error
    console.error('Error in deleteSede:', err)
    return { error: err.message || 'Error al eliminar la sede' }
  }
}

