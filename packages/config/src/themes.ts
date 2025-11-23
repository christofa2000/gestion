export type ThemeName = "theme-sky" | "theme-sport" | "theme-neutral";

export const THEMES: ThemeName[] = ["theme-sky", "theme-sport", "theme-neutral"];

export const THEME_LABELS: Record<ThemeName, string> = {
  "theme-sky": "Sky",
  "theme-sport": "Sport",
  "theme-neutral": "Neutral",
};

export interface ClubTheme {
  theme: ThemeName;
  logo?: string;
}

