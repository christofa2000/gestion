import Link from "next/link";

export default function ConfiguracionesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: "var(--color-text-main)" }}>
          Configuraciones
        </h1>
        <p style={{ color: "var(--color-text-muted)" }}>
          Administra todos los aspectos de tu club
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Datos del Club",
            description: "Información general, logo y tema",
            href: "/admin/configuraciones/club",
            icon: "🏢",
          },
          {
            title: "Sedes",
            description: "Gestiona las sedes y ubicaciones",
            href: "/admin/configuraciones/sedes",
            icon: "📍",
          },
          {
            title: "Actividades",
            description: "Tipos de clases y servicios",
            href: "/admin/configuraciones/actividades",
            icon: "🎾",
          },
          {
            title: "Profesionales",
            description: "Profesores y entrenadores",
            href: "/admin/configuraciones/profesionales",
            icon: "👨‍🏫",
          },
          {
            title: "Métodos de Pago",
            description: "Formas de cobro y facturación",
            href: "/admin/configuraciones/pagos",
            icon: "💳",
          },
          {
            title: "Usuarios y Roles",
            description: "Gestión de accesos",
            href: "/admin/configuraciones/usuarios",
            icon: "👥",
          },
        ].map((config) => (
          <Link
            key={config.href}
            href={config.href}
            className="block p-6 rounded-xl border transition-all hover:shadow-md"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border-subtle)",
            }}
          >
            <div className="text-4xl mb-3">{config.icon}</div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--color-text-main)" }}>
              {config.title}
            </h3>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {config.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <Link
          href="/admin/ayuda"
          className="inline-flex items-center gap-2 text-sm"
          style={{ color: "var(--color-primary)" }}
        >
          ¿Necesitas ayuda? Ver documentación →
        </Link>
      </div>
    </div>
  );
}

