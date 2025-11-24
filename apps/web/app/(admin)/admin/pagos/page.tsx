/**
 * Página: Lista de Pagos
 * 
 * Muestra todos los pagos (ingresos) del club
 */

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient, getUser } from '@repo/supabase/server'
import { canAccessAdmin, getClubId } from '@/lib/auth'
import { DollarSign, Plus } from 'lucide-react'
import { PagosTable } from './components/PagosTable'
import { PagosFilters } from './components/PagosFilters'

interface PageProps {
  searchParams: {
    desde?: string
    hasta?: string
    alumno?: string
    categoria?: string
    page?: string
  }
}

export default async function PagosPage({ searchParams }: PageProps) {
  const user = await getUser()
  
  if (!user || !canAccessAdmin(user)) {
    redirect('/auth/login')
  }

  const clubId = getClubId(user)
  
  if (!clubId) {
    return <div className="p-6">Error: No se pudo obtener el club del usuario</div>
  }

  // Parámetros
  const desde = searchParams.desde || ''
  const hasta = searchParams.hasta || ''
  const alumnoId = searchParams.alumno || ''
  const categoriaId = searchParams.categoria || ''
  const page = parseInt(searchParams.page || '1', 10)
  const perPage = 20

  const supabase = await createClient()
  
  let query = supabase
    .from('payments')
    .select(`
      *,
      students:student_id(id, nombre, apellido),
      payment_categories:categoria_id(id, nombre),
      payment_methods:medio_pago_id(id, nombre)
    `, { count: 'exact' })
    .eq('club_id', clubId)
    .order('fecha_pago', { ascending: false })

  if (desde) query = query.gte('fecha_pago', desde)
  if (hasta) query = query.lte('fecha_pago', hasta)
  if (alumnoId) query = query.eq('student_id', alumnoId)
  if (categoriaId) query = query.eq('categoria_id', categoriaId)

  const start = (page - 1) * perPage
  query = query.range(start, start + perPage - 1)

  const { data: pagos, error, count } = await query

  if (error) {
    console.error('Error fetching payments:', error)
  }

  // Calcular total
  const total = pagos?.reduce((sum, p) => sum + (p.monto || 0), 0) || 0
  const totalPages = count ? Math.ceil(count / perPage) : 0

  // Obtener opciones para filtros
  const [estudiantes, categorias] = await Promise.all([
    supabase.from('students').select('id, nombre, apellido').eq('club_id', clubId).limit(100),
    supabase.from('payment_categories').select('id, nombre').eq('club_id', clubId),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-main)]">
            Pagos e Ingresos
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Gestiona los ingresos del club
          </p>
        </div>
        
        <Link href="/admin/pagos/nuevo">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors">
            <Plus className="w-5 h-5" />
            Registrar Pago
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--color-surface)] p-4 rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-text-main)]">
                ${total.toLocaleString()}
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">Total Período</p>
            </div>
          </div>
        </div>
        <div className="bg-[var(--color-surface)] p-4 rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-text-main)]">{count || 0}</p>
              <p className="text-sm text-[var(--color-text-muted)]">Total Pagos</p>
            </div>
          </div>
        </div>
      </div>

      <PagosFilters
        initialDesde={desde}
        initialHasta={hasta}
        initialAlumno={alumnoId}
        initialCategoria={categoriaId}
        estudiantes={estudiantes.data || []}
        categorias={categorias.data || []}
      />

      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
        <Suspense fallback={<div className="p-6">Cargando...</div>}>
          <PagosTable 
            pagos={pagos || []}
            currentPage={page}
            totalPages={totalPages}
          />
        </Suspense>
      </div>
    </div>
  )
}
