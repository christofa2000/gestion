/**
 * Página: Detalle de Profesional
 * 
 * Muestra toda la información del profesional
 */

import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient, getUser } from '@repo/supabase/server'
import { canAccessAdmin, getClubId } from '@/lib/auth'
import { ArrowLeft, Edit, Phone, Mail, User, Calendar, Briefcase } from 'lucide-react'
import { Badge } from '@repo/ui'

interface PageProps {
  params: {
    id: string
  }
}

export default async function ProfesionalDetallePage({ params }: PageProps) {
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

  // Obtener datos del profesional
  const supabase = await createClient()
  
  const { data: profesional, error } = await supabase
    .from('professionals')
    .select('*')
    .eq('id', params.id)
    .eq('club_id', clubId)
    .single()

  if (error || !profesional) {
    notFound()
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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/profesionales">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-main)]">
              {profesional.nombre} {profesional.apellido}
            </h1>
            <p className="text-[var(--color-text-muted)] mt-1">
              Información completa del profesional
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {getEstadoBadge(profesional.estado)}
          <Link href={`/admin/profesionales/${profesional.id}/editar`}>
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
          {/* Datos personales */}
          <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
            <h2 className="text-lg font-semibold text-[var(--color-text-main)] mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Datos Personales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Nombre completo" value={`${profesional.nombre} ${profesional.apellido}`} />
              <InfoItem label="Estado" value={profesional.estado} />
              {profesional.fecha_ingreso && (
                <InfoItem label="Fecha de ingreso" value={new Date(profesional.fecha_ingreso).toLocaleDateString('es-AR')} />
              )}
            </div>
          </div>

          {/* Contacto */}
          <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
            <h2 className="text-lg font-semibold text-[var(--color-text-main)] mb-4">
              Información de Contacto
            </h2>
            <div className="space-y-3">
              {profesional.telefono && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[var(--color-text-muted)]" />
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">Teléfono</p>
                    <a href={`tel:${profesional.telefono}`} className="text-sm font-medium text-primary hover:underline">
                      {profesional.telefono}
                    </a>
                  </div>
                </div>
              )}
              
              {profesional.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[var(--color-text-muted)]" />
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">Email</p>
                    <a href={`mailto:${profesional.email}`} className="text-sm font-medium text-primary hover:underline">
                      {profesional.email}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Información profesional */}
          {profesional.especialidad && (
            <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-main)] mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Información Profesional
              </h2>
              <div className="space-y-3">
                <InfoItem label="Especialidad" value={profesional.especialidad} />
                {profesional.biografia && (
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Biografía</p>
                    <p className="text-sm text-[var(--color-text-main)] whitespace-pre-wrap">
                      {profesional.biografia}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Turnos asignados */}
          <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
            <h2 className="text-lg font-semibold text-[var(--color-text-main)] mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Turnos Asignados
            </h2>
            <div className="text-center py-8">
              <p className="text-sm text-[var(--color-text-muted)]">
                Próximamente: lista de turnos asignados
              </p>
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

