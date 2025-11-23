export default function AgendaPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>
          Agenda de Clases
        </h1>
        <p style={{ color: "var(--color-text-muted)" }}>
          Reserva y gestiona tus horarios
        </p>
      </div>

      {/* Calendar Placeholder */}
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
          Aquí se mostrará un calendario interactivo con horarios disponibles para reservar
        </p>
      </div>

      {/* Available Time Slots */}
      <div
        className="rounded-xl border p-6"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border-subtle)",
        }}
      >
        <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--color-text-main)" }}>
          Horarios Disponibles - Hoy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { time: "14:00 - 15:00", court: "Cancha 1", available: true },
            { time: "15:00 - 16:00", court: "Cancha 2", available: true },
            { time: "16:00 - 17:00", court: "Cancha 1", available: false },
            { time: "17:00 - 18:00", court: "Cancha 3", available: true },
            { time: "18:00 - 19:00", court: "Cancha 1", available: true },
            { time: "19:00 - 20:00", court: "Cancha 2", available: false },
          ].map((slot, idx) => (
            <button
              key={idx}
              disabled={!slot.available}
              className={`p-4 rounded-lg border text-left transition-all ${
                slot.available ? "hover:shadow-md" : "opacity-50 cursor-not-allowed"
              }`}
              style={{
                borderColor: "var(--color-border-subtle)",
                backgroundColor: "var(--color-surface)",
              }}
            >
              <p className="font-bold mb-1" style={{ color: "var(--color-text-main)" }}>
                {slot.time}
              </p>
              <p className="text-sm mb-2" style={{ color: "var(--color-text-muted)" }}>
                {slot.court}
              </p>
              <span
                className="text-xs px-2 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: slot.available ? "var(--color-success)" : "var(--color-error)",
                  color: "white",
                }}
              >
                {slot.available ? "Disponible" : "Ocupado"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

