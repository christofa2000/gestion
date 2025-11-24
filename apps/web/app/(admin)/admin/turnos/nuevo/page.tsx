/**
 * Página: Crear Turno
 * 
 * Formulario para crear un nuevo turno
 */

import { redirect } from 'next/navigation'
import { createClient, getUser } from '@repo/supabase/server'
import { canAccessAdmin, getClubId } from '@/lib/auth'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { TurnoForm } from '../components/TurnoForm'

export default async function NuevoTurnoPage() {
  const user = await getUser()
  
  if (!user || !canAccessAdmin(user)) {
    redirect('/auth/login')
  }

  const clubId = getClubId(user)
  
  if (!clubId) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: No se pudo obtener el club del usuario</p>
        </div>
      </div>
    )
  }

  // Obtener opciones para el formulario
  const supabase = await createClient()
  
  const [sedes, actividades, profesionales] = await Promise.all([
    supabase.from('branches').select('id, nombre').eq('club_id', clubId),
    supabase.from('activities').select('id, nombre').eq('club_id', clubId),
    supabase.from('professionals').select('id, nombre, apellido').eq('club_id', clubId),
  ])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/turnos">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-main)]">
            Crear Turno
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Crea un nuevo turno para la agenda
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
        <TurnoForm 
          clubId={clubId}
          sedes={sedes.data || []}
          actividades={actividades.data || []}
          profesionales={profesionales.data || []}
        />
      </div>
    </div>
  )
}




