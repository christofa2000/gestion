/**
 * Componente: Tabla de Clientes
 * 
 * Muestra la tabla de clientes con paginación
 */

'use client'

import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Eye, Edit, ChevronLeft, ChevronRight } from 'lucide-react'
import { ClientStatusBadge } from '@repo/ui'
import { deleteStudent } from '../actions'
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog'

interface Cliente {
  id: string
  nombre: string
  apellido: string
  apodo: string | null
  telefono: string | null
  email: string | null
  numero_cliente: string | null
  estado: string
}

interface ClientsTableProps {
  clientes: Cliente[]
  currentPage: number
  totalPages: number
  search: string
  estado: string
}

export function ClientsTable({ 
  clientes, 
  currentPage, 
  totalPages,
  search,
  estado 
}: ClientsTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  if (clientes.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <Edit className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text-main)] mb-2">
          No se encontraron clientes
        </h3>
        <p className="text-[var(--color-text-muted)] mb-6">
          {search || estado ? 'Intenta ajustar los filtros' : 'Comienza agregando tu primer cliente'}
        </p>
        <Link href="/admin/clientes/nuevo">
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors">
            Nuevo Cliente
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
              Nombre Completo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Apodo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Contacto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Nº Cliente
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
          {clientes.map((cliente) => (
            <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-[var(--color-text-main)]">
                  {cliente.nombre} {cliente.apellido}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-[var(--color-text-muted)]">
                  {cliente.apodo || '-'}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-[var(--color-text-main)]">
                  {cliente.telefono || cliente.email || '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-mono text-[var(--color-text-muted)]">
                  {cliente.numero_cliente || '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <ClientStatusBadge status={cliente.estado as any} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/admin/clientes/${cliente.id}`}>
                    <button className="p-2 text-[var(--color-text-muted)] hover:text-primary hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </Link>
                  <Link href={`/admin/clientes/${cliente.id}/editar`}>
                    <button className="p-2 text-[var(--color-text-muted)] hover:text-primary hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </Link>
                  <DeleteConfirmDialog
                    title="Eliminar Cliente"
                    message="¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer."
                    itemName={`${cliente.nombre} ${cliente.apellido}`}
                    onConfirm={async () => {
                      const result = await deleteStudent(cliente.id)
                      if (result.error) {
                        throw new Error(result.error)
                      }
                      // Redirigir a la misma página para refrescar sin loops
                      router.push(pathname)
                    }}
                  />
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




