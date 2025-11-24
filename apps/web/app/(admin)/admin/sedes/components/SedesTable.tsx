/**
 * Componente: Tabla de Sedes
 * 
 * Muestra la tabla de sedes con paginación
 */

'use client'

import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Eye, Edit, ChevronLeft, ChevronRight, Building2 } from 'lucide-react'
import { Badge } from '@repo/ui'

interface Sede {
  id: string
  nombre: string
  telefono: string | null
  email: string | null
  direccion: string | null
  activa: boolean
}

interface SedesTableProps {
  sedes: Sede[]
  currentPage: number
  totalPages: number
  search: string
  activa: string
}

export function SedesTable({ 
  sedes, 
  currentPage, 
  totalPages,
  search,
  activa 
}: SedesTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  if (sedes.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <Building2 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text-main)] mb-2">
          No se encontraron sedes
        </h3>
        <p className="text-[var(--color-text-muted)] mb-6">
          {search || activa ? 'Intenta ajustar los filtros' : 'Comienza agregando tu primera sede'}
        </p>
        <Link href="/admin/sedes/nueva">
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors">
            Nueva Sede
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-[var(--color-border)]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Teléfono
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Dirección
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-[var(--color-border)]">
          {sedes.map((sede) => (
            <tr key={sede.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-[var(--color-text-main)]">
                  {sede.nombre}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-[var(--color-text-muted)]">
                  {sede.telefono || '-'}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-[var(--color-text-main)]">
                  {sede.email || '-'}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-[var(--color-text-muted)] max-w-xs truncate">
                  {sede.direccion || '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={sede.activa ? 'success' : 'danger'}>
                  {sede.activa ? 'Activa' : 'Inactiva'}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/admin/sedes/${sede.id}`}>
                    <button className="p-2 text-[var(--color-text-muted)] hover:text-primary hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </Link>
                  <Link href={`/admin/sedes/${sede.id}/editar`}>
                    <button className="p-2 text-[var(--color-text-muted)] hover:text-primary hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-[var(--color-border)] flex items-center justify-between">
          <div className="text-sm text-[var(--color-text-muted)]">
            Página {currentPage} de {totalPages}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => navigateToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-[var(--color-border)] rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => navigateToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-[var(--color-border)] rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

