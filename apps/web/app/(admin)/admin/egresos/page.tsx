export default function EgresosPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>
            Gestión de Egresos
          </h1>
          <p style={{ color: "var(--color-text-muted)" }}>
            Control de gastos y salidas de dinero
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-lg font-medium text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          + Nuevo Egreso
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div
          className="p-6 rounded-xl border"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border-subtle)",
          }}
        >
          <p className="text-sm mb-2" style={{ color: "var(--color-text-muted)" }}>
            Total Egresos (Mes)
          </p>
          <p className="text-3xl font-bold" style={{ color: "var(--color-error)" }}>
            $18,450
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
            Por Pagar
          </p>
          <p className="text-3xl font-bold" style={{ color: "var(--color-warning)" }}>
            $3,200
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
            Total Registros
          </p>
          <p className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>
            42
          </p>
        </div>
      </div>

      {/* Expenses Table */}
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
                Fecha
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: "var(--color-text-main)" }}>
                Concepto
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: "var(--color-text-main)" }}>
                Categoría
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: "var(--color-text-main)" }}>
                Monto
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: "var(--color-text-main)" }}>
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              { date: "23/11/2025", concept: "Mantenimiento canchas", category: "Infraestructura", amount: "$4,500", status: "Pagado" },
              { date: "20/11/2025", concept: "Salario profesor Juan", category: "Sueldos", amount: "$12,000", status: "Pagado" },
              { date: "18/11/2025", concept: "Material deportivo", category: "Insumos", amount: "$2,800", status: "Pendiente" },
              { date: "15/11/2025", concept: "Servicios públicos", category: "Servicios", amount: "$3,150", status: "Pagado" },
            ].map((egreso, idx) => (
              <tr key={idx} className="border-t" style={{ borderColor: "var(--color-border-subtle)" }}>
                <td className="px-6 py-4" style={{ color: "var(--color-text-main)" }}>
                  {egreso.date}
                </td>
                <td className="px-6 py-4" style={{ color: "var(--color-text-main)" }}>
                  {egreso.concept}
                </td>
                <td className="px-6 py-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: "var(--color-primary-soft)",
                      color: "var(--color-primary)",
                    }}
                  >
                    {egreso.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold" style={{ color: "var(--color-error)" }}>
                  {egreso.amount}
                </td>
                <td className="px-6 py-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: egreso.status === "Pagado" ? "var(--color-success)" : "var(--color-warning)",
                      color: "white",
                    }}
                  >
                    {egreso.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

