import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F5F5DC", // Light beige
        foreground: "#1a1a1a",
        primary: {
          DEFAULT: "#FFB7A7", // Light peachy-pink
          foreground: "#1a1a1a",
        },
        accent: {
          DEFAULT: "#E79E92", // Dusty rose
          foreground: "#1a1a1a",
        },
        muted: {
          DEFAULT: "#f0f0f0",
          foreground: "#6b6b6b",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#1a1a1a",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#1a1a1a",
        },
        border: "#e5e5e5",
        input: "#e5e5e5",
        ring: "#FFB7A7",
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f1f5f9",
          foreground: "#0f172a",
        },
      },
      fontFamily: {
        headline: ['var(--font-dancing-script)', 'Dancing Script', 'cursive'],
        body: ['var(--font-merriweather)', 'Merriweather', 'serif'],
        serif: ['var(--font-merriweather)', 'Merriweather', 'serif'],
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        DEFAULT: ['var(--font-merriweather)', 'Merriweather', 'serif'],
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
