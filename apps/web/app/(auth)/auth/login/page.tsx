/**
 * Página de Login
 * 
 * Permite a los usuarios autenticarse en el sistema.
 * Usa react-hook-form + zod para validación.
 */

'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@repo/supabase/client'
import { useUserStore } from '@/lib/stores/useUserStore'
import { redirectByRole } from '@/lib/auth'
import { LogIn, Mail, Lock, AlertCircle, Loader2, Shield, UserCircle } from 'lucide-react'

// ============================================================================
// VALIDACIÓN CON ZOD
// ============================================================================

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

// ============================================================================
// COMPONENTE
// ============================================================================

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || null

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { setSession } = useUserStore()

  // Determinar el tipo de acceso según el redirect
  const accessType = redirectTo === '/admin' ? 'admin' : redirectTo === '/student' ? 'student' : null

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // ========================================
  // HANDLER DE LOGIN
  // ========================================
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (authError) {
        throw authError
      }

      if (!authData.session) {
        throw new Error('No se pudo iniciar sesión')
      }

      // Guardar sesión en el store
      setSession(authData.session)

      // Obtener rol del usuario
      const role = authData.user.user_metadata?.role

      if (!role) {
        throw new Error('Usuario sin rol asignado. Contacta al administrador.')
      }

      // Validar que el usuario tenga acceso al tipo de panel que intenta acceder
      if (redirectTo === '/admin') {
        // Solo admins y profesionales pueden acceder al panel admin
        if (role !== 'SUPER_ADMIN' && role !== 'CLUB_ADMIN' && role !== 'PROFESSIONAL') {
          throw new Error('No tienes permisos para acceder al panel administrativo. Debes usar el acceso de Alumnos/Clientes.')
        }
      } else if (redirectTo === '/student') {
        // Solo estudiantes pueden acceder al panel de alumnos
        if (role !== 'STUDENT') {
          throw new Error('No tienes permisos para acceder al portal de alumnos. Debes usar el acceso Administrativo.')
        }
      }

      // Redirigir según rol o a la página que intentaba acceder
      // V1: Reglas de redirección consistentes con redirectByRole
      if (redirectTo) {
        // Si hay un redirect específico y el usuario tiene permisos, usarlo
        router.push(redirectTo)
      } else {
        // Redirigir según rol (consistente con redirectByRole en lib/auth.ts)
        switch (role) {
          case 'SUPER_ADMIN':
            router.push('/superadmin')
            break
          case 'CLUB_ADMIN':
            router.push('/admin')
            break
          case 'PROFESSIONAL':
            router.push('/admin/turnos')
            break
          case 'STUDENT':
            router.push('/student')
            break
          default:
            router.push('/')
        }
      }

      router.refresh()
    } catch (err) {
      const error = err as Error
      console.error('Error en login:', error)
      
      // Mensajes de error amigables
      if (error.message?.includes('Invalid login credentials')) {
        setError('Email o contraseña incorrectos')
      } else if (error.message?.includes('Email not confirmed')) {
        setError('Por favor confirma tu email antes de iniciar sesión')
      } else {
        setError(error.message || 'Error al iniciar sesión')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              accessType === 'admin' 
                ? 'bg-primary' 
                : accessType === 'student'
                ? 'bg-green-500'
                : 'bg-primary'
            }`}>
              {accessType === 'admin' ? (
                <Shield className="w-8 h-8 text-white" />
              ) : accessType === 'student' ? (
                <UserCircle className="w-8 h-8 text-white" />
              ) : (
                <LogIn className="w-8 h-8 text-white" />
              )}
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[var(--color-text-main)]">
            {accessType === 'admin' 
              ? 'Acceso Administrativo'
              : accessType === 'student'
              ? 'Acceso Alumnos / Clientes'
              : 'Iniciar Sesión'}
          </h2>
          <p className="mt-2 text-[var(--color-text-muted)]">
            {accessType === 'admin'
              ? 'Para administradores, profesores y personal del club'
              : accessType === 'student'
              ? 'Para alumnos y clientes del club'
              : 'Accede a tu cuenta de gestión'}
          </p>
          {accessType && (
            <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
              accessType === 'admin'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {accessType === 'admin' ? (
                <>
                  <Shield className="w-3 h-3" />
                  Panel Administrativo
                </>
              ) : (
                <>
                  <UserCircle className="w-3 h-3" />
                  Portal de Alumnos
                </>
              )}
            </div>
          )}
        </div>

        {/* Formulario */}
        <div className="bg-[var(--color-surface)] p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Error global */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

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

            {/* Olvidé mi contraseña */}
            <div className="flex items-center justify-end">
              <Link
                href="/auth/recover"
                className="text-sm text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary hover:bg-[var(--color-primary-hover)] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          {/* Registro */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--color-text-muted)]">
              ¿No tienes una cuenta?{' '}
              <Link href="/auth/register" className="text-primary hover:underline font-medium">
                Regístrate aquí
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
