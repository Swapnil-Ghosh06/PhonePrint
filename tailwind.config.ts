import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Light theme only - strictly no dark theme
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#FAFAFA",
          50: "#FFFFFF",
          100: "#FAFAFA",
          200: "#F4F4F5",
          300: "#E4E4E7",
          400: "#D4D4D8",
          500: "#A1A1AA",
          600: "#71717A",
          700: "#52525B",
          800: "#27272A",
          900: "#18181B",
        },
        cobalt: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#172554",
          950: "#0c183d",
        },
        lime: {
          50: "#f7fee7",
          100: "#ecfccb",
          200: "#d9f99d",
          300: "#bef264",
          400: "#a3e635",
          500: "#84cc16",
          600: "#65a30d",
          700: "#4d7c0f",
          800: "#3f6212",
          900: "#365314",
          950: "#1a2e05",
        },
      },
      fontFamily: {
        // STRICT FONTS ONLY: DM Sans, Montserrat, Sora
        sans: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
        dmsans: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
        heading: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
        display: ["var(--font-sora)", "Sora", "sans-serif"],
        sora: ["var(--font-sora)", "Sora", "sans-serif"],
        mono: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
        serif: ["var(--font-sora)", "Sora", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.06)",
        "glass-hover": "0 16px 40px 0 rgba(31, 38, 135, 0.1)",
        "glass-sm": "0 4px 16px 0 rgba(31, 38, 135, 0.04)",
        "pill-glow": "0 0 20px -3px rgba(37, 99, 235, 0.35)",
        card: "0 10px 30px -5px rgba(0, 0, 0, 0.04), 0 4px 12px -2px rgba(0, 0, 0, 0.02)",
      },
      borderRadius: {
        xs: "0.5rem", // Soften all legacy rounded-xs to modern 8px curves
      },
    },
  },
  plugins: [],
};

export default config;
