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
        background: "#FDF4E3", // Soft vanilla-beige
        foreground: "#3B2F2F", // Deep cocoa brown
        primary: {
          DEFAULT: "#FADADD", // Light blush pink
          foreground: "#3B2F2F", // Deep cocoa brown
        },
        accent: {
          DEFAULT: "#EAC8C8", // Gentle pink tint
          foreground: "#3B2F2F", // Deep cocoa brown
        },
        muted: {
          DEFAULT: "#FFFDF7", // Subtle off-white
          foreground: "#7A6E6E", // Muted taupe-grey
        },
        card: {
          DEFAULT: "#FFFDF7", // Subtle off-white for card boxes
          foreground: "#3B2F2F", // Deep cocoa brown
        },
        popover: {
          DEFAULT: "#FFFDF7", // Subtle off-white
          foreground: "#3B2F2F", // Deep cocoa brown
        },
        border: "#EAC8C8", // Gentle pink tint for borders
        input: "#EAC8C8", // Gentle pink tint
        ring: "#FADADD", // Light blush pink
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#FFFDF7",
        },
        secondary: {
          DEFAULT: "#7A6E6E", // Muted taupe-grey for secondary text
          foreground: "#3B2F2F", // Deep cocoa brown
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
