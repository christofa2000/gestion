'use server'

/**
 * Server Actions para gestión de clientes/estudiantes
 */

import { createClient } from '@repo/supabase/server'
import { getClubId } from '@/lib/auth'
import { getUser } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'

export interface CreateStudentData {
  nombre: string
  apellido: string
  apodo?: string
  telefono?: string
  email?: string
  contacto_emergencia?: string
  telefono_emergencia?: string
  fecha_nacimiento?: string
  genero?: string
  tipo_documento?: string
  numero_documento?: string
  ocupacion?: string
  obra_social?: string
  direccion?: string
  codigo_postal?: string
  ciudad?: string
  provincia?: string
  numero_cliente?: string
  estado?: string
  observaciones?: string
}

export async function createStudent(data: CreateStudentData) {
  try {
    // Crear cliente de Supabase del servidor primero
    const supabase = await createClient()
    
    // Verificar autenticación usando el cliente
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

    // Insertar estudiante
    const { data: newStudent, error: insertError } = await supabase
      .from('students')
      .insert({
        ...cleanData,
        club_id: clubId,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting student:', insertError)
      console.error('Error details:', JSON.stringify(insertError, null, 2))
      return { 
        error: insertError.message || 'Error al crear el estudiante',
        details: insertError.details || null,
        code: insertError.code || null
      }
    }

    // Revalidar la página de clientes
    revalidatePath('/admin/clientes')

    return { data: newStudent, error: null }
  } catch (error) {
    const err = error as Error
    console.error('Error in createStudent:', err)
    return { error: err.message || 'Error al crear el estudiante' }
  }
}

export async function updateStudent(studentId: string, data: Partial<CreateStudentData>) {
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

    // Actualizar estudiante
    const { data: updatedStudent, error: updateError } = await supabase
      .from('students')
      .update({
        ...cleanData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', studentId)
      .eq('club_id', clubId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating student:', updateError)
      return { error: updateError.message || 'Error al actualizar el estudiante' }
    }

    // Revalidar páginas
    revalidatePath('/admin/clientes')
    revalidatePath(`/admin/clientes/${studentId}`)

    return { data: updatedStudent, error: null }
  } catch (error) {
    const err = error as Error
    console.error('Error in updateStudent:', err)
    return { error: err.message || 'Error al actualizar el estudiante' }
  }
}

export async function deleteStudent(studentId: string) {
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

    // Eliminar estudiante (soft delete: marcar como eliminado o hard delete según corresponda)
    // V1: Hard delete por ahora, se puede cambiar a soft delete si se agrega campo deleted_at
    const { error: deleteError } = await supabase
      .from('students')
      .delete()
      .eq('id', studentId)
      .eq('club_id', clubId) // Asegurar que solo se elimine del club del usuario

    if (deleteError) {
      console.error('Error deleting student:', deleteError)
      return { error: deleteError.message || 'Error al eliminar el estudiante' }
    }

    // Revalidar páginas
    revalidatePath('/admin/clientes')

    return { success: true, error: null }
  } catch (error) {
    const err = error as Error
    console.error('Error in deleteStudent:', err)
    return { error: err.message || 'Error al eliminar el estudiante' }
  }
}

