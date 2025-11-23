export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--color-text-main)" }}>
        Panel de Control
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          className="p-6 rounded-xl border"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border-subtle)",
          }}
        >
          <p className="text-sm mb-2" style={{ color: "var(--color-text-muted)" }}>
            Total Clientes
          </p>
          <p className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>
            248
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--color-success)" }}>
            +12% vs mes anterior
          </p>
        </div>

        <div
          className="p-6 rounded-xl border"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border-subtle)",
          }}
        >
          <p className="text-sm mb-2" style={{ color: "var(--color-text-muted)" }}>
            Turnos Hoy
          </p>
          <p className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>
            34
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--color-info)" }}>
            8 pendientes
          </p>
        </div>

        <div
          className="p-6 rounded-xl border"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border-subtle)",
          }}
        >
          <p className="text-sm mb-2" style={{ color: "var(--color-text-muted)" }}>
            Ingresos Mes
          </p>
          <p className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>
            $45,290
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--color-success)" }}>
            +8% vs mes anterior
          </p>
        </div>

        <div
          className="p-6 rounded-xl border"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border-subtle)",
          }}
        >
          <p className="text-sm mb-2" style={{ color: "var(--color-text-muted)" }}>
            Pagos Pendientes
          </p>
          <p className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>
            12
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--color-warning)" }}>
            $8,500 total
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div
        className="rounded-xl border p-6"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border-subtle)",
        }}
      >
        <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--color-text-main)" }}>
          Actividad Reciente
        </h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center gap-4 py-3 border-b" style={{ borderColor: "var(--color-border-subtle)" }}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--color-primary-soft)" }}
              >
                <span style={{ color: "var(--color-primary)" }}>JD</span>
              </div>
              <div className="flex-1">
                <p className="font-medium" style={{ color: "var(--color-text-main)" }}>
                  Juan Doe reservó un turno
                </p>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  Hace 2 horas
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

