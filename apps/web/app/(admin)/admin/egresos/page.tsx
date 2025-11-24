/**
 * Página: Lista de Egresos
 * 
 * Muestra todos los egresos del club
 */

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient, getUser } from '@repo/supabase/server'
import { canAccessAdmin, getClubId } from '@/lib/auth'
import { TrendingDown, Plus } from 'lucide-react'

interface PageProps {
  searchParams: {
    desde?: string
    hasta?: string
    categoria?: string
  }
}

export default async function EgresosPage({ searchParams }: PageProps) {
  const user = await getUser()
  
  if (!user || !canAccessAdmin(user)) {
    redirect('/auth/login')
  }

  const clubId = getClubId(user)
  
  if (!clubId) {
    return <div className="p-6">Error: No se pudo obtener el club del usuario</div>
  }

  const desde = searchParams.desde || ''
  const hasta = searchParams.hasta || ''
  const categoriaId = searchParams.categoria || ''

  const supabase = await createClient()
  
  let query = supabase
    .from('expenses')
    .select(`
      *,
      expense_categories:categoria_id(id, nombre)
    `)
    .eq('club_id', clubId)
    .order('fecha', { ascending: false })

  if (desde) query = query.gte('fecha', desde)
  if (hasta) query = query.lte('fecha', hasta)
  if (categoriaId) query = query.eq('categoria_id', categoriaId)

  const { data: egresos, error } = await query

  if (error) {
    console.error('Error fetching expenses:', error)
  }

  const total = egresos?.reduce((sum, e) => sum + (e.monto || 0), 0) || 0

  const categorias = await supabase
    .from('expense_categories')
    .select('id, nombre')
    .eq('club_id', clubId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-main)]">
            Egresos
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Gestiona los gastos del club
          </p>
        </div>
        
        <Link href="/admin/egresos/nuevo">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors">
            <Plus className="w-5 h-5" />
            Registrar Egreso
          </button>
        </Link>
      </div>

      <div className="bg-[var(--color-surface)] p-4 rounded-lg border border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--color-text-main)]">
              ${total.toLocaleString()}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">Total Período</p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
        <div className="overflow-x-auto">
          {!egresos || egresos.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-[var(--color-text-muted)]">No hay egresos registrados</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-[var(--color-border)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[var(--color-text-muted)] uppercase">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">
                    Detalle
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {egresos.map((egreso) => (
                  <tr key={egreso.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-main)]">
                      {new Date(egreso.fecha).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)]">
                      {egreso.expense_categories?.nombre || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-bold text-red-600">
                        ${egreso.monto.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text-muted)] max-w-xs truncate">
                      {egreso.detalle || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
