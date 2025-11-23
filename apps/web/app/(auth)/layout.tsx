import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div
              className="h-12 w-12 rounded-lg flex items-center justify-center font-bold text-white text-xl"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              G
            </div>
          </Link>
          <h1 className="text-2xl font-bold mt-4" style={{ color: "var(--color-text-main)" }}>
            Gestión Multi-Club
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>
            Sistema de gestión para clubes deportivos
          </p>
        </div>

        {/* Auth Card */}
        <div
          className="rounded-xl p-8 shadow-lg border"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border-subtle)",
          }}
        >
          {children}
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
