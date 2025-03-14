import type {Config as SVGOConfig} from "svgo"

export interface SvgSpriteCompilerOptions {
  /** Source directory for SVG icons */
  iconsDir: string
  /** Output path for the sprite file. Defaults to "public/icons-sprite.svg" */
  outputSprite?: string
  /** Output path for TypeScript types */
  typesOutput: string
  /** SVG files to exclude from sprite */
  exclude?: string[]
  /** SVGO optimization config */
  svgoConfig?: SVGOConfig
}

export interface SpriteCompiler {
  /** Generate sprite and types */
  generate(): Promise<void>
}
