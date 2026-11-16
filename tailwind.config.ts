import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // All colours come from CSS variables in app/globals.css (one place to re-theme)
        background: "rgb(var(--bg) / <alpha-value>)",
        foreground: "rgb(var(--fg) / <alpha-value>)",
        primary: "rgb(var(--fg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        onaccent: "rgb(var(--on-accent) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        borderCustom: "rgb(var(--line) / <alpha-value>)",
      },
      fontFamily: {
        heading: ["var(--font-display)", "sans-serif"],
        serif: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
        accent: ["var(--font-instrument)", "Georgia", "serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      borderRadius: {
        custom: "24px",
      },
    },
  },
  plugins: [],
};
export default config;
