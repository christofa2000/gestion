/**
 * Página: Detalle de Club (SUPER_ADMIN)
 * 
 * Muestra la información completa de un club y su usuario admin asociado
 */

import { redirect } from 'next/navigation'
import { createClient, getUser } from '@repo/supabase/server'
import { isSuperAdmin } from '@/lib/auth'
import Link from 'next/link'
import { ArrowLeft, Building2, User, Mail, Phone, MapPin, Shield } from 'lucide-react'
import { Button } from '@repo/ui'

interface PageProps {
  params: {
    id: string
  }
}

export default async function ClubDetallePage({ params }: PageProps) {
  const user = await getUser()
  
  if (!user || !isSuperAdmin(user)) {
    redirect('/auth/login')
  }

  const supabase = await createClient()
  
  // Obtener el club
  const { data: club, error: clubError } = await supabase
    .from('clubs')
    .select('*')
    .eq('id', params.id)
    .single()

  if (clubError || !club) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: No se pudo cargar el club</p>
        </div>
      </div>
    )
  }

  // Obtener el usuario admin del club
  const { data: adminUser } = await supabase
    .from('users')
    .select('*')
    .eq('club_id', params.id)
    .eq('role', 'CLUB_ADMIN')
    .limit(1)
    .single()

  // Obtener estadísticas del club
  const [
    { count: totalStudents },
    { count: totalProfessionals },
    { count: totalBranches },
    { data: paymentsData }
  ] = await Promise.all([
    supabase.from('students').select('*', { count: 'exact', head: true }).eq('club_id', params.id),
    supabase.from('professionals').select('*', { count: 'exact', head: true }).eq('club_id', params.id),
    supabase.from('branches').select('*', { count: 'exact', head: true }).eq('club_id', params.id),
    supabase.from('payments')
      .select('monto')
      .eq('club_id', params.id)
      .gte('fecha_pago', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
  ])

  const ingresosMes = paymentsData?.reduce((sum, p) => sum + (p.monto || 0), 0) || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/superadmin/clubs">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[var(--color-text-main)]">
            {club.nombre}
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Información completa del club
          </p>
        </div>
        <Link href={`/superadmin/clubs/${params.id}/editar`}>
          <Button variant="outline">Editar</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)] mb-1">Alumnos</p>
              <p className="text-3xl font-bold text-[var(--color-text-main)]">{totalStudents || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)] mb-1">Profesionales</p>
              <p className="text-3xl font-bold text-[var(--color-text-main)]">{totalProfessionals || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)] mb-1">Sedes</p>
              <p className="text-3xl font-bold text-[var(--color-text-main)]">{totalBranches || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)] mb-1">Ingresos del Mes</p>
              <p className="text-3xl font-bold text-[var(--color-text-main)]">
                ${ingresosMes.toLocaleString('es-AR')}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Phone className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Información del Club */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-[var(--color-primary)]" />
            <h2 className="text-xl font-semibold text-[var(--color-text-main)]">
              Información del Club
            </h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">Nombre</p>
              <p className="font-medium text-[var(--color-text-main)]">{club.nombre}</p>
            </div>
            {club.email && (
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Email</p>
                <p className="font-medium text-[var(--color-text-main)]">{club.email}</p>
              </div>
            )}
            {club.telefono && (
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Teléfono</p>
                <p className="font-medium text-[var(--color-text-main)]">{club.telefono}</p>
              </div>
            )}
            {club.direccion && (
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Dirección</p>
                <p className="font-medium text-[var(--color-text-main)]">{club.direccion}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">Tema</p>
              <p className="font-medium text-[var(--color-text-main)]">{club.theme}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">Estado</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  club.activa
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {club.activa ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">Creado</p>
              <p className="font-medium text-[var(--color-text-main)]">
                {new Date(club.created_at).toLocaleDateString('es-AR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Información del Usuario Admin */}
        <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-[var(--color-primary)]" />
            <h2 className="text-xl font-semibold text-[var(--color-text-main)]">
              Usuario Administrador
            </h2>
          </div>
          {adminUser ? (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Nombre Completo</p>
                <p className="font-medium text-[var(--color-text-main)]">
                  {adminUser.nombre} {adminUser.apellido}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Email</p>
                <p className="font-medium text-[var(--color-text-main)]">{adminUser.email}</p>
              </div>
              {adminUser.telefono && (
                <div>
                  <p className="text-sm text-[var(--color-text-muted)]">Teléfono</p>
                  <p className="font-medium text-[var(--color-text-main)]">{adminUser.telefono}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Rol</p>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  {adminUser.role}
                </span>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Estado</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    adminUser.activo
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {adminUser.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[var(--color-text-muted)]">
                No se encontró usuario administrador para este club
              </p>
              <Link href={`/superadmin/usuarios/nuevo?club_id=${params.id}`}>
                <Button className="mt-4">Crear Usuario Admin</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

