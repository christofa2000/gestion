export default function ConfiguracionUsuariosPage() {
  return (
    <div>
      <div className="mb-6">
        <a href="/admin/configuraciones" className="text-sm mb-2 inline-block" style={{ color: "var(--color-primary)" }}>
          ← Volver a configuraciones
        </a>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>
              Usuarios y Roles
            </h1>
            <p style={{ color: "var(--color-text-muted)" }}>
              Gestión de accesos y permisos
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-lg font-medium text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            + Invitar Usuario
          </button>
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




