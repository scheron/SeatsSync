import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import vue from "@vitejs/plugin-vue"
import {defineConfig} from "vite"
import svgLoader from "vite-svg-loader"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig(() => {
  return {
    plugins: [
      vue(),

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
