/**
 * Componente: Filtros de Pagos
 */

'use client'

import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'
import { Input, Select } from '@repo/ui'

interface PagosFiltersProps {
  initialDesde: string
  initialHasta: string
  initialAlumno: string
  initialCategoria: string
  estudiantes: Array<{ id: string; nombre: string; apellido: string }>
  categorias: Array<{ id: string; nombre: string }>
}

export function PagosFilters({ 
  initialDesde, initialHasta, initialAlumno, initialCategoria,
  estudiantes, categorias
}: PagosFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [desde, setDesde] = useState(initialDesde)
  const [hasta, setHasta] = useState(initialHasta)
  const [alumno, setAlumno] = useState(initialAlumno)
  const [categoria, setCategoria] = useState(initialCategoria)

  const applyFilters = (d: string, h: string, a: string, c: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (d) params.set('desde', d)
    else params.delete('desde')
    
    if (h) params.set('hasta', h)
    else params.delete('hasta')
    
    if (a) params.set('alumno', a)
    else params.delete('alumno')
    
    if (c) params.set('categoria', c)
    else params.delete('categoria')
    
    params.delete('page')
    
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearFilters = () => {
    setDesde('')
    setHasta('')
    setAlumno('')
    setCategoria('')
    router.push(pathname)
  }

  const hasFilters = desde || hasta || alumno || categoria

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
          Desde
        </label>
        <Input
          type="date"
          value={desde}
          onChange={(e) => {
            setDesde(e.target.value)
            applyFilters(e.target.value, hasta, alumno, categoria)
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
          Hasta
        </label>
        <Input
          type="date"
          value={hasta}
          onChange={(e) => {
            setHasta(e.target.value)
            applyFilters(desde, e.target.value, alumno, categoria)
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
          Alumno
        </label>
        <Select
          value={alumno}
          onChange={(e) => {
            setAlumno(e.target.value)
            applyFilters(desde, hasta, e.target.value, categoria)
          }}
        >
          <option value="">Todos</option>
          {estudiantes.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre} {e.apellido}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
          Categoría
        </label>
        <Select
          value={categoria}
          onChange={(e) => {
            setCategoria(e.target.value)
            applyFilters(desde, hasta, alumno, e.target.value)
          }}
        >
          <option value="">Todas</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </Select>
      </div>

      {hasFilters && (
        <div className="md:col-span-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4" />
            Limpiar
          </button>
        </div>
      )}
    </div>
  )
}




