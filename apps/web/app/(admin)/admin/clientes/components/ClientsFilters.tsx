/**
 * Componente: Filtros de Clientes
 * 
 * Maneja búsqueda y filtro por estado usando query params
 */

'use client'

import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Input, Select } from '@repo/ui'

interface ClientsFiltersProps {
  initialSearch: string
  initialEstado: string
}

export function ClientsFilters({ initialSearch, initialEstado }: ClientsFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(initialSearch)
  const [estado, setEstado] = useState(initialEstado)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters(search, estado)
  }

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEstado = e.target.value
    setEstado(newEstado)
    applyFilters(search, newEstado)
  }

  const applyFilters = (searchValue: string, estadoValue: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (searchValue) {
      params.set('search', searchValue)
    } else {
      params.delete('search')
    }
    
    if (estadoValue && estadoValue !== 'todos') {
      params.set('estado', estadoValue)
    } else {
      params.delete('estado')
    }
    
    // Reset page to 1
    params.delete('page')
    
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch('')
    setEstado('todos')
    router.push(pathname)
  }

  const hasFilters = search || (estado && estado !== 'todos')

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Búsqueda */}
      <form onSubmit={handleSearchSubmit} className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar por nombre, apellido, email o número..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </form>

      {/* Filtro por estado */}
      <Select
        value={estado}
        onChange={handleEstadoChange}
        className="w-full sm:w-48"
      >
        <option value="todos">Todos los estados</option>
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
        <option value="pendiente">Pendiente</option>
        <option value="rechazado">Rechazado</option>
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




