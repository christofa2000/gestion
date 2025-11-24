/**
 * Página: Lista de Usuarios Admin (SUPER_ADMIN)
 * 
 * Solo SUPER_ADMIN puede ver y gestionar usuarios ADMIN
 */

import { redirect } from 'next/navigation'
import { createClient, getUser } from '@repo/supabase/server'
import { isSuperAdmin } from '@/lib/auth'
import Link from 'next/link'
import { Plus, Shield } from 'lucide-react'
import { Button } from '@repo/ui'

interface PageProps {
  searchParams: {
    search?: string
    role?: string
    page?: string
  }
}

export default async function SuperAdminUsuariosPage({ searchParams }: PageProps) {
  const user = await getUser()
  
  if (!user || !isSuperAdmin(user)) {
    redirect('/auth/login')
  }

  const supabase = await createClient()
  
  // Parámetros de búsqueda
  const search = searchParams.search || ''
  const role = searchParams.role || ''
  const page = parseInt(searchParams.page || '1', 10)
  const perPage = 20

  // Consultar TODOS los usuarios ADMIN (CLUB_ADMIN y SUPER_ADMIN)
  // Nota: No filtramos por club_id porque SUPER_ADMIN ve todo
  let query = supabase
    .from('users')
    .select(`
      *,
      clubs:club_id(id, nombre)
    `, { count: 'exact' })
    .in('role', ['CLUB_ADMIN', 'SUPER_ADMIN'])
    .order('created_at', { ascending: false })

  // Aplicar filtro de búsqueda
  if (search) {
    query = query.or(`nombre.ilike.%${search}%,apellido.ilike.%${search}%,email.ilike.%${search}%`)
  }

  // Aplicar filtro de rol
  if (role && role !== 'todos') {
    query = query.eq('role', role)
  }

  // Paginación
  const start = (page - 1) * perPage
  query = query.range(start, start + perPage - 1)

  const { data: usuarios, error, count } = await query

  if (error) {
    console.error('Error fetching users:', error)
  }

  const totalPages = count ? Math.ceil(count / perPage) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-main)]">
            Usuarios Admin
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Crear y gestionar usuarios ADMIN de todos los clubs
          </p>
        </div>
        
        <Link href="/superadmin/usuarios/nuevo">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Crear Admin
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--color-surface)] p-4 rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-text-main)]">{count || 0}</p>
              <p className="text-sm text-[var(--color-text-muted)]">Total Admins</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Usuarios */}
      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
        <div className="p-6">
          {usuarios && usuarios.length > 0 ? (
            <div className="space-y-4">
              {usuarios.map((usuario: any) => (
                <div
                  key={usuario.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-[var(--color-border)]"
                >
                  <div>
                    <p className="font-medium text-[var(--color-text-main)]">
                      {usuario.nombre} {usuario.apellido}
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {usuario.email}
                    </p>
                    {usuario.clubs && (
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">
                        Club: {usuario.clubs.nombre}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        usuario.role === 'SUPER_ADMIN'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {usuario.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Club Admin'}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        usuario.activo
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--color-text-muted)] text-center py-8">
              No hay usuarios admin registrados
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
              href={`/superadmin/usuarios?page=${p}`}
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

