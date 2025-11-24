/**
 * Componente: Filtros de Sedes
 * 
 * Maneja búsqueda y filtro por estado usando query params
 */

'use client'

import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Input, Select } from '@repo/ui'

interface SedesFiltersProps {
  initialSearch: string
  initialActiva: string
}

export function SedesFilters({ initialSearch, initialActiva }: SedesFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(initialSearch)
  const [activa, setActiva] = useState(initialActiva)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters(search, activa)
  }

  const handleActivaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newActiva = e.target.value
    setActiva(newActiva)
    applyFilters(search, newActiva)
  }

  const applyFilters = (searchValue: string, activaValue: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (searchValue) {
      params.set('search', searchValue)
    } else {
      params.delete('search')
    }
    
    if (activaValue && activaValue !== 'todos') {
      params.set('activa', activaValue)
    } else {
      params.delete('activa')
    }
    
    // Reset page to 1
    params.delete('page')
    
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch('')
    setActiva('todos')
    router.push(pathname)
  }

  const hasFilters = search || (activa && activa !== 'todos')

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Búsqueda */}
      <form onSubmit={handleSearchSubmit} className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar por nombre, email, teléfono o dirección..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </form>

      {/* Filtro por estado */}
      <Select
        value={activa}
        onChange={handleActivaChange}
        className="w-full sm:w-48"
      >
        <option value="todos">Todas las sedes</option>
        <option value="activa">Activas</option>
        <option value="inactiva">Inactivas</option>
      </Select>

      {/* Limpiar filtros */}
      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg)] transition-colors"
        >
          <X className="w-4 h-4" />
          Limpiar
        </button>
      )}
    </div>
  )
}

