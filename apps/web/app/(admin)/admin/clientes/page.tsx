/**
 * Página: Lista de Clientes
 * 
 * Muestra todos los clientes del club con filtros y paginación
 */

import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient, getUser } from '@repo/supabase/server'
import { canAccessAdmin, getClubId } from '@/lib/auth'
import { Plus, Search, Users } from 'lucide-react'
import { ClientsTable } from './components/ClientsTable'
import { ClientsFilters } from './components/ClientsFilters'

interface PageProps {
  searchParams: {
    search?: string
    estado?: string
    page?: string
  }
}

export default async function ClientesPage({ searchParams }: PageProps) {
  // Verificar autenticación y permisos
  const user = await getUser()
  
  if (!user || !canAccessAdmin(user)) {
    redirect('/auth/login')
  }

  const clubId = getClubId(user)
  
  if (!clubId) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: No se pudo obtener el club del usuario</p>
        </div>
      </div>
    )
  }

  // Parámetros de búsqueda
  const search = searchParams.search || ''
  const estado = searchParams.estado || ''
  const page = parseInt(searchParams.page || '1', 10)
  const perPage = 20

  // Consultar clientes
  const supabase = await createClient()
  
  let query = supabase
    .from('students')
    .select('*', { count: 'exact' })
    .eq('club_id', clubId)
    .order('created_at', { ascending: false })

  // Aplicar filtro de búsqueda
  if (search) {
    query = query.or(`nombre.ilike.%${search}%,apellido.ilike.%${search}%,email.ilike.%${search}%,numero_cliente.ilike.%${search}%`)
  }

  // Aplicar filtro de estado
  if (estado && estado !== 'todos') {
    query = query.eq('estado', estado)
  }

  // Paginación
  const start = (page - 1) * perPage
  query = query.range(start, start + perPage - 1)

  const { data: clientes, error, count } = await query

  if (error) {
    console.error('Error fetching clients:', error)
  }

  const totalPages = count ? Math.ceil(count / perPage) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-main)]">
            Clientes
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Gestiona los clientes y alumnos del club
          </p>
        </div>
        
        <Link href="/admin/clientes/nuevo">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors">
            <Plus className="w-5 h-5" />
            Nuevo Cliente
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--color-surface)] p-4 rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-text-main)]">{count || 0}</p>
              <p className="text-sm text-[var(--color-text-muted)]">Total Clientes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <ClientsFilters 
        initialSearch={search}
        initialEstado={estado}
      />

      {/* Tabla */}
      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
        <Suspense fallback={<div className="p-6">Cargando...</div>}>
          <ClientsTable 
            clientes={clientes || []}
            currentPage={page}
            totalPages={totalPages}
            search={search}
            estado={estado}
          />
        </Suspense>
      </div>
    </div>
  )
}
