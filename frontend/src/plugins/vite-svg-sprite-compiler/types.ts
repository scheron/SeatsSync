import type {Config as SVGOConfig} from "svgo"

export type SvgSpriteCompilerOptions = {
  /** Directory containing SVG icons */
  iconsDir: string
  /** Output path for the sprite file */
  outputSprite: string
  /** Output path for TypeScript types */
  typesOutput: string
  /** SVG files to exclude from sprite */
  exclude?: string[]
  /** SVGO optimization config */
  svgoConfig?: Extract<SVGOConfig, "multipass" | "plugins" | "floatPrecision">
}

export type SpriteCompiler = {
  generate: () => Promise<void>
  dispose: () => void
}
