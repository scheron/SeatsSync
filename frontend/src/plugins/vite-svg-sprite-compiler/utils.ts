import {promises as fs} from "fs"
import {basename, dirname, join} from "path"
import SVGSprite from "svg-sprite"
import {optimize} from "svgo"

import type {Config as SVGSpriteConfig, SVGSpriter} from "svg-sprite"
import type {Config as SVGOConfig} from "svgo"

const DEFAULT_SVGO_CONFIG = {
  multipass: true,
  plugins: [
    "removeDoctype",
    "removeXMLProcInst",
    "removeComments",
    "removeMetadata",
    "removeEditorsNSData",
    "cleanupAttrs",
    "minifyStyles",
    "convertStyleToAttrs",
    "cleanupIds",
    "removeRasterImages",
    "removeUselessDefs",
    "cleanupNumericValues",
    "cleanupListOfValues",
    "convertColors",
    "removeUnknownsAndDefaults",
    "removeNonInheritableGroupAttrs",
    "removeUselessStrokeAndFill",
    "removeViewBox",
    "cleanupEnableBackground",
    "removeHiddenElems",
    "removeEmptyText",
    "convertShapeToPath",
    "moveElemsAttrsToGroup",
    "moveGroupAttrsToElems",
    "collapseGroups",
    "convertPathData",
    "convertTransform",
    "removeEmptyAttrs",
    "removeEmptyContainers",
    "mergePaths",
    "removeUnusedNS",
    "sortAttrs",
    "removeTitle",
    "removeDesc",
    "removeDimensions",
    "removeStyleElement",
    "removeScriptElement",
  ],
} as SVGOConfig

export function createSprite(options?: Partial<SVGSpriteConfig>): SVGSpriter {
  return new SVGSprite({
    dest: ".",
    mode: {
      symbol: {
        sprite: "sprite.svg",
      },
    },
    ...options,
  })
}

export async function optimizeSvg(content: string, options: SVGOConfig = {}) {
  try {
    const result = optimize(content, {...DEFAULT_SVGO_CONFIG, ...options})
    return result.data
  } catch (error) {
    return content
  }
}

export async function ensureDirectoryExists(filePath: string): Promise<void> {
  const directory = dirname(filePath)
  try {
    await fs.access(directory)
  } catch {
    await fs.mkdir(directory, {recursive: true})
  }
}

export async function getSvgFiles(directory: string, exclude: string[] = []): Promise<string[]> {
  try {
    const files = await fs.readdir(directory)

    return files
      .filter((file) => file.endsWith(".svg"))
      .filter((file) => !exclude.includes(file))
      .map((file) => join(directory, file))
  } catch (error) {
    throw error
  }
}

export function getIconNameFromPath(filePath: string): string {
  return basename(filePath, ".svg")
}
