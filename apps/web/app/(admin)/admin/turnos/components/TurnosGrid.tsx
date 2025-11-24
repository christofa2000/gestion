/**
 * Componente: Grid de Turnos
 * 
 * Muestra los turnos del día en formato de lista
 */

'use client'

import Link from 'next/link'
import { Eye, Users, Clock, MapPin, UserCog, AlertCircle } from 'lucide-react'
import { Badge } from '@repo/ui'

interface TimeSlot {
  id: string
  fecha: string
  hora_inicio: string
  hora_fin: string
  cupo_maximo: number
  estado: string
  activities: { id: string; nombre: string } | null
  branches: { id: string; nombre: string } | null
  professionals: { id: string; nombre: string; apellido: string } | null
}

interface TurnosGridProps {
  slots: TimeSlot[]
  reservasPorSlot: Record<string, { reservado: number; espera: number }>
}

export function TurnosGrid({ slots, reservasPorSlot }: TurnosGridProps) {
  if (slots.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <Clock className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text-main)] mb-2">
          No hay turnos programados
        </h3>
        <p className="text-[var(--color-text-muted)] mb-6">
          Crea un nuevo turno para comenzar
        </p>
        <Link href="/admin/turnos/nuevo">
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors">
            Crear Turno
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="divide-y divide-[var(--color-border)]">
      {slots.map((slot) => {
        const reservas = reservasPorSlot[slot.id] || { reservado: 0, espera: 0 }
        const ocupacion = Math.round((reservas.reservado / slot.cupo_maximo) * 100)
        const isFull = reservas.reservado >= slot.cupo_maximo
        const isCancelled = slot.estado === 'cancelado'

        return (
          <div
            key={slot.id}
            className={`p-6 hover:bg-gray-50 transition-colors ${isCancelled ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Horario */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl font-bold text-[var(--color-text-main)]">
                    {slot.hora_inicio.substring(0, 5)}
                  </div>
                  <div className="text-lg text-[var(--color-text-muted)]">
                    — {slot.hora_fin.substring(0, 5)}
                  </div>
                  {isCancelled && (
                    <Badge variant="danger">Cancelado</Badge>
                  )}
                </div>

                {/* Info del turno */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-[var(--color-text-main)]">
                    <MapPin className="w-4 h-4 text-[var(--color-text-muted)]" />
                    <span className="font-medium">
                      {slot.branches?.nombre || 'Sin sede'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[var(--color-text-main)]">
                    <Clock className="w-4 h-4 text-[var(--color-text-muted)]" />
                    <span className="font-medium">
                      {slot.activities?.nombre || 'Sin actividad'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[var(--color-text-main)]">
                    <UserCog className="w-4 h-4 text-[var(--color-text-muted)]" />
                    <span className="font-medium">
                      {slot.professionals 
                        ? `${slot.professionals.nombre} ${slot.professionals.apellido}`
                        : 'Sin profesional'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Capacidad y acciones */}
              <div className="flex items-center gap-4 ml-6">
                {/* Cupo */}
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-[var(--color-text-muted)]" />
                    <span className="text-lg font-bold text-[var(--color-text-main)]">
                      {reservas.reservado}
                    </span>
                    <span className="text-sm text-[var(--color-text-muted)]">
                      / {slot.cupo_maximo}
                    </span>
                  </div>
                  
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        isFull ? 'bg-red-500' : ocupacion > 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(ocupacion, 100)}%` }}
                    />
                  </div>

                  {reservas.espera > 0 && (
                    <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {reservas.espera} en espera
                    </div>
                  )}
                </div>

                {/* Botón ver detalle */}
                <Link href={`/admin/turnos/${slot.id}`}>
                  <button className="p-2 border border-[var(--color-border)] rounded-lg hover:bg-gray-100 transition-colors">
                    <Eye className="w-5 h-5 text-[var(--color-text-muted)]" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}




