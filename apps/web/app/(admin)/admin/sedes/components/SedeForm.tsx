/**
 * Componente: Formulario de Sede
 * 
 * Formulario para crear/editar sedes con validación
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input, Select } from '@repo/ui'
import { Loader2, Save } from 'lucide-react'
import { createSede, updateSede } from '../actions'

// Schema de validación
const sedeSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  telefono: z.string().optional(),
  email: z.string().email('Email inválido').or(z.literal('')).optional(),
  direccion: z.string().optional(),
  theme: z.enum(['theme-sky', 'theme-sport', 'theme-neutral']).optional(),
  activa: z.boolean().default(true),
})

type SedeFormData = z.infer<typeof sedeSchema>

interface SedeFormProps {
  initialData?: Partial<SedeFormData>
  sedeId?: string
}

export function SedeForm({ initialData, sedeId }: SedeFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SedeFormData>({
    resolver: zodResolver(sedeSchema),
    defaultValues: {
      activa: true,
      theme: 'theme-sky',
      ...initialData,
    },
  })

  const onSubmit = async (data: SedeFormData) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      if (sedeId) {
        // Actualizar sede existente
        const result = await updateSede(sedeId, data)

        if (result.error) {
          throw new Error(result.error)
        }

        setSuccess('Sede actualizada correctamente')
        setTimeout(() => {
          router.push(`/admin/sedes/${sedeId}`)
          router.refresh()
        }, 1500)
      } else {
        // Crear nueva sede
        const result = await createSede(data)

        if (result.error) {
          const errorMessage = result.details 
            ? `${result.error}\nDetalles: ${result.details}`
            : result.error
          throw new Error(errorMessage)
        }

        if (!result.data) {
          throw new Error('No se recibieron datos de la sede creada')
        }

        setSuccess('Sede creada correctamente')
        setTimeout(() => {
          router.push(`/admin/sedes/${result.data.id}`)
          router.refresh()
        }, 1500)
      }
    } catch (err) {
      const error = err as Error
      console.error('Error saving sede:', error)
      setError(error.message || 'Error al guardar la sede')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Mensajes de éxito/error */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Información básica */}
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-text-main)] mb-4">
          Información Básica
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Nombre *
            </label>
            <Input {...register('nombre')} />
            {errors.nombre && (
              <p className="text-xs text-red-600 mt-1">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Teléfono
            </label>
            <Input type="tel" {...register('telefono')} placeholder="+54 11 1234-5678" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Email
            </label>
            <Input type="email" {...register('email')} />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Tema
            </label>
            <Select {...register('theme')}>
              <option value="theme-sky">Sky (Azul)</option>
              <option value="theme-sport">Sport (Naranja)</option>
              <option value="theme-neutral">Neutral (Gris)</option>
            </Select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Dirección
            </label>
            <Input {...register('direccion')} placeholder="Calle y número" />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('activa')}
                className="w-4 h-4 rounded border-[var(--color-border)]"
              />
              <span className="text-sm font-medium text-[var(--color-text-main)]">
                Sede activa
              </span>
            </label>
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
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              {sedeId ? 'Actualizar' : 'Crear'} Sede
            </>
          )}
        </button>
      </div>
    </form>
  )
}

