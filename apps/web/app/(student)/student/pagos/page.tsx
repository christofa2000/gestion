/**
 * Página: Mis Pagos (Alumno)
 * 
 * Muestra el historial de pagos del alumno
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@repo/supabase/client'
import { DollarSign, Loader2, TrendingUp } from 'lucide-react'

export default function StudentPagosPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [pagos, setPagos] = useState<any[]>([])
  const [totalMes, setTotalMes] = useState(0)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const supabase = createSupabaseBrowserClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/auth/login')
      return
    }

    const studentId = user.user_metadata?.student_id

    if (!studentId) {
      setLoading(false)
      return
    }

    // Obtener pagos
    const { data } = await supabase
      .from('payments')
      .select(`
        *,
        payment_categories:categoria_id(nombre),
        payment_methods:medio_pago_id(nombre)
      `)
      .eq('student_id', studentId)
      .order('fecha_pago', { ascending: false })

    setPagos(data || [])

    // Calcular total del mes actual
    const now = new Date()
    const mesActualInicio = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    
    const pagosMes = data?.filter(p => p.fecha_pago >= mesActualInicio) || []
    const total = pagosMes.reduce((sum, p) => sum + p.monto, 0)
    setTotalMes(total)

    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text-main)]">
          Mis Pagos
        </h1>
        <p className="text-[var(--color-text-muted)] mt-1">
          Historial de pagos y estado de cuenta
        </p>
      </div>

      {/* Stats */}
      <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[var(--color-border)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--color-text-muted)] mb-1">Total Pagado este Mes</p>
            <p className="text-3xl font-bold text-green-600">
              ${totalMes.toLocaleString()}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Lista de pagos */}
      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
          </div>
        ) : pagos.length === 0 ? (
          <div className="p-12 text-center">
            <DollarSign className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-[var(--color-text-main)] mb-2">
              No hay pagos registrados
            </h3>
            <p className="text-[var(--color-text-muted)]">
              Cuando realices pagos, aparecerán aquí
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-[var(--color-border)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">
                    Concepto
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[var(--color-text-muted)] uppercase">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">
                    Medio de Pago
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {pagos.map((pago) => (
                  <tr key={pago.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-main)]">
                      {new Date(pago.fecha_pago).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[var(--color-text-main)]">
                        {pago.payment_categories?.nombre || 'Pago'}
                      </div>
                      {pago.detalle && (
                        <div className="text-xs text-[var(--color-text-muted)]">
                          {pago.detalle}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-bold text-green-600">
                        ${pago.monto.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)]">
                      {pago.payment_methods?.nombre || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
