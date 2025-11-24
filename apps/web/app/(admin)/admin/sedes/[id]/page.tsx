/**
 * Página: Detalle de Sede
 * 
 * Muestra toda la información de la sede
 */

import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient, getUser } from '@repo/supabase/server'
import { canAccessAdmin, getClubId } from '@/lib/auth'
import { ArrowLeft, Edit, Phone, Mail, MapPin, Palette, Building2 } from 'lucide-react'
import { Badge } from '@repo/ui'

interface PageProps {
  params: {
    id: string
  }
}

export default async function SedeDetallePage({ params }: PageProps) {
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

  // Obtener datos de la sede
  const supabase = await createClient()
  
  const { data: sede, error } = await supabase
    .from('clubs')
    .select('*')
    .eq('id', params.id)
    .eq('id', clubId) // Asegurar que solo se vea la sede del club actual
    .single()

  if (error || !sede) {
    notFound()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/sedes">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-main)]">
              {sede.nombre}
            </h1>
            <p className="text-[var(--color-text-muted)] mt-1">
              Información completa de la sede
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant={sede.activa ? 'success' : 'danger'}>
            {sede.activa ? 'Activa' : 'Inactiva'}
          </Badge>
          <Link href={`/admin/sedes/${sede.id}/editar`}>
            <button className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-gray-50 transition-colors">
              <Edit className="w-4 h-4" />
              Editar
            </button>
          </Link>
        </div>
      </div>

      {/* Grid de información */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Datos básicos */}
          <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
            <h2 className="text-lg font-semibold text-[var(--color-text-main)] mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Información Básica
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Nombre" value={sede.nombre} />
              <InfoItem label="Tema" value={sede.theme?.replace('theme-', '') || 'sky'} />
              <InfoItem label="Estado" value={sede.activa ? 'Activa' : 'Inactiva'} />
            </div>
          </div>

          {/* Contacto */}
          <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
            <h2 className="text-lg font-semibold text-[var(--color-text-main)] mb-4">
              Información de Contacto
            </h2>
            <div className="space-y-3">
              {sede.telefono && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[var(--color-text-muted)]" />
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">Teléfono</p>
                    <a href={`tel:${sede.telefono}`} className="text-sm font-medium text-primary hover:underline">
                      {sede.telefono}
                    </a>
                  </div>
                </div>
              )}
              
              {sede.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[var(--color-text-muted)]" />
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">Email</p>
                    <a href={`mailto:${sede.email}`} className="text-sm font-medium text-primary hover:underline">
                      {sede.email}
                    </a>
                  </div>
                </div>
              )}

              {sede.direccion && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[var(--color-text-muted)]" />
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">Dirección</p>
                    <p className="text-sm font-medium text-[var(--color-text-main)]">
                      {sede.direccion}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Configuración */}
          <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
            <h2 className="text-lg font-semibold text-[var(--color-text-main)] mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Configuración
            </h2>
            <div className="space-y-3">
              <InfoItem label="Tema visual" value={sede.theme?.replace('theme-', '') || 'sky'} />
              <InfoItem label="Fecha de creación" value={sede.created_at ? new Date(sede.created_at).toLocaleDateString('es-AR') : null} />
              {sede.updated_at && (
                <InfoItem label="Última actualización" value={new Date(sede.updated_at).toLocaleDateString('es-AR')} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
      <p className="text-sm font-medium text-[var(--color-text-main)] capitalize">
        {value || '-'}
      </p>
    </div>
  )
}

