import crypto from "crypto"
import {promises as fs} from "fs"
import {basename, dirname, join} from "path"
import SVGSprite from "svg-sprite"
import {optimize} from "svgo"
import {getSpriteBaseName, SPRITE_FILENAME_EXTENSION, SVGO_CONFIG} from "./config"

import type {Config as SVGSpriteConfig, SVGSpriter} from "svg-sprite"
import type {Config as SVGOConfig} from "svgo"

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
    const result = optimize(content, {...SVGO_CONFIG, ...options})
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

export async function generateSpriteHash(params: {files: string[]; outputSprite: string}): Promise<string> {
  const {files, outputSprite} = params
  const contents = await Promise.all(
    files.map(async (file) => {
      const content = await fs.readFile(file, "utf-8")
      return `${getIconNameFromPath(file)}:${content}`
    }),
  )

  const baseSpriteName = getSpriteBaseName(outputSprite)
  contents.push(`spriteName:${baseSpriteName}`)

  const hash = crypto.createHash("md5").update(contents.sort().join("|")).digest("hex").slice(0, 8)

  return hash
}

export async function cleanupOldSprites(params: {outputDir: string; outputSprite: string; currentFilename: string}): Promise<void> {
  try {
    const {outputDir, outputSprite, currentFilename} = params
    const files = await fs.readdir(outputDir)
    const baseSpriteName = getSpriteBaseName(outputSprite)

    const spriteFiles = files.filter((file) => file.startsWith(`${baseSpriteName}.`) && file.endsWith(SPRITE_FILENAME_EXTENSION))

    for (const file of spriteFiles) {
      if (file !== currentFilename) {
        const filePath = join(outputDir, file)
        await fs.unlink(filePath)
        console.log(`🗑️  Removed old sprite: ${file}`)
      }
    }
  } catch (error) {
    console.error("Failed to cleanup old sprites:", error)
  }
}

export async function getPreviousHash(typesPath: string): Promise<string | null> {
  try {
    const content = await fs.readFile(typesPath, "utf-8")
    const match = content.match(/hash: "([a-f0-9]+)"/)
    return match ? match[1] : null
  } catch {
    return null
  }
}
