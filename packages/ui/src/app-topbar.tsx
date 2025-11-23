"use client";

import * as React from "react";
import { ThemeSwitcher } from "./theme-switcher";
import type { ThemeName } from "@repo/config";

interface AppTopbarProps {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
  userName?: string;
  userAvatar?: string;
}

export function AppTopbar({
  currentTheme,
  onThemeChange,
  userName = "Usuario",
  userAvatar,
}: AppTopbarProps) {
  return (
    <header
      className="fixed left-64 right-0 top-0 h-16 border-b px-6 flex items-center justify-between z-10"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border-subtle)",
      }}
    >
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold" style={{ color: "var(--color-text-main)" }}>
          {/* El título se establecerá dinámicamente por cada página */}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <ThemeSwitcher currentTheme={currentTheme} onThemeChange={onThemeChange} />

        <div className="flex items-center gap-3">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center font-medium text-white"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium" style={{ color: "var(--color-text-main)" }}>
              {userName}
            </span>
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

