export default function HomePage() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-5xl font-bold mb-6" style={{ color: "var(--color-text-main)" }}>
          Gestión Completa para tu Club Deportivo
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
          Sistema multi-tenant que te permite gestionar clientes, turnos, pagos y estadísticas de
          forma profesional.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/demo"
            className="px-8 py-3 rounded-lg font-medium text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Probar Demo
          </a>
          <a
            href="/auth/register"
            className="px-8 py-3 rounded-lg font-medium border"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-main)",
            }}
          >
            Registrarse Gratis
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: "var(--color-text-main)" }}>
          Características Principales
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div
            className="p-6 rounded-xl border"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border-subtle)",
            }}
          >
            <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--color-text-main)" }}>
              Gestión de Clientes
            </h3>
            <p style={{ color: "var(--color-text-muted)" }}>
              Administra tu base de alumnos con información completa, historial y estadísticas.
            </p>
          </div>
          <div
            className="p-6 rounded-xl border"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border-subtle)",
            }}
          >
            <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--color-text-main)" }}>
              Turnos Inteligentes
            </h3>
            <p style={{ color: "var(--color-text-muted)" }}>
              Sistema de reservas flexible con notificaciones automáticas y recordatorios.
            </p>
          </div>
          <div
            className="p-6 rounded-xl border"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border-subtle)",
            }}
          >
            <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--color-text-main)" }}>
              Control Financiero
            </h3>
            <p style={{ color: "var(--color-text-muted)" }}>
              Gestión completa de pagos, egresos y reportes financieros detallados.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

