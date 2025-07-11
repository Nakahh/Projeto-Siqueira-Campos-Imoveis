import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [],
  prefix: "",
  important: true,
  experimental: {
    optimizeUniversalDefaults: true,
  },
  safelist: [
    // Brand colors
    "bg-brand-brown-50",
    "bg-brand-brown-100",
    "bg-brand-brown-200",
    "bg-brand-brown-300",
    "bg-brand-brown-400",
    "bg-brand-brown-500",
    "bg-brand-brown-600",
    "bg-brand-brown-700",
    "bg-brand-brown-800",
    "bg-brand-brown-900",
    "bg-brand-beige-50",
    "bg-brand-beige-100",
    "bg-brand-beige-200",
    "bg-brand-beige-300",
    "bg-brand-beige-400",
    "bg-brand-beige-500",
    "text-brand-brown-50",
    "text-brand-brown-100",
    "text-brand-brown-200",
    "text-brand-brown-300",
    "text-brand-brown-400",
    "text-brand-brown-500",
    "text-brand-brown-600",
    "text-brand-brown-700",
    "text-brand-brown-800",
    "text-brand-brown-900",
    "text-brand-beige-50",
    "text-brand-beige-100",
    "text-brand-beige-200",
    "text-brand-beige-300",
    "text-brand-beige-400",
    "text-brand-beige-500",
    "border-brand-brown-200",
    "border-brand-brown-300",
    "border-brand-brown-700",
    "border-brand-beige-200",
    "border-brand-beige-300",
    "border-brand-beige-400",
    // Common utilities that might be generated dynamically
    "animate-spin",
    "animate-pulse",
    "animate-bounce",
    "transition-all",
    "transition-colors",
    "transition-opacity",
    "transition-transform",
    "transform",
    "hover:scale-105",
    "hover:shadow-xl",
    "hover:bg-opacity-80",
    "focus:ring-2",
    "focus:ring-offset-2",
    "group-hover:scale-105",
    "group-hover:opacity-100",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // Cores da marca Siqueira Campos Imóveis
        brand: {
          brown: {
            50: "#fdf8f6",
            100: "#f2e8e5",
            200: "#eaddd7",
            300: "#e0cec7",
            400: "#d2bab0",
            500: "#bfa094",
            600: "#a18072",
            700: "#977669",
            800: "#846358",
            900: "#43302b",
          },
          beige: {
            50: "#fefdfb",
            100: "#fef7e0",
            200: "#faedc4",
            300: "#f7e2a9",
            400: "#f2d583",
            500: "#ebc35d",
            600: "#d4a12a",
            700: "#b8901f",
            800: "#9c7a1a",
            900: "#806419",
          },
        },
        // Cores para status
        status: {
          disponivel: "#10b981",
          alugado: "#f59e0b",
          vendido: "#ef4444",
          reservado: "#8b5cf6",
          inativo: "#6b7280",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
