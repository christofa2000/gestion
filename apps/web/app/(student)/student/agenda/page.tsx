'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@repo/supabase/client'
import { Button, Card, CardContent, Badge, Input, Select } from '@repo/ui'
import { Calendar, Clock, MapPin, Users, Loader2, Filter } from 'lucide-react'
import { clsx } from 'clsx'

export default function StudentAgendaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [reservando, setReservando] = useState<string | null>(null)
  const [studentId, setStudentId] = useState<string | null>(null)
  const [clubId, setClubId] = useState<string | null>(null)
  
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [sedeId, setSedeId] = useState('')
  const [actividadId, setActividadId] = useState('')
  
  interface Sede {
    id: string
    nombre: string
  }
  
  interface Actividad {
    id: string
    nombre: string
  }
  
  interface Professional {
    id: string
    nombre: string
    apellido: string
  }
  
  interface TimeSlot {
    id: string
    fecha: string
    hora_inicio: string
    hora_fin: string
    cupo_maximo: number
    estado: string
    activities: Actividad | null
    branches: Sede | null
    professionals: Professional | null
  }
  
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [sedes, setSedes] = useState<Sede[]>([])
  const [actividades, setActividades] = useState<Actividad[]>([])
  const [reservasPorSlot, setReservasPorSlot] = useState<Record<string, number>>({})

  useEffect(() => {
    loadData()
  }, [fecha, sedeId, actividadId])

  const loadData = async () => {
    setLoading(true)
    const supabase = createSupabaseBrowserClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/auth/login')
      return
    }

    const cId = user.user_metadata?.club_id
    const sId = user.user_metadata?.student_id
    
    setClubId(cId)
    setStudentId(sId)

    // Obtener opciones
    const [sedesRes, actividadesRes] = await Promise.all([
      supabase.from('branches').select('id, nombre').eq('club_id', cId),
      supabase.from('activities').select('id, nombre').eq('club_id', cId),
    ])

    setSedes(sedesRes.data || [])
    setActividades(actividadesRes.data || [])

    // Obtener turnos
    let query = supabase
      .from('time_slots')
      .select(`
        *,
        activities:actividad_id(id, nombre),
        branches:branch_id(id, nombre),
        professionals:professional_id(id, nombre, apellido)
      `)
      .eq('club_id', cId)
      .eq('fecha', fecha)
      .eq('estado', 'activo')
      .order('hora_inicio')

    if (sedeId) query = query.eq('branch_id', sedeId)
    if (actividadId) query = query.eq('actividad_id', actividadId)

    const { data: slotsData } = await query
    setSlots((slotsData as TimeSlot[]) || [])

    // Contar reservas
    const slotIds = slotsData?.map((s) => s.id) || []
    if (slotIds.length > 0) {
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('slot_id')
        .in('slot_id', slotIds)
        .eq('estado', 'reservado')

      interface BookingCount {
        slot_id: string
      }

      const reservasCounts: Record<string, number> = {}
      ;(bookingsData as BookingCount[] | null)?.forEach((b) => {
        reservasCounts[b.slot_id] = (reservasCounts[b.slot_id] || 0) + 1
      })
      setReservasPorSlot(reservasCounts)
    }

    setLoading(false)
  }

  const handleReservar = async (slotId: string, cupoMaximo: number) => {
    if (!studentId || !clubId) return

    const reservadas = reservasPorSlot[slotId] || 0
    const isFull = reservadas >= cupoMaximo

    setReservando(slotId)

    try {
      const supabase = createSupabaseBrowserClient()

      const { error } = await supabase
        .from('bookings')
        .insert({
          slot_id: slotId,
          student_id: studentId,
          estado: isFull ? 'espera' : 'reservado',
        })

      if (error) throw error

      alert(isFull ? 'Agregado a lista de espera' : 'Turno reservado exitosamente')
      loadData()
    } catch (err) {
      const error = err as Error
      console.error('Error reserving:', error)
      alert('Error al reservar: ' + error.message)
    } finally {
      setReservando(null)
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Agenda</h1>
          <p className="text-sm text-text-muted">Reserva tu próximo entrenamiento</p>
        </div>
        <Button variant="outline" size="sm" className="md:hidden">
          <Filter size={16} />
        </Button>
      </div>

      {/* Filtros (Desktop / Chips) */}
      <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-2 no-scrollbar">
        <div className="min-w-[150px]">
          <Input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="h-9"
          />
        </div>
        <div className="min-w-[150px]">
          <Select 
            value={sedeId} 
            onChange={(e) => setSedeId(e.target.value)}
            className="h-9"
          >
            <option value="">Todas las sedes</option>
            {sedes.map((s) => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </Select>
        </div>
        <div className="min-w-[150px]">
          <Select 
            value={actividadId} 
            onChange={(e) => setActividadId(e.target.value)}
            className="h-9"
          >
            <option value="">Todas las actividades</option>
            {actividades.map((a) => (
              <option key={a.id} value={a.id}>{a.nombre}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* Turnos Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : slots.length === 0 ? (
        <div className="text-center py-12 bg-surface rounded-lg border border-border-subtle border-dashed">
          <Calendar className="w-12 h-12 mx-auto text-text-muted mb-3 opacity-50" />
          <h3 className="font-medium text-text-main">No hay turnos disponibles</h3>
          <p className="text-sm text-text-muted">Intenta cambiar los filtros de búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {slots.map((slot) => {
            const reservadas = reservasPorSlot[slot.id] || 0
            const disponibles = slot.cupo_maximo - reservadas
            const isFull = disponibles <= 0

            return (
              <Card key={slot.id} className="overflow-hidden transition-all hover:shadow-md hover:border-primary/30">
                <div className="h-2 bg-primary/80 w-full" />
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-text-main">{slot.activities?.nombre}</h3>
                      <p className="text-sm text-text-muted flex items-center gap-1">
                        <MapPin size={12} />
                        {slot.branches?.nombre}
                      </p>
                    </div>
                    <Badge variant={isFull ? "warning" : "success"}>
                      {isFull ? "Espera" : "Disponible"}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-3 text-text-main">
                      <div className="p-2 rounded-lg bg-surface border border-border-subtle">
                        <Clock size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {slot.hora_inicio.substring(0, 5)} - {slot.hora_fin.substring(0, 5)}
                        </p>
                        <p className="text-xs text-text-muted">Duración: 60 min</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-text-main">
                      <div className="p-2 rounded-lg bg-surface border border-border-subtle">
                        <Users size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {slot.professionals?.nombre} {slot.professionals?.apellido}
                        </p>
                        <p className="text-xs text-text-muted">Profesor</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
                    <span className="text-xs font-medium text-text-muted">
                      {reservadas}/{slot.cupo_maximo} cupos ocupados
                    </span>
                    
                    <Button 
                      size="sm" 
                      onClick={() => handleReservar(slot.id, slot.cupo_maximo)}
                      disabled={reservando === slot.id}
                      isLoading={reservando === slot.id}
                      variant={isFull ? "secondary" : "primary"}
                    >
                      {isFull ? 'Lista de Espera' : 'Reservar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
