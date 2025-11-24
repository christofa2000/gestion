/**
 * Página: Lista de Sedes
 * 
 * Muestra todas las sedes del club con filtros y paginación
 */

import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient, getUser } from '@repo/supabase/server'
import { canAccessAdmin, getClubId } from '@/lib/auth'
import { Plus, Building2 } from 'lucide-react'
import { SedesTable } from './components/SedesTable'
import { SedesFilters } from './components/SedesFilters'

interface PageProps {
  searchParams: {
    search?: string
    activa?: string
    page?: string
  }
}

export default async function SedesPage({ searchParams }: PageProps) {
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
  const activa = searchParams.activa || ''
  const page = parseInt(searchParams.page || '1', 10)
  const perPage = 20

  // Consultar sedes (clubs)
  // Nota: En este caso, cada club tiene una sola sede (su propia información)
  // Si en el futuro se necesita multi-sede, usar la tabla branches
  const supabase = await createClient()
  
  let query = supabase
    .from('clubs')
    .select('*', { count: 'exact' })
    .eq('id', clubId) // Solo la sede del club actual
    .order('created_at', { ascending: false })

  // Aplicar filtro de búsqueda
  if (search) {
    query = query.or(`nombre.ilike.%${search}%,email.ilike.%${search}%,telefono.ilike.%${search}%,direccion.ilike.%${search}%`)
  }

  // Aplicar filtro de estado activa
  if (activa && activa !== 'todos') {
    query = query.eq('activa', activa === 'activa')
  }

  // Paginación
  const start = (page - 1) * perPage
  query = query.range(start, start + perPage - 1)

  const { data: sedes, error, count } = await query

  if (error) {
    console.error('Error fetching sedes:', error)
  }

  const totalPages = count ? Math.ceil(count / perPage) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-main)]">
            Sedes
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Gestiona las sedes del club
          </p>
        </div>
        
        <Link href="/admin/sedes/nueva">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors">
            <Plus className="w-5 h-5" />
            Nueva Sede
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--color-surface)] p-4 rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-text-main)]">{count || 0}</p>
              <p className="text-sm text-[var(--color-text-muted)]">Total Sedes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <SedesFilters 
        initialSearch={search}
        initialActiva={activa}
      />

      {/* Tabla */}
      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
        <Suspense fallback={<div className="p-6">Cargando...</div>}>
          <SedesTable 
            sedes={sedes || []}
            currentPage={page}
            totalPages={totalPages}
            search={search}
            activa={activa}
          />
        </Suspense>
      </div>
    </div>
  )
}

