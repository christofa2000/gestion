/**
 * Página: Crear Nuevo Usuario Admin
 * 
 * Permite crear un usuario ADMIN para un club existente.
 * Solo SUPER_ADMIN puede acceder.
 */

import { redirect } from 'next/navigation'
import { getUser } from '@repo/supabase/server'
import { isSuperAdmin } from '@/lib/auth'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CreateUserAdminForm } from './components/CreateUserAdminForm'

interface PageProps {
  searchParams: {
    club_id?: string
  }
}

export default async function NuevoUsuarioAdminPage({ searchParams }: PageProps) {
  const user = await getUser()
  
  if (!user || !isSuperAdmin(user)) {
    redirect('/auth/login')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/superadmin/usuarios">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-main)]">
            Crear Usuario Admin
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Crea un nuevo usuario administrador para un club existente
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
        <CreateUserAdminForm initialClubId={searchParams.club_id} />
      </div>
    </div>
  )
}

