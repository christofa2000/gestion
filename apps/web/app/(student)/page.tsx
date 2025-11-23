import { Card } from "@gestion/ui";

export default function StudentDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mi Panel</h1>
        <p className="text-[var(--color-text-muted)]">
          Bienvenido a tu panel de estudiante
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-2">Mis Actividades</h3>
          <p className="text-3xl font-bold text-[var(--color-primary)]">0</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Actividades inscritas</p>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-2">Próximos Eventos</h3>
          <p className="text-3xl font-bold text-[var(--color-primary)]">0</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Esta semana</p>
        </Card>
      </div>

      <Card padding="lg">
        <h3 className="text-xl font-semibold mb-4">Actividad Reciente</h3>
        <p className="text-[var(--color-text-muted)]">
          No hay actividad reciente para mostrar.
        </p>
      </Card>
    </div>
  );
}

