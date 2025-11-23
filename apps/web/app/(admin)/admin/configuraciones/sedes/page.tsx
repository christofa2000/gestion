export default function ConfiguracionSedesPage() {
  return (
    <div>
      <div className="mb-6">
        <a href="/admin/configuraciones" className="text-sm mb-2 inline-block" style={{ color: "var(--color-primary)" }}>
          ← Volver a configuraciones
        </a>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>
              Sedes
            </h1>
            <p style={{ color: "var(--color-text-muted)" }}>
              Gestiona las ubicaciones de tu club
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-lg font-medium text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            + Nueva Sede
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((sede) => (
          <div
            key={sede}
            className="rounded-xl border p-6"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border-subtle)",
            }}
          >
            <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--color-text-main)" }}>
              Sede Principal
            </h3>
            <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
              Av. Libertador 1234, CABA
            </p>
            <div className="space-y-2">
              <p className="text-sm" style={{ color: "var(--color-text-main)" }}>
                <strong>Canchas:</strong> 4 (Tenis), 2 (Pádel)
              </p>
              <p className="text-sm" style={{ color: "var(--color-text-main)" }}>
                <strong>Horario:</strong> Lun-Dom 8:00-22:00
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: "var(--color-primary-soft)",
                  color: "var(--color-primary)",
                }}
              >
                Editar
              </button>
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium border"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-main)",
                }}
              >
                Gestionar Canchas
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

