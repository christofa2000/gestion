export default function PreciosPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--color-text-main)" }}>
          Planes y Precios
        </h1>
        <p className="text-lg" style={{ color: "var(--color-text-muted)" }}>
          Elige el plan perfecto para tu club deportivo
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Plan Básico */}
        <div
          className="p-8 rounded-xl border"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border-subtle)",
          }}
        >
          <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text-main)" }}>
            Básico
          </h3>
          <div className="mb-6">
            <span className="text-4xl font-bold" style={{ color: "var(--color-primary)" }}>
              $29
            </span>
            <span style={{ color: "var(--color-text-muted)" }}> /mes</span>
          </div>
          <ul className="space-y-3 mb-8">
            <li style={{ color: "var(--color-text-main)" }}>✓ Hasta 50 clientes</li>
            <li style={{ color: "var(--color-text-main)" }}>✓ Gestión de turnos</li>
            <li style={{ color: "var(--color-text-main)" }}>✓ Reportes básicos</li>
          </ul>
          <button
            className="w-full py-3 rounded-lg font-medium border"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-main)",
            }}
          >
            Comenzar
          </button>
        </div>

        {/* Plan Pro */}
        <div
          className="p-8 rounded-xl border-2 relative"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-primary)",
          }}
        >
          <div
            className="absolute top-0 right-0 px-3 py-1 rounded-bl-lg rounded-tr-lg text-xs font-medium text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Popular
          </div>
          <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text-main)" }}>
            Pro
          </h3>
          <div className="mb-6">
            <span className="text-4xl font-bold" style={{ color: "var(--color-primary)" }}>
              $79
            </span>
            <span style={{ color: "var(--color-text-muted)" }}> /mes</span>
          </div>
          <ul className="space-y-3 mb-8">
            <li style={{ color: "var(--color-text-main)" }}>✓ Clientes ilimitados</li>
            <li style={{ color: "var(--color-text-main)" }}>✓ Múltiples sedes</li>
            <li style={{ color: "var(--color-text-main)" }}>✓ Reportes avanzados</li>
            <li style={{ color: "var(--color-text-main)" }}>✓ Portal de alumnos</li>
          </ul>
          <button
            className="w-full py-3 rounded-lg font-medium text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Comenzar
          </button>
        </div>

        {/* Plan Enterprise */}
        <div
          className="p-8 rounded-xl border"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border-subtle)",
          }}
        >
          <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text-main)" }}>
            Enterprise
          </h3>
          <div className="mb-6">
            <span className="text-4xl font-bold" style={{ color: "var(--color-primary)" }}>
              Custom
            </span>
          </div>
          <ul className="space-y-3 mb-8">
            <li style={{ color: "var(--color-text-main)" }}>✓ Todo de Pro</li>
            <li style={{ color: "var(--color-text-main)" }}>✓ Soporte prioritario</li>
            <li style={{ color: "var(--color-text-main)" }}>✓ Integración personalizada</li>
            <li style={{ color: "var(--color-text-main)" }}>✓ Capacitación incluida</li>
          </ul>
          <button
            className="w-full py-3 rounded-lg font-medium border"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-main)",
            }}
          >
            Contactar
          </button>
        </div>
      </div>
    </div>
  );
}

