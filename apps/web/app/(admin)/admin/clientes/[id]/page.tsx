export default function ClienteDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <div className="mb-6">
        <a href="/admin/clientes" className="text-sm mb-2 inline-block" style={{ color: "var(--color-primary)" }}>
          ← Volver a clientes
        </a>
        <h1 className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>
          Juan Doe
        </h1>
        <p style={{ color: "var(--color-text-muted)" }}>ID: {params.id}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div
            className="rounded-xl border p-6"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border-subtle)",
            }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--color-text-main)" }}>
              Información Personal
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm mb-1" style={{ color: "var(--color-text-muted)" }}>
                  Nombre completo
                </p>
                <p className="font-medium" style={{ color: "var(--color-text-main)" }}>
                  Juan Doe
                </p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: "var(--color-text-muted)" }}>
                  Email
                </p>
                <p className="font-medium" style={{ color: "var(--color-text-main)" }}>
                  juan.doe@email.com
                </p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: "var(--color-text-muted)" }}>
                  Teléfono
                </p>
                <p className="font-medium" style={{ color: "var(--color-text-main)" }}>
                  +54 11 1234-5678
                </p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: "var(--color-text-muted)" }}>
                  Fecha de nacimiento
                </p>
                <p className="font-medium" style={{ color: "var(--color-text-main)" }}>
                  15/03/1990
                </p>
              </div>
            </div>
          </div>

          <div
            className="rounded-xl border p-6"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border-subtle)",
            }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--color-text-main)" }}>
              Historial de Turnos
            </h2>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between py-3 border-b" style={{ borderColor: "var(--color-border-subtle)" }}>
                  <div>
                    <p className="font-medium" style={{ color: "var(--color-text-main)" }}>
                      Clase de Tenis - Cancha 1
                    </p>
                    <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                      25/11/2025 - 10:00 AM
                    </p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: "var(--color-success)", color: "white" }}
                  >
                    Completado
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div
            className="rounded-xl border p-6"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border-subtle)",
            }}
          >
            <h3 className="font-semibold mb-4" style={{ color: "var(--color-text-main)" }}>
              Estado de Cuenta
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  Saldo actual
                </p>
                <p className="text-2xl font-bold" style={{ color: "var(--color-success)" }}>
                  Al día
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  Último pago
                </p>
                <p className="font-medium" style={{ color: "var(--color-text-main)" }}>
                  $2,500 - 20/11/2025
                </p>
              </div>
            </div>
          </div>

          <div
            className="rounded-xl border p-6"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border-subtle)",
            }}
          >
            <h3 className="font-semibold mb-4" style={{ color: "var(--color-text-main)" }}>
              Acciones Rápidas
            </h3>
            <div className="space-y-2">
              <button
                className="w-full py-2 rounded-lg font-medium text-white"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Nuevo Turno
              </button>
              <button
                className="w-full py-2 rounded-lg font-medium border"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-main)",
                }}
              >
                Registrar Pago
              </button>
              <button
                className="w-full py-2 rounded-lg font-medium border"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-main)",
                }}
              >
                Editar Datos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

