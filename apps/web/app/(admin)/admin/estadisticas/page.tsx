export default function EstadisticasPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>
          Estadísticas y Reportes
        </h1>
        <p style={{ color: "var(--color-text-muted)" }}>
          Análisis y métricas del rendimiento del club
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div
          className="p-6 rounded-xl border"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border-subtle)",
          }}
        >
          <p className="text-sm mb-2" style={{ color: "var(--color-text-muted)" }}>
            Ingresos Totales
          </p>
          <p className="text-3xl font-bold mb-1" style={{ color: "var(--color-text-main)" }}>
            $45,290
          </p>
          <p className="text-xs" style={{ color: "var(--color-success)" }}>
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
            Egresos Totales
          </p>
          <p className="text-3xl font-bold mb-1" style={{ color: "var(--color-text-main)" }}>
            $18,450
          </p>
          <p className="text-xs" style={{ color: "var(--color-error)" }}>
            +3% vs mes anterior
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
            Margen Neto
          </p>
          <p className="text-3xl font-bold mb-1" style={{ color: "var(--color-text-main)" }}>
            $26,840
          </p>
          <p className="text-xs" style={{ color: "var(--color-success)" }}>
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
            Tasa de Ocupación
          </p>
          <p className="text-3xl font-bold mb-1" style={{ color: "var(--color-text-main)" }}>
            78%
          </p>
          <p className="text-xs" style={{ color: "var(--color-success)" }}>
            +5% vs mes anterior
          </p>
        </div>
      </div>

      {/* Charts Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div
          className="rounded-xl border p-6"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border-subtle)",
          }}
        >
          <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--color-text-main)" }}>
            Ingresos vs Egresos (6 meses)
          </h2>
          <div
            className="h-64 flex items-center justify-center rounded-lg"
            style={{ backgroundColor: "var(--color-bg)" }}
          >
            <p style={{ color: "var(--color-text-muted)" }}>
              Gráfico de líneas (Recharts)
            </p>
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
            Distribución de Ingresos
          </h2>
          <div
            className="h-64 flex items-center justify-center rounded-lg"
            style={{ backgroundColor: "var(--color-bg)" }}
          >
            <p style={{ color: "var(--color-text-muted)" }}>
              Gráfico de torta (Recharts)
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
          Actividades Más Populares
        </h2>
        <div className="space-y-4">
          {[
            { name: "Clases de Tenis", bookings: 156, revenue: "$18,720" },
            { name: "Clases de Pádel", bookings: 132, revenue: "$15,840" },
            { name: "Clases Grupales", bookings: 98, revenue: "$7,840" },
            { name: "Alquiler de Canchas", bookings: 89, revenue: "$2,890" },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: "var(--color-border-subtle)" }}>
              <div>
                <p className="font-medium" style={{ color: "var(--color-text-main)" }}>
                  {activity.name}
                </p>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  {activity.bookings} reservas
                </p>
              </div>
              <p className="text-lg font-bold" style={{ color: "var(--color-success)" }}>
                {activity.revenue}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

