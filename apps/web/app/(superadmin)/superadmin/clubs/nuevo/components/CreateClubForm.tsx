/**
 * Formulario para crear un nuevo club con su usuario ADMIN
 * 
 * Crea en un solo paso:
 * 1. El club en la tabla clubs
 * 2. El usuario en Supabase Auth
 * 3. El registro en la tabla users vinculado al club
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClubWithAdmin } from '../../actions'
import { AlertCircle, Loader2, Building2, User, Mail, Lock, Phone, MapPin } from 'lucide-react'
import { Button, Input } from '@repo/ui'

// ============================================================================
// VALIDACIÓN CON ZOD
// ============================================================================

const createClubSchema = z.object({
  // Datos del Club
  clubNombre: z.string().min(2, 'El nombre del club debe tener al menos 2 caracteres'),
  clubEmail: z.string().email('Email inválido').optional().or(z.literal('')),
  clubTelefono: z.string().optional(),
  clubDireccion: z.string().optional(),
  clubTheme: z.enum(['theme-sky', 'theme-sport', 'theme-neutral']).default('theme-sky'),
  
  // Datos del Usuario Admin
  adminNombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  adminApellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  adminEmail: z.string().email('Email inválido'),
  adminPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  adminTelefono: z.string().optional(),
})

type CreateClubFormData = z.infer<typeof createClubSchema>

// ============================================================================
// COMPONENTE
// ============================================================================

export function CreateClubForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [createdClubId, setCreatedClubId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateClubFormData>({
    resolver: zodResolver(createClubSchema),
    defaultValues: {
      clubTheme: 'theme-sky',
    },
  })

  const onSubmit = async (data: CreateClubFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Usar server action para crear el club y usuario
      const result = await createClubWithAdmin({
        clubNombre: data.clubNombre,
        clubEmail: data.clubEmail || undefined,
        clubTelefono: data.clubTelefono || undefined,
        clubDireccion: data.clubDireccion || undefined,
        clubTheme: data.clubTheme,
        adminNombre: data.adminNombre,
        adminApellido: data.adminApellido,
        adminEmail: data.adminEmail,
        adminPassword: data.adminPassword,
        adminTelefono: data.adminTelefono || undefined,
      })

      if (result.error) {
        throw new Error(result.error)
      }

      if (!result.data) {
        throw new Error('No se recibieron datos del servidor')
      }

      // Éxito
      setSuccess(true)
      setCreatedClubId(result.data.club.id)

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push(`/superadmin/clubs/${result.data.club.id}`)
      }, 2000)

    } catch (err) {
      const error = err as Error
      console.error('Error al crear club:', error)
      setError(error.message || 'Error al crear el club y usuario')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-2">
          ¡Club Creado Exitosamente!
        </h2>
        <p className="text-[var(--color-text-muted)] mb-4">
          El club y su usuario administrador han sido creados correctamente.
        </p>
        <p className="text-sm text-[var(--color-text-muted)]">
          Redirigiendo...
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Error global */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Error al crear el club</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Sección: Datos del Club */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]">
          <Building2 className="w-5 h-5 text-[var(--color-primary)]" />
          <h2 className="text-xl font-semibold text-[var(--color-text-main)]">
            Datos del Club
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
              Nombre del Club *
            </label>
            <Input
              {...register('clubNombre')}
              placeholder="Ej: Club de Tenis Los Pinos"
              disabled={isLoading}
            />
            {errors.clubNombre && (
              <p className="mt-1 text-sm text-red-600">{errors.clubNombre.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
              Email del Club
            </label>
            <Input
              type="email"
              {...register('clubEmail')}
              placeholder="club@ejemplo.com"
              disabled={isLoading}
            />
            {errors.clubEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.clubEmail.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
              Teléfono
            </label>
            <Input
              {...register('clubTelefono')}
              placeholder="+54 11 1234-5678"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
              Tema
            </label>
            <select
              {...register('clubTheme')}
              className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-white text-[var(--color-text-main)]"
              disabled={isLoading}
            >
              <option value="theme-sky">Sky (Azul)</option>
              <option value="theme-sport">Sport (Naranja)</option>
              <option value="theme-neutral">Neutral (Gris)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
              Dirección
            </label>
            <Input
              {...register('clubDireccion')}
              placeholder="Calle, número, ciudad"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Sección: Usuario Administrador */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]">
          <User className="w-5 h-5 text-[var(--color-primary)]" />
          <h2 className="text-xl font-semibold text-[var(--color-text-main)]">
            Usuario Administrador
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
              Nombre *
            </label>
            <Input
              {...register('adminNombre')}
              placeholder="Juan"
              disabled={isLoading}
            />
            {errors.adminNombre && (
              <p className="mt-1 text-sm text-red-600">{errors.adminNombre.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
              Apellido *
            </label>
            <Input
              {...register('adminApellido')}
              placeholder="Pérez"
              disabled={isLoading}
            />
            {errors.adminApellido && (
              <p className="mt-1 text-sm text-red-600">{errors.adminApellido.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
              Email *
            </label>
            <Input
              type="email"
              {...register('adminEmail')}
              placeholder="admin@ejemplo.com"
              disabled={isLoading}
            />
            {errors.adminEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.adminEmail.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
              Teléfono
            </label>
            <Input
              {...register('adminTelefono')}
              placeholder="+54 11 1234-5678"
              disabled={isLoading}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
              Contraseña *
            </label>
            <Input
              type="password"
              {...register('adminPassword')}
              placeholder="Mínimo 6 caracteres"
              disabled={isLoading}
            />
            {errors.adminPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.adminPassword.message}</p>
            )}
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Esta será la contraseña inicial del administrador. Podrá cambiarla después.
            </p>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-4 pt-4 border-t border-[var(--color-border)]">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creando...
            </>
          ) : (
            <>
              <Building2 className="w-4 h-4 mr-2" />
              Crear Club y Usuario Admin
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

