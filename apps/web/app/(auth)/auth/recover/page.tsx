"use client";

import Link from "next/link";
import { useState } from "react";

export default function RecoverPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrar con Supabase Auth en el próximo paso
    console.log("Recover password for:", email);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: "var(--color-success)" }}
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text-main)" }}>
          Email Enviado
        </h2>
        <p className="mb-6" style={{ color: "var(--color-text-muted)" }}>
          Te hemos enviado un enlace para restablecer tu contraseña a <strong>{email}</strong>
        </p>
        <Link
          href="/auth/login"
          className="text-sm font-medium"
          style={{ color: "var(--color-primary)" }}
        >
          Volver al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text-main)" }}>
        Recuperar Contraseña
      </h2>
      <p className="mb-6" style={{ color: "var(--color-text-muted)" }}>
        Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
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

        <button
          type="submit"
          className="w-full py-3 rounded-lg font-medium text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          Enviar Enlace
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/auth/login" className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          ← Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}

