/**
 * Componente: Formulario de Profesional
 * 
 * Formulario para crear/editar profesionales con validación
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input, Select } from '@repo/ui'
import { Loader2, Save } from 'lucide-react'
import { createProfesional, updateProfesional } from '../actions'

// Schema de validación
const profesionalSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido').or(z.literal('')).optional(),
  telefono: z.string().optional(),
  especialidad: z.string().optional(),
  estado: z.enum(['activo', 'inactivo', 'licencia']).default('activo'),
})

type ProfesionalFormData = z.infer<typeof profesionalSchema>

interface ProfesionalFormProps {
  initialData?: Partial<ProfesionalFormData>
  profesionalId?: string
}

export function ProfesionalForm({ initialData, profesionalId }: ProfesionalFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfesionalFormData>({
    resolver: zodResolver(profesionalSchema),
    defaultValues: {
      estado: 'activo',
      ...initialData,
    },
  })

  const onSubmit = async (data: ProfesionalFormData) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      if (profesionalId) {
        // Actualizar profesional existente
        const result = await updateProfesional(profesionalId, data)

        if (result.error) {
          throw new Error(result.error)
        }

        setSuccess('Profesional actualizado correctamente')
        setTimeout(() => {
          router.push(`/admin/profesionales/${profesionalId}`)
          router.refresh()
        }, 1500)
      } else {
        // Crear nuevo profesional
        const result = await createProfesional(data)

        if (result.error) {
          const errorMessage = result.details 
            ? `${result.error}\nDetalles: ${result.details}`
            : result.error
          throw new Error(errorMessage)
        }

        if (!result.data) {
          throw new Error('No se recibieron datos del profesional creado')
        }

        setSuccess('Profesional creado correctamente')
        setTimeout(() => {
          router.push(`/admin/profesionales/${result.data.id}`)
          router.refresh()
        }, 1500)
      }
    } catch (err) {
      const error = err as Error
      console.error('Error saving profesional:', error)
      setError(error.message || 'Error al guardar el profesional')
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

      {/* Datos personales */}
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-text-main)] mb-4">
          Datos Personales
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
              Apellido *
            </label>
            <Input {...register('apellido')} />
            {errors.apellido && (
              <p className="text-xs text-red-600 mt-1">{errors.apellido.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contacto */}
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-text-main)] mb-4">
          Información de Contacto
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              Teléfono
            </label>
            <Input type="tel" {...register('telefono')} placeholder="+54 11 1234-5678" />
          </div>
        </div>
      </div>

      {/* Información profesional */}
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-text-main)] mb-4">
          Información Profesional
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Especialidad
            </label>
            <Input {...register('especialidad')} placeholder="Ej: Tenis, Natación, etc." />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Estado
            </label>
            <Select {...register('estado')}>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="licencia">En Licencia</option>
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
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              {profesionalId ? 'Actualizar' : 'Crear'} Profesional
            </>
          )}
        </button>
      </div>
    </form>
  )
}

