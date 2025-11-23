"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrar con Supabase Auth en el próximo paso
    console.log("Login:", { email, password });
    
    // Mock: guardar estado de autenticación
    localStorage.setItem("mock_authenticated", "true");
    localStorage.setItem("mock_user_role", "club_admin");
    
    // Redirigir al admin
    window.location.href = "/admin";
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text-main)" }}>
        Iniciar Sesión
      </h2>
      <p className="mb-6" style={{ color: "var(--color-text-muted)" }}>
        Accede a tu panel de administración
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--color-text-main)" }}
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border-subtle)",
              color: "var(--color-text-main)",
            }}
            placeholder="tu@email.com"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--color-text-main)" }}
          >
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border-subtle)",
              color: "var(--color-text-main)",
            }}
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded"
              style={{ accentColor: "var(--color-primary)" }}
            />
            <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Recordarme
            </span>
          </label>
          <Link
            href="/auth/recover"
            className="text-sm"
            style={{ color: "var(--color-primary)" }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg font-medium text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          Iniciar Sesión
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          ¿No tienes cuenta?{" "}
        </span>
        <Link href="/auth/register" className="text-sm font-medium" style={{ color: "var(--color-primary)" }}>
          Regístrate aquí
        </Link>
      </div>
    </div>
  );
}

