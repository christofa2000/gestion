/**
 * Página de Registro
 * 
 * Permite a nuevos usuarios registrarse en el sistema.
 * Por defecto asigna rol STUDENT.
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@repo/supabase/client'
import { UserPlus, Mail, Lock, User, AlertCircle, Loader2, CheckCircle } from 'lucide-react'

// ============================================================================
// VALIDACIÓN CON ZOD
// ============================================================================

const registerSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

// ============================================================================
// COMPONENTE
// ============================================================================

export default function RegisterPage() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  // ========================================
  // HANDLER DE REGISTRO
  // ========================================
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // 1. Registrar en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            nombre: data.nombre,
            apellido: data.apellido,
            role: 'STUDENT', // Por defecto, todos los registros son estudiantes
            club_id: null, // Se asignará cuando se una a un club
          },
        },
      })

      if (authError) {
        throw authError
      }

      if (!authData.user) {
        throw new Error('Error al crear usuario')
      }

      // 2. Mostrar mensaje de éxito
      setSuccess(true)

      // 3. Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)

    } catch (err) {
      const error = err as Error
      console.error('Error en registro:', error)
      
      // Mensajes de error amigables
      if (error.message?.includes('already registered')) {
        setError('Este email ya está registrado')
      } else if (error.message?.includes('Invalid email')) {
        setError('Email inválido')
      } else if (error.message?.includes('Password should be')) {
        setError('La contraseña debe tener al menos 6 caracteres')
      } else {
        setError(error.message || 'Error al registrar usuario')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // ========================================
  // MENSAJE DE ÉXITO
  // ========================================
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-[var(--color-surface)] p-8 rounded-lg shadow-lg">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-4">
              ¡Registro Exitoso!
            </h2>
            <p className="text-[var(--color-text-muted)] mb-6">
              Tu cuenta ha sido creada exitosamente.
              {'\n'}
              Revisa tu email para confirmar tu cuenta.
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">
              Redirigiendo al login...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ========================================
  // FORMULARIO
  // ========================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[var(--color-text-main)]">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-[var(--color-text-muted)]">
            Regístrate para comenzar
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-[var(--color-surface)] p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Error global */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
                Nombre
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-5 h-5" />
                <input
                  id="nombre"
                  type="text"
                  {...register('nombre')}
                  className="w-full pl-10 pr-4 py-3 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-[var(--color-text-main)]"
                  placeholder="Juan"
                  disabled={isLoading}
                />
              </div>
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
              )}
            </div>

            {/* Apellido */}
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
                Apellido
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-5 h-5" />
                <input
                  id="apellido"
                  type="text"
                  {...register('apellido')}
                  className="w-full pl-10 pr-4 py-3 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-[var(--color-text-main)]"
                  placeholder="Pérez"
                  disabled={isLoading}
                />
              </div>
              {errors.apellido && (
                <p className="mt-1 text-sm text-red-600">{errors.apellido.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="w-full pl-10 pr-4 py-3 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-[var(--color-text-main)]"
                  placeholder="tu@email.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-5 h-5" />
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="w-full pl-10 pr-4 py-3 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-[var(--color-text-main)]"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-5 h-5" />
                <input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  className="w-full pl-10 pr-4 py-3 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-[var(--color-text-main)]"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary hover:bg-[var(--color-primary-hover)] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Crear Cuenta
                </>
              )}
            </button>
          </form>

          {/* Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--color-text-muted)]">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Link al home */}
        <div className="text-center">
          <Link href="/" className="text-sm text-[var(--color-text-muted)] hover:text-primary">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
