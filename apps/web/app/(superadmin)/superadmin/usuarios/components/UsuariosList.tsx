'use client'

/**
 * Componente: Lista de Usuarios Admin
 * 
 * Componente cliente para mostrar la lista de usuarios con acciones
 */

import { useRouter } from 'next/navigation'
import { deleteUserAdmin } from '../actions'
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog'

interface Usuario {
  id: string
  nombre: string
  apellido: string
  email: string
  role: string
  activo: boolean
  clubs?: {
    id: string
    nombre: string
  } | null
}

interface UsuariosListProps {
  usuarios: Usuario[]
}

export function UsuariosList({ usuarios }: UsuariosListProps) {
  const router = useRouter()

  if (usuarios.length === 0) {
    return (
      <p className="text-[var(--color-text-muted)] text-center py-8">
        No hay usuarios admin registrados
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {usuarios.map((usuario) => (
        <div
          key={usuario.id}
          className="flex items-center justify-between p-4 rounded-lg border border-[var(--color-border)]"
        >
          <div>
            <p className="font-medium text-[var(--color-text-main)]">
              {usuario.nombre} {usuario.apellido}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">
              {usuario.email}
            </p>
            {usuario.clubs && (
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Club: {usuario.clubs.nombre}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                usuario.role === 'SUPER_ADMIN'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {usuario.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Club Admin'}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                usuario.activo
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {usuario.activo ? 'Activo' : 'Inactivo'}
            </span>
            {usuario.role !== 'SUPER_ADMIN' && (
              <DeleteConfirmDialog
                title="Eliminar Usuario Admin"
                message="¿Estás seguro de que deseas eliminar este usuario admin? Se eliminará también su cuenta de autenticación. Esta acción no se puede deshacer."
                itemName={`${usuario.nombre} ${usuario.apellido}`}
                onConfirm={async () => {
                  const result = await deleteUserAdmin(usuario.id)
                  if (result.error) {
                    throw new Error(result.error)
                  }
                  // Redirigir a la misma página para refrescar sin loops
                  router.push('/superadmin/usuarios')
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

