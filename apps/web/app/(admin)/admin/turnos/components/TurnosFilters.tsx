/**
 * Componente: Filtros de Turnos
 * 
 * Filtros para agenda de turnos
 */

'use client'

import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Calendar, X } from 'lucide-react'
import { Input, Select } from '@repo/ui'

interface TurnosFiltersProps {
  initialFecha: string
  initialSede: string
  initialActividad: string
  initialProfesional: string
  sedes: Array<{ id: string; nombre: string }>
  actividades: Array<{ id: string; nombre: string }>
  profesionales: Array<{ id: string; nombre: string; apellido: string }>
}

export function TurnosFilters({ 
  initialFecha,
  initialSede,
  initialActividad,
  initialProfesional,
  sedes,
  actividades,
  profesionales
}: TurnosFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [fecha, setFecha] = useState(initialFecha)
  const [sede, setSede] = useState(initialSede)
  const [actividad, setActividad] = useState(initialActividad)
  const [profesional, setProfesional] = useState(initialProfesional)

  const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFecha = e.target.value
    setFecha(newFecha)
    applyFilters(newFecha, sede, actividad, profesional)
  }

  const handleSedeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSede = e.target.value
    setSede(newSede)
    applyFilters(fecha, newSede, actividad, profesional)
  }

  const handleActividadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newActividad = e.target.value
    setActividad(newActividad)
    applyFilters(fecha, sede, newActividad, profesional)
  }

  const handleProfesionalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProfesional = e.target.value
    setProfesional(newProfesional)
    applyFilters(fecha, sede, actividad, newProfesional)
  }

  const applyFilters = (f: string, s: string, a: string, p: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (f) params.set('fecha', f)
    else params.delete('fecha')
    
    if (s) params.set('sede', s)
    else params.delete('sede')
    
    if (a) params.set('actividad', a)
    else params.delete('actividad')
    
    if (p) params.set('profesional', p)
    else params.delete('profesional')
    
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearFilters = () => {
    setFecha(new Date().toISOString().split('T')[0])
    setSede('')
    setActividad('')
    setProfesional('')
    router.push(pathname)
  }

  const hasFilters = sede || actividad || profesional

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Fecha */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
          <Calendar className="w-4 h-4 inline mr-1" />
          Fecha
        </label>
        <Input
          type="date"
          value={fecha}
          onChange={handleFechaChange}
        />
      </div>

      {/* Sede */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
          Sede
        </label>
        <Select value={sede} onChange={handleSedeChange}>
          <option value="">Todas las sedes</option>
          {sedes.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre}
            </option>
          ))}
        </Select>
      </div>

      {/* Actividad */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
          Actividad
        </label>
        <Select value={actividad} onChange={handleActividadChange}>
          <option value="">Todas las actividades</option>
          {actividades.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre}
            </option>
          ))}
        </Select>
      </div>

      {/* Profesional */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
          Profesional
        </label>
        <Select value={profesional} onChange={handleProfesionalChange}>
          <option value="">Todos los profesionales</option>
          {profesionales.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} {p.apellido}
            </option>
          ))}
        </Select>
      </div>

      {/* Limpiar filtros */}
      {hasFilters && (
        <div className="md:col-span-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4" />
            Limpiar Filtros
          </button>
        </div>
      )}
    </div>
  )
}




