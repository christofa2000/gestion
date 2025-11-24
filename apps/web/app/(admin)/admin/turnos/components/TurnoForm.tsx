/**
 * Componente: Formulario de Turno
 * 
 * Formulario para crear turnos
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createSupabaseBrowserClient } from '@repo/supabase/client'
import { Input, Select } from '@repo/ui'
import { Loader2, Save } from 'lucide-react'

const turnoSchema = z.object({
  fecha: z.string().min(1, 'La fecha es requerida'),
  hora_inicio: z.string().min(1, 'La hora de inicio es requerida'),
  hora_fin: z.string().min(1, 'La hora de fin es requerida'),
  branch_id: z.string().min(1, 'La sede es requerida'),
  actividad_id: z.string().min(1, 'La actividad es requerida'),
  professional_id: z.string().min(1, 'El profesional es requerido'),
  cupo_maximo: z.number().min(1, 'El cupo debe ser al menos 1').max(100, 'El cupo máximo es 100'),
  estado: z.enum(['activo', 'cancelado']),
})

type TurnoFormData = z.infer<typeof turnoSchema>

interface TurnoFormProps {
  clubId: string
  sedes: Array<{ id: string; nombre: string }>
  actividades: Array<{ id: string; nombre: string }>
  profesionales: Array<{ id: string; nombre: string; apellido: string }>
}

export function TurnoForm({ clubId, sedes, actividades, profesionales }: TurnoFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TurnoFormData>({
    resolver: zodResolver(turnoSchema),
    defaultValues: {
      fecha: new Date().toISOString().split('T')[0],
      estado: 'activo',
      cupo_maximo: 8,
    },
  })

  const onSubmit = async (data: TurnoFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createSupabaseBrowserClient()

      const { data: newSlot, error: insertError } = await supabase
        .from('time_slots')
        .insert({
          ...data,
          club_id: clubId,
        })
        .select()
        .single()

      if (insertError) throw insertError

      router.push(`/admin/turnos/${newSlot.id}`)
      router.refresh()
    } catch (err) {
      const error = err as Error
      console.error('Error creating slot:', error)
      setError(error.message || 'Error al crear el turno')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Fecha y horarios */}
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-text-main)] mb-4">
          Fecha y Horarios
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Fecha *
            </label>
            <Input type="date" {...register('fecha')} />
            {errors.fecha && (
              <p className="text-xs text-red-600 mt-1">{errors.fecha.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Hora Inicio *
            </label>
            <Input type="time" {...register('hora_inicio')} />
            {errors.hora_inicio && (
              <p className="text-xs text-red-600 mt-1">{errors.hora_inicio.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Hora Fin *
            </label>
            <Input type="time" {...register('hora_fin')} />
            {errors.hora_fin && (
              <p className="text-xs text-red-600 mt-1">{errors.hora_fin.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Detalles del turno */}
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-text-main)] mb-4">
          Detalles del Turno
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Sede *
            </label>
            <Select {...register('branch_id')}>
              <option value="">Seleccionar sede...</option>
              {sedes.map((sede) => (
                <option key={sede.id} value={sede.id}>
                  {sede.nombre}
                </option>
              ))}
            </Select>
            {errors.branch_id && (
              <p className="text-xs text-red-600 mt-1">{errors.branch_id.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Actividad *
            </label>
            <Select {...register('actividad_id')}>
              <option value="">Seleccionar actividad...</option>
              {actividades.map((act) => (
                <option key={act.id} value={act.id}>
                  {act.nombre}
                </option>
              ))}
            </Select>
            {errors.actividad_id && (
              <p className="text-xs text-red-600 mt-1">{errors.actividad_id.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Profesional *
            </label>
            <Select {...register('professional_id')}>
              <option value="">Seleccionar profesional...</option>
              {profesionales.map((prof) => (
                <option key={prof.id} value={prof.id}>
                  {prof.nombre} {prof.apellido}
                </option>
              ))}
            </Select>
            {errors.professional_id && (
              <p className="text-xs text-red-600 mt-1">{errors.professional_id.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Cupo Máximo *
            </label>
            <Input 
              type="number" 
              min="1" 
              max="100"
              {...register('cupo_maximo', { valueAsNumber: true })} 
            />
            {errors.cupo_maximo && (
              <p className="text-xs text-red-600 mt-1">{errors.cupo_maximo.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Estado
            </label>
            <Select {...register('estado')}>
              <option value="activo">Activo</option>
              <option value="cancelado">Cancelado</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-[var(--color-border)]">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-gray-50 transition-colors"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Crear Turno
            </>
          )}
        </button>
      </div>
    </form>
  )
}

