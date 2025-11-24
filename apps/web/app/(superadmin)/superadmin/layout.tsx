/**
 * Layout para el panel de SUPER_ADMIN
 * 
 * Solo accesible para SUPER_ADMIN.
 * Permite gestionar todos los clubs y crear usuarios ADMIN.
 */

import { redirect } from 'next/navigation'
import { getUser } from '@repo/supabase/server'
import { isSuperAdmin } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { SidebarSpacer } from '@/components/admin/SidebarSpacer'

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verificar autenticación
  const user = await getUser()

  if (!user) {
    redirect('/auth/login?redirect=/superadmin')
  }

  // Verificar que es SUPER_ADMIN
  if (!isSuperAdmin(user)) {
    redirect('/auth/login')
  }

  // Extraer información del usuario
  const nombre = user.user_metadata?.nombre || user.email?.split('@')[0] || 'Super Admin'
  const apellido = user.user_metadata?.apellido || ''
  const role = user.user_metadata?.role || 'SUPER_ADMIN'

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

