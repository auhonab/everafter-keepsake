import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F5F3F7", // Soft lavender-white
        foreground: "#3A3242", // Deep lavender-gray
        primary: {
          DEFAULT: "#C4B7D7", // Soft lavender
          foreground: "#3A3242", // Deep lavender-gray
        },
        accent: {
          DEFAULT: "#ACA1C5", // Muted lavender-gray
          foreground: "#3A3242", // Deep lavender-gray
        },
        muted: {
          DEFAULT: "#E8E4EF", // Very light lavender
          foreground: "#6D6379", // Muted gray-lavender
        },
        card: {
          DEFAULT: "#FDFCFF", // Nearly white with lavender tint
          foreground: "#3A3242", // Deep lavender-gray
        },
        popover: {
          DEFAULT: "#FDFCFF", // Nearly white with lavender tint
          foreground: "#3A3242", // Deep lavender-gray
        },
        border: "#D4CCE3", // Light lavender-gray for borders
        input: "#D4CCE3", // Light lavender-gray
        ring: "#C4B7D7", // Soft lavender
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#FDFCFF",
        },
        secondary: {
          DEFAULT: "#6D6379", // Muted gray-lavender for secondary text
          foreground: "#3A3242", // Deep lavender-gray
        },
      },
      fontFamily: {
        headline: ['var(--font-alegreya)', 'Alegreya', 'serif'],
        body: ['var(--font-alegreya)', 'Alegreya', 'serif'],
        sans: ['var(--font-alegreya)', 'Alegreya', 'serif'],
        serif: ['var(--font-alegreya)', 'Alegreya', 'serif'],
        mono: ['var(--font-alegreya)', 'Alegreya', 'serif'],
        DEFAULT: ['var(--font-alegreya)', 'Alegreya', 'serif'],
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
