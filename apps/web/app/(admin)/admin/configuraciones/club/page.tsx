export default function ConfiguracionClubPage() {
  return (
    <div>
      <div className="mb-6">
        <a href="/admin/configuraciones" className="text-sm mb-2 inline-block" style={{ color: "var(--color-primary)" }}>
          ← Volver a configuraciones
        </a>
        <h1 className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>
          Datos del Club
        </h1>
        <p style={{ color: "var(--color-text-muted)" }}>
          Información general y personalización
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* General Info */}
        <div
          className="rounded-xl border p-6"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border-subtle)",
          }}
        >
          <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--color-text-main)" }}>
            Información General
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-main)" }}>
                Nombre del Club
              </label>
              <input
                type="text"
                defaultValue="Club Deportivo Ejemplo"
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
                Email de contacto
              </label>
              <input
                type="email"
                defaultValue="contacto@club.com"
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
                Teléfono
              </label>
              <input
                type="tel"
                defaultValue="+54 11 1234-5678"
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

        {/* Logo */}
        <div
          className="rounded-xl border p-6"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border-subtle)",
          }}
        >
          <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--color-text-main)" }}>
            Logo del Club
          </h2>
          <div className="flex items-center gap-6">
            <div
              className="w-24 h-24 rounded-lg flex items-center justify-center text-2xl font-bold text-white"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              C
            </div>
            <div>
              <button
                className="px-4 py-2 rounded-lg font-medium text-white mb-2"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Subir Logo
              </button>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                Formato PNG o JPG. Máximo 2MB.
              </p>
            </div>
          </div>
        </div>

        {/* Theme */}
        <div
          className="rounded-xl border p-6"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border-subtle)",
          }}
        >
          <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--color-text-main)" }}>
            Tema de Colores
          </h2>
          <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
            Selecciona el tema visual que mejor represente tu club
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: "Sky", color: "#0284c7" },
              { name: "Sport", color: "#ea580c" },
              { name: "Neutral", color: "#404040" },
            ].map((theme) => (
              <button
                key={theme.name}
                className="p-4 rounded-lg border text-center hover:border-2 transition-all"
                style={{
                  borderColor: "var(--color-border-subtle)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: theme.color }}
                />
                <p className="font-medium text-sm" style={{ color: "var(--color-text-main)" }}>
                  {theme.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            className="px-6 py-3 rounded-lg font-medium text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Guardar Cambios
          </button>
          <button
            className="px-6 py-3 rounded-lg font-medium border"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-main)",
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

