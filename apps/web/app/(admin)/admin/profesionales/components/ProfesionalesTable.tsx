/**
 * Componente: Tabla de Profesionales
 * 
 * Muestra la tabla de profesionales con paginación
 */

'use client'

import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Eye, Edit, ChevronLeft, ChevronRight, User } from 'lucide-react'
import { Badge } from '@repo/ui'

interface Profesional {
  id: string
  nombre: string
  apellido: string
  email: string | null
  telefono: string | null
  especialidad: string | null
  estado: string
}

interface ProfesionalesTableProps {
  profesionales: Profesional[]
  currentPage: number
  totalPages: number
  search: string
  estado: string
}

export function ProfesionalesTable({ 
  profesionales, 
  currentPage, 
  totalPages,
  search,
  estado 
}: ProfesionalesTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  if (profesionales.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <User className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text-main)] mb-2">
          No se encontraron profesionales
        </h3>
        <p className="text-[var(--color-text-muted)] mb-6">
          {search || estado ? 'Intenta ajustar los filtros' : 'Comienza agregando tu primer profesional'}
        </p>
        <Link href="/admin/profesionales/nuevo">
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors">
            Nuevo Profesional
          </button>
        </Link>
      </div>
    )
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'activo':
        return <Badge variant="success">Activo</Badge>
      case 'inactivo':
        return <Badge variant="danger">Inactivo</Badge>
      case 'licencia':
        return <Badge variant="warning">En Licencia</Badge>
      default:
        return <Badge variant="default">{estado}</Badge>
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-[var(--color-border)]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Nombre Completo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Teléfono
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Especialidad
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
          {profesionales.map((profesional) => (
            <tr key={profesional.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-[var(--color-text-main)]">
                  {profesional.nombre} {profesional.apellido}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-[var(--color-text-main)]">
                  {profesional.email || '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-[var(--color-text-muted)]">
                  {profesional.telefono || '-'}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-[var(--color-text-muted)]">
                  {profesional.especialidad || '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getEstadoBadge(profesional.estado)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/admin/profesionales/${profesional.id}`}>
                    <button className="p-2 text-[var(--color-text-muted)] hover:text-primary hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </Link>
                  <Link href={`/admin/profesionales/${profesional.id}/editar`}>
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

