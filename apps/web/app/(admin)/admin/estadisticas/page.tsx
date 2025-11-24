/**
 * Página: Estadísticas
 * 
 * Dashboard con métricas del club
 */

import { redirect } from 'next/navigation'
import { createClient, getUser } from '@repo/supabase/server'
import { canAccessAdmin, getClubId } from '@/lib/auth'
import { TrendingUp, TrendingDown, Calendar, DollarSign, Users, Activity } from 'lucide-react'

export default async function EstadisticasPage() {
  const user = await getUser()
  
  if (!user || !canAccessAdmin(user)) {
    redirect('/auth/login')
  }

  const clubId = getClubId(user)
  
  if (!clubId) {
    return <div className="p-6">Error: No se pudo obtener el club del usuario</div>
  }

  const supabase = await createClient()
  
  // Mes actual
  const now = new Date()
  const mesActualInicio = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const mesActualFin = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]

  // Ingresos del mes
  const { data: ingresosData } = await supabase
    .from('payments')
    .select('monto')
    .eq('club_id', clubId)
    .gte('fecha_pago', mesActualInicio)
    .lte('fecha_pago', mesActualFin)

  const ingresosMes = ingresosData?.reduce((sum, p) => sum + p.monto, 0) || 0

  // Egresos del mes
  const { data: egresosData } = await supabase
    .from('expenses')
    .select('monto')
    .eq('club_id', clubId)
    .gte('fecha', mesActualInicio)
    .lte('fecha', mesActualFin)

  const egresosMes = egresosData?.reduce((sum, e) => sum + e.monto, 0) || 0

  // Turnos del mes
  const { data: turnosData } = await supabase
    .from('bookings')
    .select('id, time_slots!inner(club_id)')
    .eq('time_slots.club_id', clubId)
    .eq('estado', 'reservado')
    .gte('created_at', mesActualInicio)

  const turnosMes = turnosData?.length || 0

  // Clientes activos
  const { data: clientesData } = await supabase
    .from('students')
    .select('id')
    .eq('club_id', clubId)
    .eq('estado', 'activo')

  const clientesActivos = clientesData?.length || 0

  // Balance
  const balance = ingresosMes - egresosMes

  // Últimos 6 meses - Ingresos por mes
  const mesesAtras = 5
  const mesesData = []
  
  for (let i = mesesAtras; i >= 0; i--) {
    const mesInicio = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const mesFin = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
    const mesNombre = mesInicio.toLocaleDateString('es-AR', { month: 'short' })
    
    const { data: pagos } = await supabase
      .from('payments')
      .select('monto')
      .eq('club_id', clubId)
      .gte('fecha_pago', mesInicio.toISOString().split('T')[0])
      .lte('fecha_pago', mesFin.toISOString().split('T')[0])
    
    const { data: gastos } = await supabase
      .from('expenses')
      .select('monto')
      .eq('club_id', clubId)
      .gte('fecha', mesInicio.toISOString().split('T')[0])
      .lte('fecha', mesFin.toISOString().split('T')[0])
    
    const ingresos = pagos?.reduce((sum, p) => sum + p.monto, 0) || 0
    const egresos = gastos?.reduce((sum, e) => sum + e.monto, 0) || 0
    
    mesesData.push({ mes: mesNombre, ingresos, egresos })
  }

  const maxMonto = Math.max(...mesesData.map(m => Math.max(m.ingresos, m.egresos)), 1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text-main)]">
          Estadísticas
        </h1>
        <p className="text-[var(--color-text-muted)] mt-1">
          Métricas y datos del club
        </p>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Ingresos del Mes"
          value={`$${ingresosMes.toLocaleString()}`}
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
        />
        <KPICard
          title="Egresos del Mes"
          value={`$${egresosMes.toLocaleString()}`}
          icon={<TrendingDown className="w-6 h-6" />}
          color="red"
        />
        <KPICard
          title="Balance del Mes"
          value={`$${balance.toLocaleString()}`}
          icon={balance >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
          color={balance >= 0 ? 'green' : 'red'}
        />
        <KPICard
          title="Turnos Reservados"
          value={turnosMes.toString()}
          icon={<Calendar className="w-6 h-6" />}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KPICard
          title="Clientes Activos"
          value={clientesActivos.toString()}
          icon={<Users className="w-6 h-6" />}
          color="purple"
        />
      </div>

      {/* Gráfico simple de ingresos vs egresos */}
      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
        <h2 className="text-lg font-semibold text-[var(--color-text-main)] mb-6">
          Ingresos vs Egresos (últimos 6 meses)
        </h2>
        
        <div className="space-y-6">
          {mesesData.map((mes, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[var(--color-text-main)] capitalize">
                  {mes.mes}
                </span>
                <div className="text-sm text-[var(--color-text-muted)]">
                  <span className="text-green-600 font-medium">${mes.ingresos.toLocaleString()}</span>
                  {' / '}
                  <span className="text-red-600 font-medium">${mes.egresos.toLocaleString()}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-8 bg-green-100 rounded overflow-hidden">
                  <div 
                    className="h-full bg-green-500"
                    style={{ width: `${(mes.ingresos / maxMonto) * 100}%` }}
                  />
                </div>
                <div className="h-8 bg-red-100 rounded overflow-hidden">
                  <div 
                    className="h-full bg-red-500"
                    style={{ width: `${(mes.egresos / maxMonto) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span className="text-sm text-[var(--color-text-muted)]">Ingresos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded" />
            <span className="text-sm text-[var(--color-text-muted)]">Egresos</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function KPICard({ title, value, icon, color }: { 
  title: string
  value: string
  icon: React.ReactNode
  color: 'green' | 'red' | 'blue' | 'purple'
}) {
  const colorClasses = {
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
  }

  return (
    <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[var(--color-border)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--color-text-muted)] mb-1">{title}</p>
          <p className="text-2xl font-bold text-[var(--color-text-main)]">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
