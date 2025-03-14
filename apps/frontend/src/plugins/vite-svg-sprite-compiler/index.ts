import {createCompiler} from "./compiler"
import {injectSpritePreload} from "./utils"

import type {Plugin} from "vite"
import type {SvgSpriteCompilerOptions} from "./types"

export type {SvgSpriteCompilerOptions}

export function svgSpriteCompiler(options: SvgSpriteCompilerOptions): Plugin {
  const compiler = createCompiler(options)
  let isBuild = false

  return {
    name: "vite-svg-sprite-compiler",
    enforce: "pre",

    configResolved(config) {
      isBuild = config.command === "build"
    },

    configureServer(server) {
      if (isBuild) return

      server.watcher.on("change", async (file) => {
        if (file.endsWith(".svg") && file.includes(options.iconsDir)) {
          await compiler.generate()
          server.ws.send({type: "full-reload"})
        }
      })

      server.middlewares.use((req, res, next) => {
        if (req.url?.includes("icons-sprite")) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable")
        }
        next()
      })
    },

    buildStart: () => compiler.generate(),

    transformIndexHtml: {
      order: "pre",
      handler(html, {path}) {
        if (path !== "/index.html") return html
        return injectSpritePreload({html, typesPath: options.typesOutput})
      },
    },
  }
}
