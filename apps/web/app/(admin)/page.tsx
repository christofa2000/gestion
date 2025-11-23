import { Card } from "@gestion/ui";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard Admin</h1>
        <p className="text-[var(--color-text-muted)]">
          Bienvenido al panel de administración
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-2">Usuarios</h3>
          <p className="text-3xl font-bold text-[var(--color-primary)]">0</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Total de usuarios</p>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-2">Clubes</h3>
          <p className="text-3xl font-bold text-[var(--color-primary)]">0</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Clubes activos</p>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-2">Actividades</h3>
          <p className="text-3xl font-bold text-[var(--color-primary)]">0</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Este mes</p>
        </Card>
      </div>

      <Card padding="lg">
        <h3 className="text-xl font-semibold mb-4">Acciones rápidas</h3>
        <p className="text-[var(--color-text-muted)]">
          Aquí puedes gestionar clubes, usuarios y configuraciones del sistema.
        </p>
      </Card>
    </div>
  );
}

