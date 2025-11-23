export default function PagosPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>
            Gestión de Pagos
          </h1>
          <p style={{ color: "var(--color-text-muted)" }}>
            Control de ingresos y cobros
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-lg font-medium text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          + Registrar Pago
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
            Total Cobrado (Mes)
          </p>
          <p className="text-3xl font-bold" style={{ color: "var(--color-success)" }}>
            $45,290
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
          <p className="text-3xl font-bold" style={{ color: "var(--color-warning)" }}>
            $8,500
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
            Total Pagos
          </p>
          <p className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>
            156
          </p>
        </div>
      </div>

      {/* Payments Table */}
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
                Cliente
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: "var(--color-text-main)" }}>
                Concepto
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
              { date: "23/11/2025", client: "Juan Doe", concept: "Mensualidad Noviembre", amount: "$2,500", status: "Pagado" },
              { date: "22/11/2025", client: "María García", concept: "Clase Individual", amount: "$1,200", status: "Pagado" },
              { date: "21/11/2025", client: "Carlos López", concept: "Mensualidad Noviembre", amount: "$2,500", status: "Pendiente" },
              { date: "20/11/2025", client: "Ana Martínez", concept: "Pack 10 Clases", amount: "$8,000", status: "Pagado" },
            ].map((pago, idx) => (
              <tr key={idx} className="border-t" style={{ borderColor: "var(--color-border-subtle)" }}>
                <td className="px-6 py-4" style={{ color: "var(--color-text-main)" }}>
                  {pago.date}
                </td>
                <td className="px-6 py-4" style={{ color: "var(--color-text-main)" }}>
                  {pago.client}
                </td>
                <td className="px-6 py-4" style={{ color: "var(--color-text-main)" }}>
                  {pago.concept}
                </td>
                <td className="px-6 py-4 font-bold" style={{ color: "var(--color-text-main)" }}>
                  {pago.amount}
                </td>
                <td className="px-6 py-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: pago.status === "Pagado" ? "var(--color-success)" : "var(--color-warning)",
                      color: "white",
                    }}
                  >
                    {pago.status}
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

