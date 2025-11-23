"use client";

import { Button, Card, Input } from "@gestion/ui";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    // TODO: Implement registration with Supabase
    console.log("Register:", { email, password });
  };

  return (
    <Card padding="lg">
      <h2 className="text-2xl font-bold text-center mb-6">Crear Cuenta</h2>
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
        <Input
          type="password"
          label="Confirmar Contraseña"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="primary" className="w-full">
          Registrarse
        </Button>
      </form>
      <div className="mt-4 text-center text-sm text-[var(--color-text-muted)]">
        ¿Ya tienes cuenta?{" "}
        <Link href="/auth/login" className="text-[var(--color-primary)] hover:underline">
          Inicia sesión
        </Link>
      </div>
    </Card>
  );
}

