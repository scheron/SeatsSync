import {promises as fs} from "fs"
import {dirname, join} from "path"

import {generateSpriteFilename, generateTypesContent, getDefaultSpritePath} from "./config"
import {
  cleanupOldSprites,
  createSprite,
  ensureDirectoryExists,
  generateSpriteHash,
  getIconNameFromPath,
  getPreviousHash,
  getSvgFiles,
  optimizeSvg,
} from "./utils"

import type {CompileCallback} from "svg-sprite"
import type {SpriteCompiler, SvgSpriteCompilerOptions} from "./types"

export function createCompiler(options: SvgSpriteCompilerOptions): SpriteCompiler {
  let currentSpriteHash: string | null = null

  async function generate(): Promise<void> {
    try {
      const {iconsDir, outputSprite = getDefaultSpritePath(), typesOutput, exclude = []} = options
      const outputDir = dirname(outputSprite)

      await Promise.all([ensureDirectoryExists(outputSprite), ensureDirectoryExists(typesOutput)])

      const svgFiles = await getSvgFiles(iconsDir, exclude)

      if (!svgFiles.length) {
        console.log("No svg files founded")
        return
      }

      const spriteHash = await generateSpriteHash({files: svgFiles, outputSprite})

      if (!currentSpriteHash) {
        currentSpriteHash = await getPreviousHash(typesOutput)
      }

      if (currentSpriteHash === spriteHash) {
        console.log("🟡 No changes in icons detected, skipping sprite generation")
        return
      }

      const spriteFilename = generateSpriteFilename({outputSprite, hash: spriteHash})
      const spritePath = join(outputDir, spriteFilename)

      const sprite = createSprite()

      for (const filePath of svgFiles) {
        const content = await fs.readFile(filePath, "utf-8")
        const optimizedContent = await optimizeSvg(content, options.svgoConfig)
        sprite.add(filePath, null, optimizedContent)
      }

      const result = await new Promise<ReturnType<CompileCallback>>((resolve, reject) => {
        sprite.compile((error, result) => {
          if (error) reject(error)
          else resolve(result)
        })
      })

      await fs.writeFile(spritePath, result.symbol.sprite.contents)
      console.log(`✅ Sprite generated at ${spritePath}`)

      await cleanupOldSprites({
        outputDir,
        outputSprite,
        currentFilename: spriteFilename,
      })

      currentSpriteHash = spriteHash

      const iconNames = svgFiles.map(getIconNameFromPath)
      const typesContent = generateTypesContent({
        iconNames,
        spriteFilename,
        spriteHash,
      })

      await fs.writeFile(typesOutput, typesContent)
      console.log(`✅ Types and sprite info generated at ${typesOutput}`)

      if (exclude.length) console.log(` Excluded icons: ${exclude.join(", ")}`)
    } catch (error) {
      console.error("Failed to generate sprite:", error)
      throw error
    }
  }

  return {
    generate,
  }
}
