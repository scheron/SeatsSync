import {createCompiler} from "./compiler"

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
      if (!isBuild) {
        server.watcher.on("change", async (file) => {
          if (file.endsWith(".svg") && file.includes(options.iconsDir)) {
            await compiler.generate()
            server.ws.send({type: "full-reload"})
          }
        })
      }
    },

    buildStart: () => compiler.generate(),
    closeBundle: () => compiler.dispose(),
  }
}
