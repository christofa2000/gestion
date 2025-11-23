export default function MisTurnosPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>
          Mis Turnos
        </h1>
        <p style={{ color: "var(--color-text-muted)" }}>
          Historial y reservas activas
        </p>
      </div>

      {/* Upcoming Bookings */}
      <div
        className="rounded-xl border p-6 mb-6"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border-subtle)",
        }}
      >
        <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--color-text-main)" }}>
          Reservas Activas
        </h2>
        <div className="space-y-4">
          {[
            {
              date: "Hoy 16:00",
              activity: "Clase de Tenis Individual",
              location: "Cancha 1",
              professor: "Juan Pérez",
              status: "Confirmado",
            },
            {
              date: "Mañana 10:00",
              activity: "Clase de Tenis Individual",
              location: "Cancha 2",
              professor: "Juan Pérez",
              status: "Confirmado",
            },
            {
              date: "Viernes 16:00",
              activity: "Clase de Tenis Individual",
              location: "Cancha 1",
              professor: "Juan Pérez",
              status: "Confirmado",
            },
          ].map((turno, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border"
              style={{ borderColor: "var(--color-border-subtle)" }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: "var(--color-success)", color: "white" }}
                    >
                      {turno.status}
                    </span>
                  </div>
                  <p className="font-semibold text-lg mb-1" style={{ color: "var(--color-text-main)" }}>
                    {turno.activity}
                  </p>
                  <p className="text-sm mb-1" style={{ color: "var(--color-text-muted)" }}>
                    📅 {turno.date}
                  </p>
                  <p className="text-sm mb-1" style={{ color: "var(--color-text-muted)" }}>
                    📍 {turno.location}
                  </p>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    👨‍🏫 Prof. {turno.professor}
                  </p>
                </div>
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ backgroundColor: "var(--color-error)" }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Bookings */}
      <div
        className="rounded-xl border p-6"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border-subtle)",
        }}
      >
        <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--color-text-main)" }}>
          Historial
        </h2>
        <div className="space-y-3">
          {[
            { date: "20/11/2025 16:00", activity: "Clase de Tenis", status: "Completado" },
            { date: "18/11/2025 10:00", activity: "Clase de Tenis", status: "Completado" },
            { date: "15/11/2025 16:00", activity: "Clase de Tenis", status: "Completado" },
            { date: "13/11/2025 10:00", activity: "Clase de Tenis", status: "Cancelado" },
          ].map((turno, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ backgroundColor: "var(--color-bg)" }}
            >
              <div>
                <p className="font-medium" style={{ color: "var(--color-text-main)" }}>
                  {turno.activity}
                </p>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  {turno.date}
                </p>
              </div>
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor:
                    turno.status === "Completado" ? "var(--color-success)" : "var(--color-text-muted)",
                  color: "white",
                }}
              >
                {turno.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

