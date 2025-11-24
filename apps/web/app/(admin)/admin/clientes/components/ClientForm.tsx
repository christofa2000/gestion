/**
 * Componente: Formulario de Cliente
 * 
 * Formulario para crear/editar clientes con validación
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createSupabaseBrowserClient } from '@repo/supabase/client'
import { Input, Select, Textarea } from '@repo/ui'
import { Loader2, Save } from 'lucide-react'

// Schema de validación
const clientSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  apodo: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email('Email inválido').or(z.literal('')).optional(),
  contacto_emergencia: z.string().optional(),
  telefono_emergencia: z.string().optional(),
  fecha_nacimiento: z.string().optional(),
  genero: z.enum(['masculino', 'femenino', 'otro', 'prefiero_no_decir', '']).optional(),
  tipo_documento: z.string().optional(),
  numero_documento: z.string().optional(),
  ocupacion: z.string().optional(),
  obra_social: z.string().optional(),
  direccion: z.string().optional(),
  codigo_postal: z.string().optional(),
  ciudad: z.string().optional(),
  provincia: z.string().optional(),
  numero_cliente: z.string().optional(),
  estado: z.enum(['activo', 'inactivo', 'pendiente', 'rechazado']),
  observaciones: z.string().optional(),
}).refine((data) => data.telefono || data.email, {
  message: 'Debe proporcionar al menos un teléfono o email',
  path: ['telefono'],
})

type ClientFormData = z.infer<typeof clientSchema>

interface ClientFormProps {
  clubId: string
  initialData?: Partial<ClientFormData>
  clienteId?: string
}

export function ClientForm({ clubId, initialData, clienteId }: ClientFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      estado: 'activo',
      genero: '',
      tipo_documento: 'DNI',
      ...initialData,
    },
  })

  const onSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createSupabaseBrowserClient()
      
      // Limpiar campos vacíos
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== '' && value !== undefined)
      )

      if (clienteId) {
        // Actualizar cliente existente
        const { error: updateError } = await supabase
          .from('students')
          .update({
            ...cleanData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', clienteId)
          .eq('club_id', clubId)

        if (updateError) throw updateError

        router.push(`/admin/clientes/${clienteId}`)
        router.refresh()
      } else {
        // Crear nuevo cliente
        const { data: newClient, error: insertError } = await supabase
          .from('students')
          .insert({
            ...cleanData,
            club_id: clubId,
          })
          .select()
          .single()

        if (insertError) throw insertError

        router.push(`/admin/clientes/${newClient.id}`)
        router.refresh()
      }
    } catch (err) {
      const error = err as Error
      console.error('Error saving client:', error)
      setError(error.message || 'Error al guardar el cliente')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Error global */}
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

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Apodo
            </label>
            <Input {...register('apodo')} placeholder="Opcional" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Número de Cliente
            </label>
            <Input {...register('numero_cliente')} placeholder="Autogenerado si se deja vacío" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Fecha de Nacimiento
            </label>
            <Input type="date" {...register('fecha_nacimiento')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Género
            </label>
            <Select {...register('genero')}>
              <option value="">Seleccionar...</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
              <option value="prefiero_no_decir">Prefiero no decir</option>
            </Select>
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
              Teléfono *
            </label>
            <Input type="tel" {...register('telefono')} placeholder="+54 11 1234-5678" />
            {errors.telefono && (
              <p className="text-xs text-red-600 mt-1">{errors.telefono.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Email *
            </label>
            <Input type="email" {...register('email')} />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Contacto de Emergencia
            </label>
            <Input {...register('contacto_emergencia')} placeholder="Nombre" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Teléfono de Emergencia
            </label>
            <Input type="tel" {...register('telefono_emergencia')} />
          </div>
        </div>
      </div>

      {/* Documento */}
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-text-main)] mb-4">
          Documentación
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Tipo de Documento
            </label>
            <Input {...register('tipo_documento')} placeholder="DNI, Pasaporte, etc." />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Número de Documento
            </label>
            <Input {...register('numero_documento')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Ocupación
            </label>
            <Input {...register('ocupacion')} placeholder="Estudiante, Empleado, etc." />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Obra Social
            </label>
            <Input {...register('obra_social')} />
          </div>
        </div>
      </div>

      {/* Dirección */}
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-text-main)] mb-4">
          Dirección
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Dirección
            </label>
            <Input {...register('direccion')} placeholder="Calle y número" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Código Postal
            </label>
            <Input {...register('codigo_postal')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Ciudad
            </label>
            <Input {...register('ciudad')} />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Provincia
            </label>
            <Input {...register('provincia')} />
          </div>
        </div>
      </div>

      {/* Estado y observaciones */}
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-text-main)] mb-4">
          Estado y Observaciones
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Estado
            </label>
            <Select {...register('estado')}>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="pendiente">Pendiente</option>
              <option value="rechazado">Rechazado</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
              Observaciones
            </label>
            <Textarea {...register('observaciones')} rows={4} placeholder="Notas adicionales..." />
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
              {clienteId ? 'Actualizar' : 'Crear'} Cliente
            </>
          )}
        </button>
      </div>
    </form>
  )
}
