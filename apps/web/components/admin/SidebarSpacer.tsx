'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function SidebarSpacer() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed')
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved))
    }

    // Escuchar cambios en el localStorage
    const handleStorageChange = () => {
      const saved = localStorage.getItem('admin-sidebar-collapsed')
      if (saved !== null) {
        setIsCollapsed(JSON.parse(saved))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // También escuchar cambios locales usando un evento personalizado
    const handleCollapseChange = () => {
      const saved = localStorage.getItem('admin-sidebar-collapsed')
      if (saved !== null) {
        setIsCollapsed(JSON.parse(saved))
      }
    }

    window.addEventListener('sidebar-collapse-change', handleCollapseChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('sidebar-collapse-change', handleCollapseChange)
    }
  }, [])

  return (
    <div className={cn('hidden lg:block transition-all duration-300', isCollapsed ? 'w-16' : 'w-64')} />
  )
}

