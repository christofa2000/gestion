"use client";

import { Button, Card, Input } from "@gestion/ui";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement authentication with Supabase
    console.log("Login:", { email, password });
  };

  return (
    <Card padding="lg">
      <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label="Email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          label="Contraseña"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="primary" className="w-full">
          Iniciar Sesión
        </Button>
      </form>
      <div className="mt-4 text-center text-sm text-[var(--color-text-muted)]">
        ¿No tienes cuenta?{" "}
        <Link href="/auth/register" className="text-[var(--color-primary)] hover:underline">
          Regístrate
        </Link>
      </div>
    </Card>
  );
}

