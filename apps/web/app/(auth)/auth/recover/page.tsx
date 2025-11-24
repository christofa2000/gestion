/**
 * Página de Recuperación de Contraseña
 * 
 * Permite a los usuarios recuperar su contraseña mediante email.
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@repo/supabase/client'
import { Mail, AlertCircle, Loader2, CheckCircle, ArrowLeft } from 'lucide-react'

// ============================================================================
// VALIDACIÓN CON ZOD
// ============================================================================

const recoverSchema = z.object({
  email: z.string().email('Email inválido'),
})

type RecoverFormData = z.infer<typeof recoverSchema>

// ============================================================================
// COMPONENTE
// ============================================================================

export default function RecoverPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoverFormData>({
    resolver: zodResolver(recoverSchema),
  })

  // ========================================
  // HANDLER DE RECUPERACIÓN
  // ========================================
  const onSubmit = async (data: RecoverFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error: recoverError } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (recoverError) {
        throw recoverError
      }

      setSuccess(true)
    } catch (err) {
      const error = err as Error
      console.error('Error en recuperación:', error)
      setError(error.message || 'Error al enviar email de recuperación')
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
              ¡Email Enviado!
            </h2>
            <p className="text-[var(--color-text-muted)] mb-6">
              Hemos enviado un email con instrucciones para recuperar tu contraseña.
              {'\n\n'}
              Por favor revisa tu bandeja de entrada y sigue los pasos indicados.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ========================================
  // FORMULARIO
  // ========================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[var(--color-text-main)]">
            Recuperar Contraseña
          </h2>
          <p className="mt-2 text-[var(--color-text-muted)]">
            Ingresa tu email y te enviaremos instrucciones
          </p>
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

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary hover:bg-[var(--color-primary-hover)] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Enviar Email
                </>
              )}
            </button>
          </form>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al login
            </Link>
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
