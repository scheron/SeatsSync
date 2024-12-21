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
        accent: "var(--color-450)",
        tint: "var(--color-50)",
        shade: "var(--color-850)",

        white: "var(--color-0)",
        black: "var(--color-900)",

        warn: "var(--color-warn)",
        error: "var(--color-error)",
        success: "var(--color-success)",
        info: "var(--color-info)",

        primary: {
          100: "var(--color-primary-100)",
          200: "var(--color-primary-200)",
          300: "var(--color-primary-300)",
          400: "var(--color-primary-400)",
          500: "var(--color-primary-500)",
          600: "var(--color-primary-600)",
          700: "var(--color-primary-700)",
          800: "var(--color-primary-800)",
          900: "var(--color-primary-900)",
        },
        contrast: "var(--color-contrast)",
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
