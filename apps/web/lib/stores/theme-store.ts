"use client";

import type { ThemeName } from "@repo/config";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "theme-neutral",
      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== "undefined") {
          document.body.className = theme;
        }
      },
    }),
    {
      name: "club-theme-storage",
    }
  )
);




