"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    clubName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrar con Supabase Auth en el próximo paso
    console.log("Register:", formData);
    
    // Redirigir al login
    window.location.href = "/auth/login";
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text-main)" }}>
        Crear Cuenta
      </h2>
      <p className="mb-6" style={{ color: "var(--color-text-muted)" }}>
        Regístrate y empieza a gestionar tu club
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--color-text-main)" }}
          >
            Nombre completo
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-4 py-2 rounded-lg border"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border-subtle)",
              color: "var(--color-text-main)",
            }}
            required
          />
        </div>

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
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full px-4 py-2 rounded-lg border"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border-subtle)",
              color: "var(--color-text-main)",
            }}
            required
          />
        </div>

        <div>
          <label
            htmlFor="clubName"
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--color-text-main)" }}
          >
            Nombre del club
          </label>
          <input
            type="text"
            id="clubName"
            value={formData.clubName}
            onChange={(e) => handleChange("clubName", e.target.value)}
            className="w-full px-4 py-2 rounded-lg border"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border-subtle)",
              color: "var(--color-text-main)",
            }}
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
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className="w-full px-4 py-2 rounded-lg border"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border-subtle)",
              color: "var(--color-text-main)",
            }}
            required
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--color-text-main)" }}
          >
            Confirmar contraseña
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            className="w-full px-4 py-2 rounded-lg border"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border-subtle)",
              color: "var(--color-text-main)",
            }}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg font-medium text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          Crear Cuenta
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          ¿Ya tienes cuenta?{" "}
        </span>
        <Link href="/auth/login" className="text-sm font-medium" style={{ color: "var(--color-primary)" }}>
          Inicia sesión
        </Link>
      </div>
    </div>
  );
}

