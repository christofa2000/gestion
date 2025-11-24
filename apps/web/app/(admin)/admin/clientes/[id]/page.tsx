/**
 * Página: Detalle de Cliente
 * 
 * Muestra toda la información del cliente
 */

import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient, getUser } from '@repo/supabase/server'
import { canAccessAdmin, getClubId } from '@/lib/auth'
import { ArrowLeft, Edit, Phone, Mail, MapPin, FileText, Calendar, CreditCard } from 'lucide-react'
import { ClientStatusBadge } from '@repo/ui'

interface PageProps {
  params: {
    id: string
  }
}

export default async function ClienteDetallePage({ params }: PageProps) {
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

  // Obtener datos del cliente
  const supabase = await createClient()
  
  const { data: cliente, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', params.id)
    .eq('club_id', clubId)
    .single()

  if (error || !cliente) {
    notFound()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/clientes">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-main)]">
              {cliente.nombre} {cliente.apellido}
            </h1>
            {cliente.apodo && (
              <p className="text-[var(--color-text-muted)] mt-1">
                "{cliente.apodo}"
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <ClientStatusBadge status={cliente.estado} />
          <Link href={`/admin/clientes/${cliente.id}/editar`}>
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
            <h2 className="text-lg font-semibold text-[var(--color-text-main)] mb-4">
              Datos Personales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Nombre completo" value={`${cliente.nombre} ${cliente.apellido}`} />
              <InfoItem label="Número de cliente" value={cliente.numero_cliente} />
              <InfoItem label="Fecha de nacimiento" value={cliente.fecha_nacimiento ? new Date(cliente.fecha_nacimiento).toLocaleDateString('es-AR') : null} />
              <InfoItem label="Género" value={cliente.genero} />
              <InfoItem label="Documento" value={cliente.numero_documento ? `${cliente.tipo_documento || 'DNI'}: ${cliente.numero_documento}` : null} />
              <InfoItem label="Ocupación" value={cliente.ocupacion} />
              <InfoItem label="Obra social" value={cliente.obra_social} />
            </div>
          </div>

          {/* Contacto */}
          <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
            <h2 className="text-lg font-semibold text-[var(--color-text-main)] mb-4">
              Información de Contacto
            </h2>
            <div className="space-y-3">
              {cliente.telefono && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[var(--color-text-muted)]" />
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">Teléfono</p>
                    <a href={`tel:${cliente.telefono}`} className="text-sm font-medium text-primary hover:underline">
                      {cliente.telefono}
                    </a>
                  </div>
                </div>
              )}
              
              {cliente.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[var(--color-text-muted)]" />
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">Email</p>
                    <a href={`mailto:${cliente.email}`} className="text-sm font-medium text-primary hover:underline">
                      {cliente.email}
                    </a>
                  </div>
                </div>
              )}

              {cliente.direccion && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[var(--color-text-muted)]" />
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">Dirección</p>
                    <p className="text-sm font-medium text-[var(--color-text-main)]">
                      {cliente.direccion}
                      {cliente.codigo_postal && ` (${cliente.codigo_postal})`}
                      {cliente.ciudad && `, ${cliente.ciudad}`}
                      {cliente.provincia && `, ${cliente.provincia}`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {(cliente.contacto_emergencia || cliente.telefono_emergencia) && (
              <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
                <h3 className="text-sm font-semibold text-[var(--color-text-main)] mb-3">
                  Contacto de Emergencia
                </h3>
                <div className="space-y-2">
                  {cliente.contacto_emergencia && (
                    <p className="text-sm text-[var(--color-text-main)]">
                      <span className="text-[var(--color-text-muted)]">Nombre:</span> {cliente.contacto_emergencia}
                    </p>
                  )}
                  {cliente.telefono_emergencia && (
                    <p className="text-sm text-[var(--color-text-main)]">
                      <span className="text-[var(--color-text-muted)]">Teléfono:</span> {cliente.telefono_emergencia}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Observaciones */}
          {cliente.observaciones && (
            <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-main)] mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Observaciones
              </h2>
              <p className="text-sm text-[var(--color-text-main)] whitespace-pre-wrap">
                {cliente.observaciones}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actividad reciente */}
          <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
            <h2 className="text-lg font-semibold text-[var(--color-text-main)] mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Turnos
            </h2>
            <div className="text-center py-8">
              <p className="text-sm text-[var(--color-text-muted)]">
                Próximamente: historial de turnos
              </p>
            </div>
          </div>

          {/* Pagos */}
          <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
            <h2 className="text-lg font-semibold text-[var(--color-text-main)] mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Pagos
            </h2>
            <div className="text-center py-8">
              <p className="text-sm text-[var(--color-text-muted)]">
                Próximamente: historial de pagos
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
      <p className="text-sm font-medium text-[var(--color-text-main)]">
        {value || '-'}
      </p>
    </div>
  )
}
