export default function DemoPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--color-text-main)" }}>
          Solicita una Demo
        </h1>
        <p className="text-lg" style={{ color: "var(--color-text-muted)" }}>
          Descubre cómo nuestra plataforma puede transformar la gestión de tu club
        </p>
      </div>

      <div
        className="p-8 rounded-xl border"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border-subtle)",
        }}
      >
        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--color-text-main)" }}
              >
                Nombre
              </label>
              <input
                type="text"
                id="firstName"
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border-subtle)",
                  color: "var(--color-text-main)",
                }}
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--color-text-main)" }}
              >
                Apellido
              </label>
              <input
                type="text"
                id="lastName"
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border-subtle)",
                  color: "var(--color-text-main)",
                }}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--color-text-main)" }}
            >
              Email de trabajo
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border-subtle)",
                color: "var(--color-text-main)",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="clubName"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--color-text-main)" }}
            >
              Nombre del club
            </label>
            <input
              type="text"
              id="clubName"
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border-subtle)",
                color: "var(--color-text-main)",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--color-text-main)" }}
            >
              Teléfono
            </label>
            <input
              type="tel"
              id="phone"
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border-subtle)",
                color: "var(--color-text-main)",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--color-text-main)" }}
            >
              Notas adicionales
            </label>
            <textarea
              id="notes"
              rows={4}
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border-subtle)",
                color: "var(--color-text-main)",
              }}
              placeholder="Cuéntanos sobre tu club y tus necesidades..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-medium text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Solicitar Demo
          </button>
        </form>
      </div>
    </div>
  );
}




