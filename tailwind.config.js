/** @type {import('tailwindcss').Config} */

// Every colour token is authored as an "R G B" triplet in globals.css so it can
// be used with Tailwind's opacity modifiers (e.g. `bg-accent/10`).
const token = (name) => ({ opacityValue }) =>
  opacityValue === undefined
    ? `rgb(var(--${name}))`
    : `rgb(var(--${name}) / ${opacityValue})`;

module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        vsm: "480px",
        lg: "1120px",
        xl: "1280px",
        "2xl": "1600px",
      },

      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },

      // A tight scale: dashboards earn their credibility through density.
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "0.9375rem" }],
        xs: ["0.75rem", { lineHeight: "1.0625rem" }],
        sm: ["0.8125rem", { lineHeight: "1.1875rem" }],
        base: ["0.875rem", { lineHeight: "1.3125rem" }],
        lg: ["1rem", { lineHeight: "1.5rem" }],
        xl: ["1.125rem", { lineHeight: "1.625rem" }],
        "2xl": ["1.375rem", { lineHeight: "1.75rem" }],
        "3xl": ["1.75rem", { lineHeight: "2.0625rem" }],
        "4xl": ["2.125rem", { lineHeight: "2.375rem" }],
        "5xl": ["2.75rem", { lineHeight: "3rem" }],
      },

      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "6px",
        lg: "8px",
        xl: "10px",
        "2xl": "14px",
      },

      colors: {
        canvas: token("canvas"),
        surface: {
          DEFAULT: token("surface"),
          sunken: token("surface-sunken"),
          hover: token("surface-hover"),
          active: token("surface-active"),
        },
        line: {
          DEFAULT: token("line"),
          strong: token("line-strong"),
        },
        ink: {
          DEFAULT: token("ink"),
          muted: token("ink-muted"),
          subtle: token("ink-subtle"),
          inverse: token("ink-inverse"),
        },
        accent: {
          DEFAULT: token("accent"),
          hover: token("accent-hover"),
          soft: token("accent-soft"),
          border: token("accent-border"),
          ink: token("accent-ink"),
        },
        pos: {
          DEFAULT: token("pos"),
          soft: token("pos-soft"),
          border: token("pos-border"),
        },
        neg: {
          DEFAULT: token("neg"),
          soft: token("neg-soft"),
          border: token("neg-border"),
        },

        // shadcn primitives read from these.
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
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
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },

      // Hairlines do the structural work; elevation is only for overlays.
      boxShadow: {
        xs: "0 1px 2px 0 rgb(9 12 20 / 0.04)",
        sm: "0 1px 2px 0 rgb(9 12 20 / 0.05), 0 1px 3px 0 rgb(9 12 20 / 0.04)",
        md: "0 4px 12px -2px rgb(9 12 20 / 0.08), 0 2px 4px -2px rgb(9 12 20 / 0.04)",
        lg: "0 16px 40px -12px rgb(9 12 20 / 0.18), 0 4px 10px -4px rgb(9 12 20 / 0.06)",
      },

      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "rise-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 180ms ease-out",
        "rise-in": "rise-in 220ms cubic-bezier(0.22, 1, 0.36, 1)",
        "slide-in-left": "slide-in-left 220ms cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
