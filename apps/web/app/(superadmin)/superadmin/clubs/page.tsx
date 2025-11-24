/**
 * Página: Lista de todos los Clubs (SUPER_ADMIN)
 * 
 * Muestra todos los clubs del sistema sin filtrado por club_id
 */

import { redirect } from 'next/navigation'
import { createClient, getUser } from '@repo/supabase/server'
import { isSuperAdmin } from '@/lib/auth'
import Link from 'next/link'
import { Plus, Building2 } from 'lucide-react'
import { Button } from '@repo/ui'

interface PageProps {
  searchParams: {
    search?: string
    activa?: string
    page?: string
  }
}

export default async function SuperAdminClubsPage({ searchParams }: PageProps) {
  const user = await getUser()
  
  if (!user || !isSuperAdmin(user)) {
    redirect('/auth/login')
  }

  const supabase = await createClient()
  
  // Parámetros de búsqueda
  const search = searchParams.search || ''
  const activa = searchParams.activa || ''
  const page = parseInt(searchParams.page || '1', 10)
  const perPage = 20

  // Consultar TODOS los clubs (sin filtro por club_id)
  let query = supabase
    .from('clubs')
    .select('*', { count: 'exact' })
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

  const { data: clubs, error, count } = await query

  if (error) {
    console.error('Error fetching clubs:', error)
  }

  const totalPages = count ? Math.ceil(count / perPage) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-main)]">
            Todos los Clubs
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Gestión global de todos los clubs del sistema
          </p>
        </div>
        
        <Link href="/superadmin/clubs/nuevo">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Club
          </Button>
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
              <p className="text-sm text-[var(--color-text-muted)]">Total Clubs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Clubs */}
      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
        <div className="p-6">
          {clubs && clubs.length > 0 ? (
            <div className="space-y-4">
              {clubs.map((club) => (
                <Link
                  key={club.id}
                  href={`/superadmin/clubs/${club.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-bg)] transition-colors"
                >
                  <div>
                    <p className="font-medium text-[var(--color-text-main)]">{club.nombre}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {club.email} • {club.telefono}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                      Creado: {new Date(club.created_at).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        club.activa
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {club.activa ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-[var(--color-text-muted)] text-center py-8">
              No hay clubs registrados
            </p>
          )}
        </div>
      </div>

      {/* Paginación simple */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/superadmin/clubs?page=${p}`}
              className={`px-4 py-2 rounded-lg ${
                p === page
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-main)] border border-[var(--color-border)]'
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

