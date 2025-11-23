export default function TurnoDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <div className="mb-6">
        <a href="/admin/turnos" className="text-sm mb-2 inline-block" style={{ color: "var(--color-primary)" }}>
          ← Volver a turnos
        </a>
        <h1 className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>
          Detalle del Turno
        </h1>
        <p style={{ color: "var(--color-text-muted)" }}>ID: {params.id}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div
            className="rounded-xl border p-6"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border-subtle)",
            }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--color-text-main)" }}>
              Información del Turno
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm mb-1" style={{ color: "var(--color-text-muted)" }}>
                  Cliente
                </p>
                <p className="font-medium" style={{ color: "var(--color-text-main)" }}>
                  Juan Doe
                </p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: "var(--color-text-muted)" }}>
                  Actividad
                </p>
                <p className="font-medium" style={{ color: "var(--color-text-main)" }}>
                  Clase de Tenis
                </p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: "var(--color-text-muted)" }}>
                  Fecha y hora
                </p>
                <p className="font-medium" style={{ color: "var(--color-text-main)" }}>
                  25/11/2025 - 10:00 AM
                </p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: "var(--color-text-muted)" }}>
                  Duración
                </p>
                <p className="font-medium" style={{ color: "var(--color-text-main)" }}>
                  60 minutos
                </p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: "var(--color-text-muted)" }}>
                  Sede
                </p>
                <p className="font-medium" style={{ color: "var(--color-text-main)" }}>
                  Sede Principal
                </p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: "var(--color-text-muted)" }}>
                  Cancha/Espacio
                </p>
                <p className="font-medium" style={{ color: "var(--color-text-main)" }}>
                  Cancha 1
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div
            className="rounded-xl border p-6"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border-subtle)",
            }}
          >
            <h3 className="font-semibold mb-4" style={{ color: "var(--color-text-main)" }}>
              Estado
            </h3>
            <span
              className="px-4 py-2 rounded-full text-sm font-medium inline-block mb-4"
              style={{ backgroundColor: "var(--color-success)", color: "white" }}
            >
              Confirmado
            </span>
            <div className="space-y-2 mt-4">
              <button
                className="w-full py-2 rounded-lg font-medium text-white"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Editar Turno
              </button>
              <button
                className="w-full py-2 rounded-lg font-medium border"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text-main)" }}
              >
                Cancelar Turno
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

