"use client";

import type { ReactNode } from "react";
import { StudentBottomNav } from "@repo/ui";
import { useThemeStore } from "../../lib/stores/theme-store";
import { useClubStore } from "../../lib/stores/club-store";
import { useEffect } from "react";

// Iconos temporales
const CalendarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CreditCardIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const navItems = [
  { href: "/student/agenda", icon: <CalendarIcon />, label: "Agenda" },
  { href: "/student/turnos", icon: <ClockIcon />, label: "Mis Turnos" },
  { href: "/student/pagos", icon: <CreditCardIcon />, label: "Pagos" },
  { href: "/student/perfil", icon: <UserIcon />, label: "Perfil" },
];

export default function StudentLayout({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useThemeStore();
  const { currentClub } = useClubStore();

  // Aplicar tema al body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className="min-h-screen pb-16 md:pb-0" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-10 border-b"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border-subtle)",
        }}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center font-bold text-white"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              C
            </div>
            <div>
              <h1 className="font-semibold" style={{ color: "var(--color-text-main)" }}>
                {currentClub?.name || "Mi Club"}
              </h1>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                Portal de Alumnos
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              // Ciclar entre temas
              const themes = ["theme-sky", "theme-sport", "theme-neutral"] as const;
              const currentIndex = themes.indexOf(theme);
              const nextTheme = themes[(currentIndex + 1) % themes.length];
              setTheme(nextTheme);
            }}
            className="px-3 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: "var(--color-surface-hover)",
              color: "var(--color-text-main)",
            }}
          >
            Tema
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">{children}</main>

      {/* Bottom Navigation (Mobile) */}
      <StudentBottomNav items={navItems} />
    </div>
  );
}
