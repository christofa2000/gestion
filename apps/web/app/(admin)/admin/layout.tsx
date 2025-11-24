/**
 * Layout para el panel de administración
 * 
 * Verifica la sesión del usuario server-side y renderiza el panel admin.
 * Solo accesible para SUPER_ADMIN, CLUB_ADMIN y PROFESSIONAL.
 */

import { redirect } from 'next/navigation'
import { getUser } from '@repo/supabase/server'
import { canAccessAdmin } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { SidebarSpacer } from '@/components/admin/SidebarSpacer'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verificar autenticación
  const user = await getUser()

  if (!user) {
    redirect('/auth/login?redirect=/admin')
  }

  // Verificar que puede acceder al admin
  if (!canAccessAdmin(user)) {
    redirect('/auth/login')
  }

  // Extraer información del usuario
  const nombre = user.user_metadata?.nombre || user.email?.split('@')[0] || 'Usuario'
  const apellido = user.user_metadata?.apellido || ''
  const role = user.user_metadata?.role || 'CLUB_ADMIN'
  const clubId = user.user_metadata?.club_id

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <AdminHeader 
        userName={`${nombre} ${apellido}`.trim()}
        userRole={role}
        userEmail={user.email || ''}
      />

      <div className="flex">
        {/* Sidebar - Colapsable */}
        <AdminSidebar 
          userName={`${nombre} ${apellido}`.trim()}
          userRole={role}
        />

        {/* Espaciador para el contenido */}
        <SidebarSpacer />

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}




