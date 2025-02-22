import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import tailwindcss from "@tailwindcss/vite"
import vue from "@vitejs/plugin-vue"
import {defineConfig} from "vite"
import {svgSpriteCompiler} from "./src/plugins/vite-svg-sprite-compiler"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig(() => {
  return {
    plugins: [
      svgSpriteCompiler({
        iconsDir: "src/assets/icons",
        outputSprite: "public/icons.svg",
        typesOutput: "src/types/icons.ts",
      }),

      vue(),
      tailwindcss(),
    ],

    base: "./",
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
    },
  }
})
