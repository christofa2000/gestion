"use client";

import * as React from "react";
import { THEMES, THEME_LABELS, type ThemeName } from "@repo/config";

interface ThemeSwitcherProps {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

export function ThemeSwitcher({ currentTheme, onThemeChange }: ThemeSwitcherProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="theme-select" className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
        Tema:
      </label>
      <select
        id="theme-select"
        value={currentTheme}
        onChange={(e) => onThemeChange(e.target.value as ThemeName)}
        className="px-3 py-2 rounded-md border text-sm"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border-subtle)",
          color: "var(--color-text-main)",
        }}
      >
        {THEMES.map((theme) => (
          <option key={theme} value={theme}>
            {THEME_LABELS[theme]}
          </option>
        ))}
      </select>
    </div>
  );
}




