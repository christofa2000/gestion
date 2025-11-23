export default function StudentHomePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>
          Bienvenido, Juan 👋
        </h1>
        <p style={{ color: "var(--color-text-muted)" }}>
          Aquí puedes gestionar tus clases y pagos
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div
          className="p-4 rounded-xl border"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border-subtle)",
          }}
        >
          <p className="text-sm mb-1" style={{ color: "var(--color-text-muted)" }}>
            Próxima Clase
          </p>
          <p className="text-2xl font-bold" style={{ color: "var(--color-text-main)" }}>
            Hoy 16:00
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
            Tenis - Cancha 1
          </p>
        </div>

        <div
          className="p-4 rounded-xl border"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border-subtle)",
          }}
        >
          <p className="text-sm mb-1" style={{ color: "var(--color-text-muted)" }}>
            Estado de Cuenta
          </p>
          <p className="text-2xl font-bold" style={{ color: "var(--color-success)" }}>
            Al día
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
            Último pago: $2,500
          </p>
        </div>

        <div
          className="p-4 rounded-xl border"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border-subtle)",
          }}
        >
          <p className="text-sm mb-1" style={{ color: "var(--color-text-muted)" }}>
            Clases este Mes
          </p>
          <p className="text-2xl font-bold" style={{ color: "var(--color-text-main)" }}>
            12
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
            4 más programadas
          </p>
        </div>
      </div>

      {/* Upcoming Classes */}
      <div
        className="rounded-xl border p-6"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border-subtle)",
        }}
      >
        <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--color-text-main)" }}>
          Próximas Clases
        </h2>
        <div className="space-y-3">
          {[
            { date: "Hoy 16:00", activity: "Clase de Tenis", location: "Cancha 1", professor: "Juan Pérez" },
            { date: "Mañana 10:00", activity: "Clase de Tenis", location: "Cancha 2", professor: "Juan Pérez" },
            { date: "Viernes 16:00", activity: "Clase de Tenis", location: "Cancha 1", professor: "Juan Pérez" },
          ].map((clase, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 rounded-lg border"
              style={{ borderColor: "var(--color-border-subtle)" }}
            >
              <div>
                <p className="font-medium mb-1" style={{ color: "var(--color-text-main)" }}>
                  {clase.activity}
                </p>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  {clase.date} • {clase.location} • Prof. {clase.professor}
                </p>
              </div>
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium border"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-main)",
                }}
              >
                Ver Detalles
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

