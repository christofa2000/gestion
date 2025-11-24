/**
 * Layout para el portal de alumnos
 * 
 * Verifica la sesión del usuario server-side y renderiza el panel student.
 * Solo accesible para STUDENT.
 */

import { redirect } from 'next/navigation'
import { getUser } from '@repo/supabase/server'
import { canAccessStudent } from '@/lib/auth'
import StudentHeader from '@/components/student/StudentHeader'
import StudentBottomNav from '@/components/student/StudentBottomNav'

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verificar autenticación
  const user = await getUser()

  if (!user) {
    redirect('/auth/login?redirect=/student')
  }

  // Verificar que es estudiante
  if (!canAccessStudent(user)) {
    redirect('/auth/login')
  }

  // Extraer información del usuario
  const nombre = user.user_metadata?.nombre || user.email?.split('@')[0] || 'Alumno'
  const apellido = user.user_metadata?.apellido || ''

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-20 lg:pb-0">
      {/* Header */}
      <StudentHeader 
        userName={`${nombre} ${apellido}`.trim()}
        userEmail={user.email || ''}
      />

      {/* Main Content */}
      <main className="p-4 lg:p-6">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <StudentBottomNav />
    </div>
  )
}




