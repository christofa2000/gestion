/**
 * Página: Agenda de Turnos
 * 
 * Vista principal de turnos/agenda diaria con filtros
 */

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient, getUser } from '@repo/supabase/server'
import { canAccessAdmin, getClubId } from '@/lib/auth'
import { Calendar, Plus, Filter } from 'lucide-react'
import { TurnosGrid } from './components/TurnosGrid'
import { TurnosFilters } from './components/TurnosFilters'

interface PageProps {
  searchParams: {
    fecha?: string
    sede?: string
    actividad?: string
    profesional?: string
  }
}

export default async function TurnosPage({ searchParams }: PageProps) {
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

  // Parámetros de filtro
  const fecha = searchParams.fecha || new Date().toISOString().split('T')[0]
  const sedeId = searchParams.sede || ''
  const actividadId = searchParams.actividad || ''
  const profesionalId = searchParams.profesional || ''

  // Consultar turnos del día
  const supabase = await createClient()
  
  let query = supabase
    .from('time_slots')
    .select(`
      *,
      activities:actividad_id(id, nombre),
      branches:branch_id(id, nombre),
      professionals:professional_id(id, nombre, apellido)
    `)
    .eq('club_id', clubId)
    .eq('fecha', fecha)
    .order('hora_inicio', { ascending: true })

  if (sedeId) query = query.eq('branch_id', sedeId)
  if (actividadId) query = query.eq('actividad_id', actividadId)
  if (profesionalId) query = query.eq('professional_id', profesionalId)

  const { data: slots, error } = await query

  if (error) {
    console.error('Error fetching slots:', error)
  }

  // Contar reservas por slot
  const slotIds = slots?.map(s => s.id) || []
  
  interface BookingData {
    slot_id: string
    estado: 'reservado' | 'espera' | 'cancelado' | 'completado'
  }
  
  let reservasData: BookingData[] = []
  
  if (slotIds.length > 0) {
    const { data } = await supabase
      .from('bookings')
      .select('slot_id, estado')
      .in('slot_id', slotIds)
    
    reservasData = (data as BookingData[]) || []
  }

  // Mapear reservas por slot
  const reservasPorSlot = reservasData.reduce((acc, r) => {
    if (!acc[r.slot_id]) acc[r.slot_id] = { reservado: 0, espera: 0 }
    if (r.estado === 'reservado') acc[r.slot_id].reservado++
    if (r.estado === 'espera') acc[r.slot_id].espera++
    return acc
  }, {} as Record<string, { reservado: number; espera: number }>)

  // Obtener opciones para filtros
  const [sedes, actividades, profesionales] = await Promise.all([
    supabase.from('branches').select('id, nombre').eq('club_id', clubId),
    supabase.from('activities').select('id, nombre').eq('club_id', clubId),
    supabase.from('professionals').select('id, nombre, apellido').eq('club_id', clubId),
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-main)]">
            Agenda de Turnos
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Gestiona los turnos y reservas del club
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/admin/turnos/configuracion">
            <button className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5" />
              Configuración
            </button>
          </Link>
          <Link href="/admin/turnos/nuevo">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors">
              <Plus className="w-5 h-5" />
              Crear Turno
            </button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--color-surface)] p-4 rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-text-main)]">{slots?.length || 0}</p>
              <p className="text-sm text-[var(--color-text-muted)]">Turnos del Día</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <TurnosFilters
        initialFecha={fecha}
        initialSede={sedeId}
        initialActividad={actividadId}
        initialProfesional={profesionalId}
        sedes={sedes.data || []}
        actividades={actividades.data || []}
        profesionales={profesionales.data || []}
      />

      {/* Grid de turnos */}
      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
        <Suspense fallback={<div className="p-6">Cargando...</div>}>
          <TurnosGrid 
            slots={slots || []}
            reservasPorSlot={reservasPorSlot}
          />
        </Suspense>
      </div>
    </div>
  )
}
