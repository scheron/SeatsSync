import plugin from "tailwindcss/plugin"

import type {Config} from "tailwindcss"

export default {
  content: ["./src/**/*.{ts,tsx,vue}"],

  darkMode: ["class"],
  safelist: ["dark"],
  prefix: "",

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
