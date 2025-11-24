export default function PerfilPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>
          Mi Perfil
        </h1>
        <p style={{ color: "var(--color-text-muted)" }}>
          Información personal y configuración
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile Header */}
        <div
          className="rounded-xl border p-6"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border-subtle)",
          }}
        >
          <div className="flex items-center gap-6">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center font-bold text-3xl text-white"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              JD
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--color-text-main)" }}>
                Juan Doe
              </h2>
              <p style={{ color: "var(--color-text-muted)" }}>
                juan.doe@email.com
              </p>
              <button
                className="mt-2 px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: "var(--color-primary-soft)",
                  color: "var(--color-primary)",
                }}
              >
                Cambiar Foto
              </button>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div
          className="rounded-xl border p-6"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border-subtle)",
          }}
        >
          <h3 className="text-xl font-semibold mb-4" style={{ color: "var(--color-text-main)" }}>
            Información Personal
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-main)" }}>
                Nombre completo
              </label>
              <input
                type="text"
                defaultValue="Juan Doe"
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
                Email
              </label>
              <input
                type="email"
                defaultValue="juan.doe@email.com"
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
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-main)" }}>
                Fecha de nacimiento
              </label>
              <input
                type="date"
                defaultValue="1990-03-15"
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

        {/* Security */}
        <div
          className="rounded-xl border p-6"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border-subtle)",
          }}
        >
          <h3 className="text-xl font-semibold mb-4" style={{ color: "var(--color-text-main)" }}>
            Seguridad
          </h3>
          <button
            className="px-4 py-2 rounded-lg font-medium border"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-main)",
            }}
          >
            Cambiar Contraseña
          </button>
        </div>

        {/* Actions */}
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




