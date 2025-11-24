/**
 * Barra de navegación inferior para alumnos (mobile)
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, CreditCard, Building2, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    title: 'Agenda',
    href: '/student',
    icon: Calendar,
  },
  {
    title: 'Pagos',
    href: '/student/pagos',
    icon: CreditCard,
  },
  {
    title: 'Sedes',
    href: '/student/sedes',
    icon: Building2,
  },
  {
    title: 'Perfil',
    href: '/student/perfil',
    icon: User,
  },
]

export default function StudentBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-surface)] border-t border-[var(--color-border)] z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.title}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}




