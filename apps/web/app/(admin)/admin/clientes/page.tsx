import Link from "next/link";

export default function ClientesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>
            Clientes
          </h1>
          <p style={{ color: "var(--color-text-muted)" }}>
            Gestiona tu base de clientes y alumnos
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-lg font-medium text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          + Nuevo Cliente
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre, email o teléfono..."
          className="w-full px-4 py-3 rounded-lg border"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border-subtle)",
            color: "var(--color-text-main)",
          }}
        />
      </div>

      {/* Clients Table */}
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
                Cliente
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: "var(--color-text-main)" }}>
                Email
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: "var(--color-text-main)" }}>
                Teléfono
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
            {[1, 2, 3, 4, 5].map((item) => (
              <tr key={item} className="border-t" style={{ borderColor: "var(--color-border-subtle)" }}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-medium text-white"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      JD
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: "var(--color-text-main)" }}>
                        Juan Doe
                      </p>
                      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                        Miembro desde 2024
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4" style={{ color: "var(--color-text-main)" }}>
                  juan.doe@email.com
                </td>
                <td className="px-6 py-4" style={{ color: "var(--color-text-main)" }}>
                  +54 11 1234-5678
                </td>
                <td className="px-6 py-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: "var(--color-success)",
                      color: "white",
                    }}
                  >
                    Activo
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/clientes/${item}`}
                    className="text-sm font-medium"
                    style={{ color: "var(--color-primary)" }}
                  >
                    Ver detalles →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Mostrando 1-5 de 248 clientes
        </p>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-lg border"
            style={{
              borderColor: "var(--color-border-subtle)",
              color: "var(--color-text-main)",
            }}
          >
            Anterior
          </button>
          <button
            className="px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

