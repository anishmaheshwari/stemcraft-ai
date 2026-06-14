import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      keyframes: {
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition:  "200% 0" },
        },
        "float-free": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        "pulse-ring": {
          "0%":   { boxShadow: "0 0 0 0 hsl(160 84% 39% / 0.4)" },
          "70%":  { boxShadow: "0 0 0 10px hsl(160 84% 39% / 0)" },
          "100%": { boxShadow: "0 0 0 0 hsl(160 84% 39% / 0)" },
        },
        "gradient-shift": {
          "0%":   { backgroundPosition: "0% 50%" },
          "50%":  { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "typing-bounce": {
          "0%, 60%, 100%": { transform: "translateY(0)" },
          "30%":            { transform: "translateY(-6px)" },
        },
      },
      animation: {
        shimmer:          "shimmer 2s infinite linear",
        "float-free":     "float-free 6s ease-in-out infinite",
        "spin-slow":      "spin-slow 3s linear infinite",
        "pulse-ring":     "pulse-ring 2s ease-out infinite",
        "gradient-shift": "gradient-shift 4s ease infinite",
        "slide-up":       "slide-up 0.4s ease-out both",
        "fade-in":        "fade-in 0.3s ease-out both",
        "typing-bounce":  "typing-bounce 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
