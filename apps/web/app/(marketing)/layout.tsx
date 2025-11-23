import type { ReactNode } from "react";
import Link from "next/link";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className="border-b sticky top-0 z-50"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border-subtle)",
        }}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center font-bold text-white"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <span>G</span>
            </div>
            <span className="text-xl font-bold" style={{ color: "var(--color-text-main)" }}>
              Gestión Multi-Club
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/precios"
              className="text-sm font-medium hover:underline"
              style={{ color: "var(--color-text-muted)" }}
            >
              Precios
            </Link>
            <Link
              href="/contacto"
              className="text-sm font-medium hover:underline"
              style={{ color: "var(--color-text-muted)" }}
            >
              Contacto
            </Link>
            <Link
              href="/demo"
              className="text-sm font-medium hover:underline"
              style={{ color: "var(--color-text-muted)" }}
            >
              Demo
            </Link>
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Iniciar Sesión
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer
        className="border-t mt-12"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border-subtle)",
        }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4" style={{ color: "var(--color-text-main)" }}>
                Producto
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Características
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Precios
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4" style={{ color: "var(--color-text-main)" }}>
                Empresa
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4" style={{ color: "var(--color-text-main)" }}>
                Legal
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Términos
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4" style={{ color: "var(--color-text-main)" }}>
                Síguenos
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t" style={{ borderColor: "var(--color-border-subtle)" }}>
            <p className="text-sm text-center" style={{ color: "var(--color-text-muted)" }}>
              © 2025 Gestión Multi-Club. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
