/**
 * Componente: Tabla de Pagos
 */

'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, DollarSign } from 'lucide-react'

interface Pago {
  id: string
  fecha_pago: string
  monto: number
  detalle: string | null
  students: { id: string; nombre: string; apellido: string } | null
  payment_categories: { id: string; nombre: string } | null
  payment_methods: { id: string; nombre: string } | null
}

interface PagosTableProps {
  pagos: Pago[]
  currentPage: number
  totalPages: number
}

export function PagosTable({ pagos, currentPage, totalPages }: PagosTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  if (pagos.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <DollarSign className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text-main)] mb-2">
          No se encontraron pagos
        </h3>
        <p className="text-[var(--color-text-muted)]">
          Registra el primer pago
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-[var(--color-border)]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">
              Fecha
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">
              Alumno
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">
              Categoría
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[var(--color-text-muted)] uppercase">
              Monto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">
              Medio de Pago
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">
              Detalle
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
                  {pago.students ? `${pago.students.nombre} ${pago.students.apellido}` : '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)]">
                {pago.payment_categories?.nombre || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <span className="text-sm font-bold text-green-600">
                  ${pago.monto.toLocaleString()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)]">
                {pago.payment_methods?.nombre || '-'}
              </td>
              <td className="px-6 py-4 text-sm text-[var(--color-text-muted)] max-w-xs truncate">
                {pago.detalle || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-[var(--color-border)] flex items-center justify-between">
          <div className="text-sm text-[var(--color-text-muted)]">
            Página {currentPage} de {totalPages}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => navigateToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-[var(--color-border)] rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => navigateToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-[var(--color-border)] rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}




