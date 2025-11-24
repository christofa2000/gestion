/**
 * Header del portal de alumnos
 */

'use client'

import { Bell, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@repo/supabase/client'
import { useUserStore } from '@/lib/stores/useUserStore'

interface StudentHeaderProps {
  userName: string
  userEmail: string
}

export default function StudentHeader({ userName, userEmail }: StudentHeaderProps) {
  const router = useRouter()
  const { logout } = useUserStore()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      logout()
      router.push('/auth/login')
      router.refresh()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <header className="bg-[var(--color-surface)] border-b border-[var(--color-border)] sticky top-0 z-40">
      <div className="px-4 h-16 flex items-center justify-between">
        {/* Logo / Título */}
        <div className="flex items-center gap-4">
          <h1 className="text-lg lg:text-xl font-bold text-[var(--color-text-main)]">
            Mi Portal
          </h1>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-3">
          {/* Notificaciones */}
          <button className="p-2 hover:bg-[var(--color-bg)] rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-[var(--color-text-muted)]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </button>

          {/* Usuario */}
          <div className="flex items-center gap-3 pl-3 border-l border-[var(--color-border)]">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-[var(--color-text-main)]">{userName}</p>
              <p className="text-xs text-[var(--color-text-muted)]">Alumno</p>
            </div>

            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}




