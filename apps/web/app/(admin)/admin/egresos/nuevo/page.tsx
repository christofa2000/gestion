/**
 * Página: Registrar Nuevo Egreso
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createSupabaseBrowserClient } from '@repo/supabase/client'
import { Input, Select, Textarea } from '@repo/ui'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import Link from 'next/link'

const egresoSchema = z.object({
  categoria_id: z.string().min(1, 'Debe seleccionar una categoría'),
  monto: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  fecha: z.string().min(1, 'La fecha es requerida'),
  detalle: z.string().min(1, 'El detalle es requerido'),
})

type EgresoFormData = z.infer<typeof egresoSchema>

export default function NuevoEgresoPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clubId, setClubId] = useState<string | null>(null)
  const [categorias, setCategorias] = useState<any[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EgresoFormData>({
    resolver: zodResolver(egresoSchema),
    defaultValues: {
      fecha: new Date().toISOString().split('T')[0],
    },
  })

  useEffect(() => {
    const loadData = async () => {
      const supabase = createSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      const cId = user.user_metadata?.club_id
      if (!cId) return
      
      setClubId(cId)

      const { data } = await supabase
        .from('expense_categories')
        .select('id, nombre')
        .eq('club_id', cId)

      setCategorias(data || [])
    }

    loadData()
  }, [router])

  const onSubmit = async (data: EgresoFormData) => {
    if (!clubId) return
    
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createSupabaseBrowserClient()

      const { error: insertError } = await supabase
        .from('expenses')
        .insert({
          ...data,
          club_id: clubId,
        })

      if (insertError) throw insertError

      router.push('/admin/egresos')
      router.refresh()
    } catch (err) {
      const error = err as Error
      console.error('Error creating expense:', error)
      setError(error.message || 'Error al registrar el egreso')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/egresos">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-main)]">
            Registrar Egreso
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Registra un nuevo gasto del club
          </p>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
                Categoría *
              </label>
              <Select {...register('categoria_id')}>
                <option value="">Seleccionar categoría...</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </Select>
              {errors.categoria_id && (
                <p className="text-xs text-red-600 mt-1">{errors.categoria_id.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
                Monto *
              </label>
              <Input 
                type="number" 
                step="0.01"
                min="0"
                {...register('monto', { valueAsNumber: true })} 
              />
              {errors.monto && (
                <p className="text-xs text-red-600 mt-1">{errors.monto.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
                Fecha *
              </label>
              <Input type="date" {...register('fecha')} />
              {errors.fecha && (
                <p className="text-xs text-red-600 mt-1">{errors.fecha.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
                Detalle *
              </label>
              <Textarea {...register('detalle')} rows={3} placeholder="Descripción del gasto..." />
              {errors.detalle && (
                <p className="text-xs text-red-600 mt-1">{errors.detalle.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-[var(--color-border)]">
            <Link href="/admin/egresos">
              <button
                type="button"
                className="px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
            </Link>
            
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
                  Registrar Egreso
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}



