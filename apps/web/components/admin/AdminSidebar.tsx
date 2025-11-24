/**
 * Sidebar del panel de administración - Colapsable
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  TrendingDown,
  Settings,
  Building2,
  UserCog,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminSidebarProps {
  userName: string
  userRole: string
}

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    roles: ['SUPER_ADMIN', 'CLUB_ADMIN', 'PROFESSIONAL'],
  },
  {
    title: 'Clientes',
    href: '/admin/clientes',
    icon: Users,
    roles: ['SUPER_ADMIN', 'CLUB_ADMIN', 'PROFESSIONAL'],
  },
  {
    title: 'Turnos',
    href: '/admin/turnos',
    icon: Calendar,
    roles: ['SUPER_ADMIN', 'CLUB_ADMIN', 'PROFESSIONAL'],
  },
  {
    title: 'Pagos',
    href: '/admin/pagos',
    icon: CreditCard,
    roles: ['SUPER_ADMIN', 'CLUB_ADMIN'],
  },
  {
    title: 'Egresos',
    href: '/admin/egresos',
    icon: TrendingDown,
    roles: ['SUPER_ADMIN', 'CLUB_ADMIN'],
  },
  {
    title: 'Estadísticas',
    href: '/admin/estadisticas',
    icon: BarChart3,
    roles: ['SUPER_ADMIN', 'CLUB_ADMIN'],
  },
  {
    title: 'Sedes',
    href: '/admin/sedes',
    icon: Building2,
    roles: ['SUPER_ADMIN', 'CLUB_ADMIN'],
  },
  {
    title: 'Profesionales',
    href: '/admin/profesionales',
    icon: UserCog,
    roles: ['SUPER_ADMIN', 'CLUB_ADMIN'],
  },
  {
    title: 'Configuración',
    href: '/admin/configuracion',
    icon: Settings,
    roles: ['SUPER_ADMIN', 'CLUB_ADMIN'],
  },
]

export default function AdminSidebar({ userName, userRole }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Cargar estado del localStorage al montar
  useEffect(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed')
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved))
    }
  }, [])

  // Guardar estado en localStorage cuando cambia y notificar cambios
  useEffect(() => {
    localStorage.setItem('admin-sidebar-collapsed', JSON.stringify(isCollapsed))
    // Disparar evento personalizado para que otros componentes se actualicen
    window.dispatchEvent(new Event('sidebar-collapse-change'))
  }, [isCollapsed])

  // Filtrar items según el rol
  const filteredItems = menuItems.filter((item) => item.roles.includes(userRole))

  return (
    <>
      <aside
        className={cn(
          'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-[var(--color-surface)] border-r border-[var(--color-border)] pt-16 transition-all duration-300 z-30',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Botón para colapsar/expandir */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-full p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg)] shadow-md transition-all z-40"
          aria-label={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        <nav className={cn('flex-1 space-y-1 overflow-y-auto', isCollapsed ? 'px-2 py-6' : 'px-4 py-6')}>
          {filteredItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg transition-colors group relative',
                  isCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text-main)]'
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.title}</span>}
                
                {/* Tooltip cuando está colapsado */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                    {item.title}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User info at bottom */}
        <div className={cn('p-4 border-t border-[var(--color-border)]', isCollapsed && 'px-2')}>
          <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-text-main)] truncate">
                  {userName}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] truncate">
                  {userRole}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

    </>
  )
}




