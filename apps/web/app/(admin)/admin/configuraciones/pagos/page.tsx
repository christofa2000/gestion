export default function ConfiguracionPagosPage() {
  return (
    <div>
      <div className="mb-6">
        <a href="/admin/configuraciones" className="text-sm mb-2 inline-block" style={{ color: "var(--color-primary)" }}>
          ← Volver a configuraciones
        </a>
        <h1 className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>
          Métodos de Pago
        </h1>
        <p style={{ color: "var(--color-text-muted)" }}>
          Configura las formas de cobro disponibles
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        <div
          className="rounded-xl border p-6"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border-subtle)",
          }}
        >
          <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--color-text-main)" }}>
            Métodos Disponibles
          </h2>
          <div className="space-y-3">
            {[
              { name: "Efectivo", enabled: true },
              { name: "Transferencia Bancaria", enabled: true },
              { name: "Tarjeta de Crédito", enabled: true },
              { name: "Tarjeta de Débito", enabled: true },
              { name: "Mercado Pago", enabled: false },
            ].map((metodo, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-lg border"
                style={{ borderColor: "var(--color-border-subtle)" }}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked={metodo.enabled}
                    className="w-5 h-5 rounded"
                    style={{ accentColor: "var(--color-primary)" }}
                  />
                  <span className="font-medium" style={{ color: "var(--color-text-main)" }}>
                    {metodo.name}
                  </span>
                </div>
                <button className="text-sm" style={{ color: "var(--color-primary)" }}>
                  Configurar
                </button>
              </div>
            ))}
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
            Datos Bancarios
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-main)" }}>
                CBU / Alias
              </label>
              <input
                type="text"
                placeholder="0000003100012345678901"
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border-subtle)",
                  color: "var(--color-text-main)",
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-main)" }}>
                Banco
              </label>
              <input
                type="text"
                placeholder="Banco Ejemplo"
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border-subtle)",
                  color: "var(--color-text-main)",
                }}
              />
            </div>
          </div>
        </div>

        <button
          className="px-6 py-3 rounded-lg font-medium text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}




