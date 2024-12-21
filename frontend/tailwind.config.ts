import plugin from "tailwindcss/plugin"

import type {Config} from "tailwindcss"

export default {
  content: ["./src/**/*.{ts,tsx,vue}"],

  darkMode: ["class"],
  safelist: ["dark"],
  prefix: "",

  theme: {
    extend: {
      colors: {
        accent: "hsl(var(--color-450))",
        tint: "hsl(var(--color-50))",
        shade: "hsl(var(--color-850))",

        white: "hsl(var(--color-0))",
        black: "hsl(var(--color-900))",

        warn: "hsl(var(--color-warn))",
        error: "hsl(var(--color-error))",
        success: "hsl(var(--color-success))",
        info: "hsl(var(--color-info))",

        contrast: "hsl(var(--color-contrast))",

        primary: {
          100: "hsl(var(--color-primary-100))",
          200: "hsl(var(--color-primary-200))",
          300: "hsl(var(--color-primary-300))",
          400: "hsl(var(--color-primary-400))",
          500: "hsl(var(--color-primary-500))",
          600: "hsl(var(--color-primary-600))",
          700: "hsl(var(--color-primary-700))",
          800: "hsl(var(--color-primary-800))",
          900: "hsl(var(--color-primary-900))",
        },
      },
    },
  },

  plugins: [
    plugin(({addUtilities}) => {
      addUtilities({
        ".absolute-center": {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        },
        ".absolute-y-center": {
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
        },
        ".absolute-x-center": {
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        },
      })
    }),
  ],
} satisfies Config
