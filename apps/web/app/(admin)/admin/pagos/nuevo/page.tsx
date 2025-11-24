/**
 * Página: Registrar Nuevo Pago
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

const pagoSchema = z.object({
  student_id: z.string().min(1, 'Debe seleccionar un alumno'),
  categoria_id: z.string().min(1, 'Debe seleccionar una categoría'),
  monto: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  medio_pago_id: z.string().min(1, 'Debe seleccionar un medio de pago'),
  fecha_pago: z.string().min(1, 'La fecha es requerida'),
  detalle: z.string().optional(),
})

type PagoFormData = z.infer<typeof pagoSchema>

export default function NuevoPagoPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clubId, setClubId] = useState<string | null>(null)
  
  const [estudiantes, setEstudiantes] = useState<any[]>([])
  const [categorias, setCategorias] = useState<any[]>([])
  const [mediosPago, setMediosPago] = useState<any[]>([])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PagoFormData>({
    resolver: zodResolver(pagoSchema),
    defaultValues: {
      fecha_pago: new Date().toISOString().split('T')[0],
    },
  })

  const categoriaId = watch('categoria_id')

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

      const [estudiantesRes, categoriasRes, mediosPagoRes] = await Promise.all([
        supabase.from('students').select('id, nombre, apellido').eq('club_id', cId).order('nombre'),
        supabase.from('payment_categories').select('id, nombre, monto_default').eq('club_id', cId),
        supabase.from('payment_methods').select('id, nombre').eq('club_id', cId),
      ])

      setEstudiantes(estudiantesRes.data || [])
      setCategorias(categoriasRes.data || [])
      setMediosPago(mediosPagoRes.data || [])
    }

    loadData()
  }, [router])

  // Auto-llenar monto según categoría
  useEffect(() => {
    if (categoriaId) {
      const cat = categorias.find(c => c.id === categoriaId)
      if (cat?.monto_default) {
        setValue('monto', cat.monto_default)
      }
    }
  }, [categoriaId, categorias, setValue])

  const onSubmit = async (data: PagoFormData) => {
    if (!clubId) return
    
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createSupabaseBrowserClient()

      const { error: insertError } = await supabase
        .from('payments')
        .insert({
          ...data,
          club_id: clubId,
        })

      if (insertError) throw insertError

      router.push('/admin/pagos')
      router.refresh()
    } catch (err) {
      const error = err as Error
      console.error('Error creating payment:', error)
      setError(error.message || 'Error al registrar el pago')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/pagos">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-main)]">
            Registrar Pago
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Registra un nuevo pago o ingreso
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
                Alumno *
              </label>
              <Select {...register('student_id')}>
                <option value="">Seleccionar alumno...</option>
                {estudiantes.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre} {e.apellido}
                  </option>
                ))}
              </Select>
              {errors.student_id && (
                <p className="text-xs text-red-600 mt-1">{errors.student_id.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
                Categoría *
              </label>
              <Select {...register('categoria_id')}>
                <option value="">Seleccionar categoría...</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} {c.monto_default ? `($${c.monto_default})` : ''}
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

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
                Medio de Pago *
              </label>
              <Select {...register('medio_pago_id')}>
                <option value="">Seleccionar medio...</option>
                {mediosPago.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </Select>
              {errors.medio_pago_id && (
                <p className="text-xs text-red-600 mt-1">{errors.medio_pago_id.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
                Fecha de Pago *
              </label>
              <Input type="date" {...register('fecha_pago')} />
              {errors.fecha_pago && (
                <p className="text-xs text-red-600 mt-1">{errors.fecha_pago.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
                Detalle
              </label>
              <Textarea {...register('detalle')} rows={3} placeholder="Notas adicionales..." />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-[var(--color-border)]">
            <Link href="/admin/pagos">
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
                  Registrar Pago
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}



