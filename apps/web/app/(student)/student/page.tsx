/**
 * Portal Alumno - Agenda
 * 
 * Página principal para alumnos donde pueden ver y reservar turnos.
 */

import { Calendar, Clock, MapPin } from 'lucide-react'

export default function StudentAgenda() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[var(--color-text-main)]">
          Mi Agenda
        </h1>
        <p className="text-[var(--color-text-muted)] mt-1">
          Reserva y gestiona tus turnos
        </p>
      </div>

      {/* Estado de cuenta */}
      <div className="bg-gradient-to-r from-primary to-[var(--color-primary-soft)] rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Estado de Cuenta</p>
            <p className="text-2xl font-bold mt-1">Al día ✓</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Próximo Pago</p>
            <p className="text-lg font-semibold mt-1">15 Dic</p>
          </div>
        </div>
      </div>

      {/* Mis turnos */}
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-text-main)] mb-4">
          Mis Próximos Turnos
        </h2>
        
        <div className="space-y-3">
          {/* Turno ejemplo 1 */}
          <TurnoCard
            actividad="Tenis - Clase Grupal"
            fecha="Lun 25 Nov"
            hora="18:00 - 19:00"
            sede="Sede Central"
            profesor="Juan Pérez"
          />

          {/* Turno ejemplo 2 */}
          <TurnoCard
            actividad="Tenis - Clase Individual"
            fecha="Mié 27 Nov"
            hora="19:00 - 20:00"
            sede="Sede Norte"
            profesor="María González"
          />
        </div>
      </div>

      {/* Botón de reservar */}
      <button className="w-full py-4 bg-primary hover:bg-[var(--color-primary-hover)] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
        <Calendar className="w-5 h-5" />
        Reservar Nuevo Turno
      </button>
    </div>
  )
}

interface TurnoCardProps {
  actividad: string
  fecha: string
  hora: string
  sede: string
  profesor: string
}

function TurnoCard({ actividad, fecha, hora, sede, profesor }: TurnoCardProps) {
  return (
    <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-border)] hover:border-primary transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-[var(--color-text-main)]">
            {actividad}
          </h3>
          
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <Calendar className="w-4 h-4" />
              <span>{fecha}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <Clock className="w-4 h-4" />
              <span>{hora}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <MapPin className="w-4 h-4" />
              <span>{sede} • {profesor}</span>
            </div>
          </div>
        </div>

        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
          <Calendar className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  )
}
