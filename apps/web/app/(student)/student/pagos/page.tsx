export default function PagosStudentPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>
          Mis Pagos
        </h1>
        <p style={{ color: "var(--color-text-muted)" }}>
          Historial de pagos y estado de cuenta
        </p>
      </div>

      {/* Account Status */}
      <div
        className="rounded-xl border p-6 mb-6"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border-subtle)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold" style={{ color: "var(--color-text-main)" }}>
            Estado de Cuenta
          </h2>
          <span
            className="px-4 py-2 rounded-full font-medium"
            style={{ backgroundColor: "var(--color-success)", color: "white" }}
          >
            ✓ Al día
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm mb-1" style={{ color: "var(--color-text-muted)" }}>
              Último Pago
            </p>
            <p className="text-2xl font-bold" style={{ color: "var(--color-text-main)" }}>
              $2,500
            </p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              20/11/2025
            </p>
          </div>
          <div>
            <p className="text-sm mb-1" style={{ color: "var(--color-text-muted)" }}>
              Próximo Vencimiento
            </p>
            <p className="text-2xl font-bold" style={{ color: "var(--color-text-main)" }}>
              $2,500
            </p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              01/12/2025
            </p>
          </div>
          <div>
            <p className="text-sm mb-1" style={{ color: "var(--color-text-muted)" }}>
              Total Año
            </p>
            <p className="text-2xl font-bold" style={{ color: "var(--color-text-main)" }}>
              $28,000
            </p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              12 pagos
            </p>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border-subtle)",
        }}
      >
        <div className="p-6 border-b" style={{ borderColor: "var(--color-border-subtle)" }}>
          <h2 className="text-xl font-semibold" style={{ color: "var(--color-text-main)" }}>
            Historial de Pagos
          </h2>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--color-border-subtle)" }}>
          {[
            { date: "20/11/2025", concept: "Mensualidad Noviembre", amount: "$2,500", method: "Transferencia", status: "Pagado" },
            { date: "20/10/2025", concept: "Mensualidad Octubre", amount: "$2,500", method: "Efectivo", status: "Pagado" },
            { date: "20/09/2025", concept: "Mensualidad Septiembre", amount: "$2,500", method: "Transferencia", status: "Pagado" },
            { date: "20/08/2025", concept: "Mensualidad Agosto", amount: "$2,500", method: "Tarjeta", status: "Pagado" },
          ].map((pago, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium mb-1" style={{ color: "var(--color-text-main)" }}>
                  {pago.concept}
                </p>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  {pago.date} • {pago.method}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg" style={{ color: "var(--color-text-main)" }}>
                  {pago.amount}
                </p>
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-medium mt-1"
                  style={{ backgroundColor: "var(--color-success)", color: "white" }}
                >
                  {pago.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6 text-center">
        <button
          className="px-6 py-3 rounded-lg font-medium text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          Realizar Pago
        </button>
      </div>
    </div>
  );
}

