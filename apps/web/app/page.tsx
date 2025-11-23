import { Button, Card } from "@gestion/ui";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <Card padding="lg" className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4 text-[var(--color-primary)]">
          Gestión Deportiva
        </h1>
        <p className="text-lg text-[var(--color-text-muted)] mb-8">
          Sistema de gestión para clubes deportivos
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/auth/login">
            <Button variant="primary" size="lg">
              Iniciar Sesión
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="outline" size="lg">
              Panel Admin
            </Button>
          </Link>
          <Link href="/student">
            <Button variant="secondary" size="lg">
              Panel Estudiante
            </Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}

