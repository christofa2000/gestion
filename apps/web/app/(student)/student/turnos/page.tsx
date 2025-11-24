/**
 * Página: Mis Turnos (Alumno)
 * 
 * Muestra los turnos reservados del alumno
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@repo/supabase/client'
import { Badge } from '@repo/ui'
import { Calendar, Clock, MapPin, Loader2, XCircle } from 'lucide-react'

export default function StudentTurnosPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [cancelando, setCancelando] = useState<string | null>(null)
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const supabase = createSupabaseBrowserClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/auth/login')
      return
    }

    const studentId = user.user_metadata?.student_id

    if (!studentId) {
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('bookings')
      .select(`
        *,
        time_slots (
          *,
          activities:actividad_id(nombre),
          branches:branch_id(nombre)
        )
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })

    setBookings(data || [])
    setLoading(false)
  }

  const handleCancelar = async (bookingId: string, slotFecha: string) => {
    // Verificar que falte más de 24 horas
    const now = new Date()
    const slotDate = new Date(slotFecha)
    const horasRestantes = (slotDate.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (horasRestantes < 24) {
      alert('No se puede cancelar con menos de 24 horas de anticipación')
      return
    }

    if (!confirm('¿Confirmas que quieres cancelar esta reserva?')) {
      return
    }

    setCancelando(bookingId)

    try {
      const supabase = createSupabaseBrowserClient()

      const { error } = await supabase
        .from('bookings')
        .update({ estado: 'cancelado' })
        .eq('id', bookingId)

      if (error) throw error

      alert('Reserva cancelada')
      loadData()
    } catch (err) {
      const error = err as Error
      console.error('Error cancelling:', error)
      alert('Error al cancelar: ' + error.message)
    } finally {
      setCancelando(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text-main)]">
          Mis Turnos
        </h1>
        <p className="text-[var(--color-text-muted)] mt-1">
          Turnos reservados y historial
        </p>
      </div>

      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-[var(--color-text-main)] mb-2">
              No tienes turnos reservados
            </h3>
            <p className="text-[var(--color-text-muted)]">
              Ve a la agenda para reservar tu primer turno
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {bookings.map((booking) => {
              const slot = booking.time_slots
              if (!slot) return null

              const isPast = new Date(slot.fecha) < new Date()
              const canCancel = !isPast && booking.estado === 'reservado'

              return (
                <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-xl font-bold text-[var(--color-text-main)]">
                          {new Date(slot.fecha).toLocaleDateString('es-AR', { 
                            weekday: 'short', 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </div>
                        <div className="text-lg text-[var(--color-text-muted)]">
                          {slot.hora_inicio.substring(0, 5)} - {slot.hora_fin.substring(0, 5)}
                        </div>
                        <Badge 
                          variant={
                            booking.estado === 'reservado' ? 'success' :
                            booking.estado === 'espera' ? 'warning' :
                            booking.estado === 'cancelado' ? 'danger' :
                            'default'
                          }
                        >
                          {booking.estado === 'reservado' ? 'Confirmado' :
                           booking.estado === 'espera' ? 'En Espera' :
                           booking.estado === 'cancelado' ? 'Cancelado' :
                           booking.estado === 'ausente' ? 'Ausente' :
                           booking.estado}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-[var(--color-text-main)]">
                          <MapPin className="w-4 h-4 text-[var(--color-text-muted)]" />
                          {slot.branches?.nombre || '-'}
                        </div>
                        <div className="flex items-center gap-2 text-[var(--color-text-main)]">
                          <Clock className="w-4 h-4 text-[var(--color-text-muted)]" />
                          {slot.activities?.nombre || '-'}
                        </div>
                      </div>
                    </div>

                    {canCancel && (
                      <button
                        onClick={() => handleCancelar(booking.id, slot.fecha)}
                        disabled={cancelando === booking.id}
                        className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {cancelando === booking.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            Cancelar
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
