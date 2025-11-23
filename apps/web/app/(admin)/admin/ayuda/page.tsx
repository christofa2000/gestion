export default function AyudaPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>
          Centro de Ayuda
        </h1>
        <p style={{ color: "var(--color-text-muted)" }}>
          Documentación y recursos útiles
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            title: "Guía de Inicio Rápido",
            description: "Aprende los conceptos básicos para comenzar a usar el sistema",
            icon: "🚀",
          },
          {
            title: "Gestión de Clientes",
            description: "Cómo agregar, editar y administrar tu base de clientes",
            icon: "👥",
          },
          {
            title: "Sistema de Turnos",
            description: "Configura horarios, reservas y disponibilidad",
            icon: "📅",
          },
          {
            title: "Reportes y Estadísticas",
            description: "Genera informes y analiza el rendimiento de tu club",
            icon: "📊",
          },
          {
            title: "Soporte Técnico",
            description: "Contacta con nuestro equipo de soporte",
            icon: "💬",
          },
          {
            title: "Preguntas Frecuentes",
            description: "Respuestas a las dudas más comunes",
            icon: "❓",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border p-6 hover:shadow-md transition-all cursor-pointer"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border-subtle)",
            }}
          >
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--color-text-main)" }}>
              {item.title}
            </h3>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <div
        className="mt-8 rounded-xl border p-6 text-center"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border-subtle)",
        }}
      >
        <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--color-text-main)" }}>
          ¿No encuentras lo que buscas?
        </h3>
        <p className="mb-4" style={{ color: "var(--color-text-muted)" }}>
          Contáctanos directamente y te ayudaremos
        </p>
        <button
          className="px-6 py-3 rounded-lg font-medium text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          Contactar Soporte
        </button>
      </div>
    </div>
  );
}

