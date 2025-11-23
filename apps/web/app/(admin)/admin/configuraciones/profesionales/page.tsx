export default function ConfiguracionProfesionalesPage() {
  return (
    <div>
      <div className="mb-6">
        <a href="/admin/configuraciones" className="text-sm mb-2 inline-block" style={{ color: "var(--color-primary)" }}>
          ← Volver a configuraciones
        </a>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>
              Profesionales
            </h1>
            <p style={{ color: "var(--color-text-muted)" }}>
              Profesores, entrenadores y staff
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-lg font-medium text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            + Nuevo Profesional
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: "Juan Pérez", role: "Profesor de Tenis", specialty: "Tenis avanzado", status: "Activo" },
          { name: "María García", role: "Profesora de Pádel", specialty: "Pádel principiantes", status: "Activo" },
          { name: "Carlos López", role: "Entrenador", specialty: "Preparación física", status: "Activo" },
        ].map((prof, idx) => (
          <div
            key={idx}
            className="rounded-xl border p-6"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border-subtle)",
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl text-white"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {prof.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: "var(--color-text-main)" }}>
                  {prof.name}
                </h3>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  {prof.role}
                </p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-sm" style={{ color: "var(--color-text-main)" }}>
                <strong>Especialidad:</strong> {prof.specialty}
              </p>
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: "var(--color-success)", color: "white" }}
              >
                {prof.status}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                className="flex-1 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: "var(--color-primary-soft)",
                  color: "var(--color-primary)",
                }}
              >
                Editar
              </button>
              <button
                className="flex-1 py-2 rounded-lg text-sm font-medium border"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-main)",
                }}
              >
                Horarios
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

