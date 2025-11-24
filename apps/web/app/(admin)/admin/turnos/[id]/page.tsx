/**
 * Página: Detalle de Turno
 * 
 * Muestra el detalle del turno y gestión de reservas
 */

import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient, getUser } from '@repo/supabase/server'
import { canAccessAdmin, getClubId } from '@/lib/auth'
import { ArrowLeft, Calendar, Clock, MapPin, UserCog, Users, AlertCircle } from 'lucide-react'
import { Badge } from '@repo/ui'

interface PageProps {
  params: {
    id: string
  }
}

export default async function TurnoDetallePage({ params }: PageProps) {
  const user = await getUser()
  
  if (!user || !canAccessAdmin(user)) {
    redirect('/auth/login')
  }

  const clubId = getClubId(user)
  
  if (!clubId) {
    return <div className="p-6">Error: No se pudo obtener el club del usuario</div>
  }

  const supabase = await createClient()
  
  // Obtener turno
  const { data: slot, error } = await supabase
    .from('time_slots')
    .select(`
      *,
      activities:actividad_id(id, nombre),
      branches:branch_id(id, nombre),
      professionals:professional_id(id, nombre, apellido)
    `)
    .eq('id', params.id)
    .eq('club_id', clubId)
    .single()

  if (error || !slot) {
    notFound()
  }

  // Obtener reservas
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      students:student_id(id, nombre, apellido, email, telefono)
    `)
    .eq('slot_id', params.id)
    .order('created_at', { ascending: false })

  const reservasConfirmadas = bookings?.filter(b => b.estado === 'reservado').length || 0
  const enEspera = bookings?.filter(b => b.estado === 'espera').length || 0

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/turnos">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-main)]">
              Detalle del Turno
            </h1>
            <p className="text-[var(--color-text-muted)] mt-1">
              {slot.activities?.nombre || 'Sin actividad'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {slot.estado === 'cancelado' ? (
            <Badge variant="danger">Cancelado</Badge>
          ) : (
            <Badge variant="success">Activo</Badge>
          )}
        </div>
      </div>

      {/* Info del turno */}
      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
        <h2 className="text-lg font-semibold text-[var(--color-text-main)] mb-4">
          Información del Turno
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoItem 
            icon={<Calendar className="w-5 h-5" />}
            label="Fecha"
            value={new Date(slot.fecha).toLocaleDateString('es-AR')}
          />
          <InfoItem 
            icon={<Clock className="w-5 h-5" />}
            label="Horario"
            value={`${slot.hora_inicio.substring(0, 5)} - ${slot.hora_fin.substring(0, 5)}`}
          />
          <InfoItem 
            icon={<MapPin className="w-5 h-5" />}
            label="Sede"
            value={slot.branches?.nombre || 'Sin sede'}
          />
          <InfoItem 
            icon={<UserCog className="w-5 h-5" />}
            label="Profesional"
            value={slot.professionals ? `${slot.professionals.nombre} ${slot.professionals.apellido}` : 'Sin profesional'}
          />
        </div>

        {/* Capacidad */}
        <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--color-text-main)]">
              Capacidad
            </span>
            <span className="text-sm text-[var(--color-text-muted)]">
              {reservasConfirmadas} / {slot.cupo_maximo} reservados
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                reservasConfirmadas >= slot.cupo_maximo 
                  ? 'bg-red-500' 
                  : reservasConfirmadas / slot.cupo_maximo > 0.7 
                  ? 'bg-yellow-500' 
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min((reservasConfirmadas / slot.cupo_maximo) * 100, 100)}%` }}
            />
          </div>
          {enEspera > 0 && (
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mt-2">
              <AlertCircle className="w-4 h-4" />
              {enEspera} personas en lista de espera
            </div>
          )}
        </div>
      </div>

      {/* Reservas */}
      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
        <div className="p-6 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text-main)] flex items-center gap-2">
            <Users className="w-5 h-5" />
            Reservas ({bookings?.length || 0})
          </h2>
        </div>

        {!bookings || bookings.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[var(--color-text-muted)]">
              No hay reservas para este turno
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-[var(--color-border)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">
                    Alumno
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">
                    Fecha Reserva
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[var(--color-text-main)]">
                        {booking.students?.nombre} {booking.students?.apellido}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--color-text-muted)]">
                        {booking.students?.email || booking.students?.telefono || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)]">
                      {new Date(booking.created_at).toLocaleDateString('es-AR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-[var(--color-text-muted)] mt-1">
        {icon}
      </div>
      <div>
        <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
        <p className="text-sm font-medium text-[var(--color-text-main)]">{value}</p>
      </div>
    </div>
  )
}
