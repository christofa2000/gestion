import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Using CSS variables for theming
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        primary: {
          DEFAULT: "var(--color-primary)",
          soft: "var(--color-primary-soft)",
        },
        accent: "var(--color-accent)",
        text: {
          main: "var(--color-text-main)",
          muted: "var(--color-text-muted)",
        },
        border: {
          subtle: "var(--color-border-subtle)",
        },
      },
    },
  },
  plugins: [],
};

export default config;

