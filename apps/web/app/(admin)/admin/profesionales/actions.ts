'use server'

/**
 * Server Actions para gestión de profesionales
 */

import { createClient } from '@repo/supabase/server'
import { getClubId } from '@/lib/auth'
import { getUser } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'

export interface CreateProfesionalData {
  nombre: string
  apellido: string
  email?: string
  telefono?: string
  especialidad?: string
  estado?: 'activo' | 'inactivo' | 'licencia'
}

export async function createProfesional(data: CreateProfesionalData) {
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

    // Insertar profesional
    const { data: newProfesional, error: insertError } = await supabase
      .from('professionals')
      .insert({
        ...cleanData,
        club_id: clubId,
        estado: data.estado || 'activo',
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting profesional:', insertError)
      return { 
        error: insertError.message || 'Error al crear el profesional',
        details: insertError.details || null,
        code: insertError.code || null
      }
    }

    // Revalidar la página de profesionales
    revalidatePath('/admin/profesionales')

    return { data: newProfesional, error: null }
  } catch (error) {
    const err = error as Error
    console.error('Error in createProfesional:', err)
    return { error: err.message || 'Error al crear el profesional' }
  }
}

export async function updateProfesional(profesionalId: string, data: Partial<CreateProfesionalData>) {
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

    // Actualizar profesional
    const { data: updatedProfesional, error: updateError } = await supabase
      .from('professionals')
      .update({
        ...cleanData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profesionalId)
      .eq('club_id', clubId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating profesional:', updateError)
      return { error: updateError.message || 'Error al actualizar el profesional' }
    }

    // Revalidar páginas
    revalidatePath('/admin/profesionales')
    revalidatePath(`/admin/profesionales/${profesionalId}`)

    return { data: updatedProfesional, error: null }
  } catch (error) {
    const err = error as Error
    console.error('Error in updateProfesional:', err)
    return { error: err.message || 'Error al actualizar el profesional' }
  }
}

export async function deleteProfesional(profesionalId: string) {
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

    // Eliminar profesional (hard delete)
    const { error: deleteError } = await supabase
      .from('professionals')
      .delete()
      .eq('id', profesionalId)
      .eq('club_id', clubId) // Asegurar que solo se elimine del club del usuario

    if (deleteError) {
      console.error('Error deleting profesional:', deleteError)
      return { error: deleteError.message || 'Error al eliminar el profesional' }
    }

    // Revalidar páginas
    revalidatePath('/admin/profesionales')

    return { success: true, error: null }
  } catch (error) {
    const err = error as Error
    console.error('Error in deleteProfesional:', err)
    return { error: err.message || 'Error al eliminar el profesional' }
  }
}

