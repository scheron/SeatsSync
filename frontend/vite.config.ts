import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import vue from "@vitejs/plugin-vue"
import {defineConfig} from "vite"
import svgLoader from "vite-svg-loader"
import {svgSpriteCompiler} from "./src/plugins/vite-svg-sprite-compiler"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig(() => {
  return {
    plugins: [
      vue(),

      svgSpriteCompiler({
        iconsDir: "src/assets/icons",
        outputSprite: "public/icons-sprite.svg",
        typesOutput: "src/types/icons.ts",
      }),

      svgLoader({
        svgoConfig: {
          multipass: true,
          plugins: [{name: "cleanupIds", params: {minify: false}}],
        },
      }),
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
