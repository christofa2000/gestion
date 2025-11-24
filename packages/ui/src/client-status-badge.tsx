/**
 * Client Status Badge
 * 
 * Badge específico para mostrar el estado de un cliente/alumno
 */

import { Badge } from './badge'

type ClientStatus = 'activo' | 'inactivo' | 'rechazado' | 'pendiente'

interface ClientStatusBadgeProps {
  status: ClientStatus
  className?: string
}

const statusConfig: Record<ClientStatus, { label: string; variant: 'success' | 'default' | 'danger' | 'warning' }> = {
  activo: {
    label: 'Activo',
    variant: 'success',
  },
  inactivo: {
    label: 'Inactivo',
    variant: 'default',
  },
  rechazado: {
    label: 'Rechazado',
    variant: 'danger',
  },
  pendiente: {
    label: 'Pendiente',
    variant: 'warning',
  },
}

export function ClientStatusBadge({ status, className }: ClientStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.activo

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}




