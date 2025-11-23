export default function TurnosPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>
            Gestión de Turnos
          </h1>
          <p style={{ color: "var(--color-text-muted)" }}>
            Administra reservas y horarios
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-lg font-medium text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          + Nuevo Turno
        </button>
      </div>

      {/* Calendar View Placeholder */}
      <div
        className="rounded-xl border p-8 text-center mb-6"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border-subtle)",
        }}
      >
        <p className="text-lg font-medium mb-2" style={{ color: "var(--color-text-main)" }}>
          Vista de Calendario
        </p>
        <p style={{ color: "var(--color-text-muted)" }}>
          Aquí se integrará un calendario interactivo con disponibilidad de turnos
        </p>
      </div>

      {/* Today's Appointments */}
      <div
        className="rounded-xl border p-6"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border-subtle)",
        }}
      >
        <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--color-text-main)" }}>
          Turnos de Hoy
        </h2>
        <div className="space-y-4">
          {[
            { time: "09:00", client: "Juan Doe", activity: "Tenis", court: "Cancha 1" },
            { time: "10:00", client: "María García", activity: "Pádel", court: "Cancha 2" },
            { time: "11:00", client: "Carlos López", activity: "Tenis", court: "Cancha 1" },
            { time: "14:00", client: "Ana Martínez", activity: "Pádel", court: "Cancha 3" },
          ].map((turno, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 rounded-lg border"
              style={{ borderColor: "var(--color-border-subtle)" }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="px-4 py-2 rounded-lg font-mono font-bold"
                  style={{
                    backgroundColor: "var(--color-primary-soft)",
                    color: "var(--color-primary)",
                  }}
                >
                  {turno.time}
                </div>
                <div>
                  <p className="font-medium" style={{ color: "var(--color-text-main)" }}>
                    {turno.client}
                  </p>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    {turno.activity} • {turno.court}
                  </p>
                </div>
              </div>
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: "var(--color-success)",
                  color: "white",
                }}
              >
                Marcar Asistencia
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

