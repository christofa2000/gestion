/**
 * Formulario para crear un nuevo usuario ADMIN para un club existente
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createSupabaseBrowserClient } from '@repo/supabase/client'
import { AlertCircle, Loader2, User, Mail, Lock, Phone, Building2 } from 'lucide-react'
import { Button, Input } from '@repo/ui'

// ============================================================================
// VALIDACIÓN CON ZOD
// ============================================================================

const createUserAdminSchema = z.object({
  clubId: z.string().uuid('Debe seleccionar un club válido'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  telefono: z.string().optional(),
})

type CreateUserAdminFormData = z.infer<typeof createUserAdminSchema>

// ============================================================================
// COMPONENTE
// ============================================================================

interface CreateUserAdminFormProps {
  initialClubId?: string
}

export function CreateUserAdminForm({ initialClubId }: CreateUserAdminFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [clubs, setClubs] = useState<Array<{ id: string; nombre: string }>>([])
  const [loadingClubs, setLoadingClubs] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateUserAdminFormData>({
    resolver: zodResolver(createUserAdminSchema),
    defaultValues: {
      clubId: initialClubId || '',
    },
  })

  // Cargar clubs disponibles
  useEffect(() => {
    const loadClubs = async () => {
      try {
        const supabase = createSupabaseBrowserClient()
        const { data, error } = await supabase
          .from('clubs')
          .select('id, nombre')
          .eq('activa', true)
          .order('nombre')

        if (error) {
          console.error('Error loading clubs:', error)
          return
        }

        setClubs(data || [])
        
        // Si hay un club_id inicial, establecerlo
        if (initialClubId && data?.some(c => c.id === initialClubId)) {
          setValue('clubId', initialClubId)
        }
      } catch (err) {
        console.error('Error loading clubs:', err)
      } finally {
        setLoadingClubs(false)
      }
    }

    loadClubs()
  }, [initialClubId, setValue])

  const onSubmit = async (data: CreateUserAdminFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Llamar a la API route que creará el usuario
      const response = await fetch('/api/superadmin/create-user-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Error al crear el usuario')
      }

      // Éxito
      setSuccess(true)

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push('/superadmin/usuarios')
      }, 2000)

    } catch (err) {
      const error = err as Error
      console.error('Error al crear usuario:', error)
      setError(error.message || 'Error al crear el usuario')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-2">
          ¡Usuario Creado Exitosamente!
        </h2>
        <p className="text-[var(--color-text-muted)] mb-4">
          El usuario administrador ha sido creado y puede hacer login inmediatamente.
        </p>
        <p className="text-sm text-[var(--color-text-muted)]">
          Redirigiendo...
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Error global */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Error al crear el usuario</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Selección de Club */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]">
          <Building2 className="w-5 h-5 text-[var(--color-primary)]" />
          <h2 className="text-xl font-semibold text-[var(--color-text-main)]">
            Seleccionar Club
          </h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
            Club *
          </label>
          {loadingClubs ? (
            <div className="px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)]">
              <p className="text-sm text-[var(--color-text-muted)]">Cargando clubs...</p>
            </div>
          ) : (
            <select
              {...register('clubId')}
              className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-white text-[var(--color-text-main)]"
              disabled={isLoading}
            >
              <option value="">Selecciona un club</option>
              {clubs.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.nombre}
                </option>
              ))}
            </select>
          )}
          {errors.clubId && (
            <p className="mt-1 text-sm text-red-600">{errors.clubId.message}</p>
          )}
          {clubs.length === 0 && !loadingClubs && (
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              No hay clubs disponibles. Crea un club primero desde{' '}
              <a href="/superadmin/clubs/nuevo" className="text-[var(--color-primary)] hover:underline">
                aquí
              </a>
              .
            </p>
          )}
        </div>
      </div>

      {/* Datos del Usuario */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]">
          <User className="w-5 h-5 text-[var(--color-primary)]" />
          <h2 className="text-xl font-semibold text-[var(--color-text-main)]">
            Datos del Usuario Administrador
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
              Nombre *
            </label>
            <Input
              {...register('nombre')}
              placeholder="Juan"
              disabled={isLoading}
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
              Apellido *
            </label>
            <Input
              {...register('apellido')}
              placeholder="Pérez"
              disabled={isLoading}
            />
            {errors.apellido && (
              <p className="mt-1 text-sm text-red-600">{errors.apellido.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
              Email *
            </label>
            <Input
              type="email"
              {...register('email')}
              placeholder="admin@ejemplo.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
              Teléfono
            </label>
            <Input
              {...register('telefono')}
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
              {...register('password')}
              placeholder="Mínimo 6 caracteres"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
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
          disabled={isLoading || clubs.length === 0}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creando...
            </>
          ) : (
            <>
              <User className="w-4 h-4 mr-2" />
              Crear Usuario Admin
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

