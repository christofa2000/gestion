'use client'

/**
 * Componente: Lista de Sedes para Dashboard
 * 
 * Muestra las sedes activas del club desde la base de datos
 */

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@repo/supabase/client'
import Link from 'next/link'
import { Building2 } from 'lucide-react'

interface Sede {
  id: string
  nombre: string
}

export function SedesList() {
  const [sedes, setSedes] = useState<Sede[]>([])
  const [loading, setLoading] = useState(true)
  const hasLoaded = useRef(false)

  useEffect(() => {
    // Prevenir múltiples llamadas
    if (hasLoaded.current) {
      return
    }

    async function loadSedes() {
      hasLoaded.current = true
      
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setLoading(false)
          return
        }

        const clubId = user.user_metadata?.club_id
        
        if (!clubId) {
          setLoading(false)
          return
        }

        // Obtener sedes activas desde la tabla branches
        const { data, error } = await supabase
          .from('branches')
          .select('id, nombre')
          .eq('club_id', clubId)
          .eq('activa', true)
          .order('nombre', { ascending: true })

        if (error) {
          console.error('Error fetching sedes:', error)
          setSedes([])
        } else {
          setSedes(data || [])
        }
      } catch (error) {
        console.error('Error loading sedes:', error)
        setSedes([])
      } finally {
        setLoading(false)
      }
    }

    loadSedes()
  }, [])

  // Si está cargando o no hay sedes, no mostrar nada
  if (loading || sedes.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sedes.map((sede) => (
        <Link key={sede.id} href={`/admin/turnos?sede=${sede.id}`} className="contents">
          <button className="flex items-center gap-4 p-6 rounded-xl bg-[var(--color-surface)] border-2 border-[var(--color-border-subtle)] hover:border-[var(--color-primary)] hover:shadow-lg transition-all group cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-[var(--color-primary-soft)] flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-colors">
              <Building2 className="w-6 h-6 text-[var(--color-primary)] group-hover:text-white transition-colors" />
            </div>
            <span className="text-base font-semibold text-[var(--color-text-main)]">
              {sede.nombre}
            </span>
          </button>
        </Link>
      ))}
    </div>
  )
}

