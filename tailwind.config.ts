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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#0A0A0A",
        accent: "#D4A853",
        muted: "#6B6B6B",
        borderCustom: "#E0DDD6",
      },
      fontFamily: {
        heading: ["Cabinet Grotesk", "sans-serif"],
        serif: ["Cabinet Grotesk", "sans-serif"],
        sans: ["Satoshi", "sans-serif"],
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
