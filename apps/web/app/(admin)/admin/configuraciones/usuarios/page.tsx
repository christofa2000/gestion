import { redirect } from 'next/navigation'
import { getUser } from '@repo/supabase/server'
import { isSuperAdmin } from '@/lib/auth'
import Link from 'next/link'

export default async function ConfiguracionUsuariosPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Solo SUPER_ADMIN puede crear usuarios ADMIN
  // Los CLUB_ADMIN solo pueden ver usuarios de su club, pero no crear otros ADMIN
  const canCreateAdmin = isSuperAdmin(user)

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/configuraciones" className="text-sm mb-2 inline-block" style={{ color: "var(--color-primary)" }}>
          ← Volver a configuraciones
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>
              Usuarios y Roles
            </h1>
            <p style={{ color: "var(--color-text-muted)" }}>
              {canCreateAdmin 
                ? 'Gestión de accesos y permisos (Solo SUPER_ADMIN puede crear usuarios ADMIN)'
                : 'Ver usuarios de tu club (Solo SUPER_ADMIN puede crear nuevos usuarios ADMIN)'}
            </p>
          </div>
          {canCreateAdmin ? (
            <Link href="/superadmin/usuarios/nuevo">
              <button
                className="px-4 py-2 rounded-lg font-medium text-white"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                + Crear Usuario Admin
              </button>
            </Link>
          ) : (
            <div className="px-4 py-2 rounded-lg text-sm" style={{ color: "var(--color-text-muted)", backgroundColor: "var(--color-surface)" }}>
              Solo SUPER_ADMIN puede crear usuarios ADMIN
            </div>
          )}
        </div>
      </div>

      <div
        className="rounded-xl border overflow-hidden"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border-subtle)",
        }}
      >
        <table className="w-full">
          <thead style={{ backgroundColor: "var(--color-bg)" }}>
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: "var(--color-text-main)" }}>
                Usuario
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: "var(--color-text-main)" }}>
                Email
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: "var(--color-text-main)" }}>
                Rol
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: "var(--color-text-main)" }}>
                Estado
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: "var(--color-text-main)" }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: "Admin Principal", email: "admin@club.com", role: "Club Admin", status: "Activo" },
              { name: "Juan Pérez", email: "juan@club.com", role: "Profesional", status: "Activo" },
              { name: "María García", email: "maria@club.com", role: "Profesional", status: "Activo" },
            ].map((usuario, idx) => (
              <tr key={idx} className="border-t" style={{ borderColor: "var(--color-border-subtle)" }}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-medium text-white"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      {usuario.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="font-medium" style={{ color: "var(--color-text-main)" }}>
                      {usuario.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4" style={{ color: "var(--color-text-main)" }}>
                  {usuario.email}
                </td>
                <td className="px-6 py-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: "var(--color-primary-soft)",
                      color: "var(--color-primary)",
                    }}
                  >
                    {usuario.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: "var(--color-success)", color: "white" }}
                  >
                    {usuario.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-sm font-medium" style={{ color: "var(--color-primary)" }}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}




