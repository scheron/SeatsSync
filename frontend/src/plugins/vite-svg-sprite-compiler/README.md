# Vite SVG Sprite Compiler

Vite plugin for generating SVG sprites with automatic cache busting, TypeScript support, and hot reloading.

## Features

- 🎯 **Automatic Sprite Generation**: Combines multiple SVG files into a single sprite
- 🔄 **Cache Busting**: Generates unique filenames based on content hash
- 📝 **TypeScript Support**: Auto-generates types for icon names
- 🔥 **Hot Reloading**: Watches for changes and rebuilds automatically
- 🧹 **Auto Cleanup**: Removes old sprite versions
- ⚡️ **Optimization**: Includes SVGO optimization out of the box

## Dependencies

The plugin requires the following packages:
- `svg-sprite`: For sprite generation
- `svgo`: For SVG optimization

## Installation

0. Install dependencies:

```bash
npm install svg-sprite svgo --save-dev
```

1. In `vite.config.ts`:

```typescript
import vue from "@vitejs/plugin-vue"
import {defineConfig} from "vite"
import {svgSpriteCompiler} from "./src/plugins/vite-svg-sprite-compiler"

export default defineConfig({
  plugins: [
    svgSpriteCompiler({
      iconsDir: "src/assets/icons",      // Directory with SVG icons
      outputSprite: "public/icons-sprite.svg", // Where to output the sprite
      typesOutput: "src/types/icons.ts",  // Where to generate TypeScript types
      exclude: ["ignored.svg"],           // Optional: files to exclude
      svgoConfig: {},                     // Optional: SVGO config
    }),
    // ...other plugins
  ],
})
```

## Usage

### 1. Add SVG Icons

Place SVG icons in the configured directory (e.g., `src/assets/icons`):

```
src/assets/icons/
├── arrow-left.svg
├── check.svg
├── home.svg
└── ...
```

### 2. Use Icons in Components

The plugin generates two important files:

1. A sprite file with content hash: `public/icons-sprite.[hash].svg`
2. TypeScript types and sprite info: `src/types/icons.ts`

```typescript
// Generated src/types/icons.ts
export type IconName = "arrow-left" | "check" | "home";

export const spriteInfo = {
  filename: "icons-sprite.a1b2c3d4.svg",
  hash: "a1b2c3d4"
} as const;
```

Use the BaseIcon component to display icons:

```vue
<script setup lang="ts">
import type {IconName} from "@/types/icons"

// Icon name is type-safe
defineProps<{name: IconName}>()
</script>

<template>
  <BaseIcon name="check" />
</template>
```

## How It Works

### Cache Busting

The plugin implements cache busting:

1. Generates a unique hash based on:
   - Names of all icons
   - Content of all icons
2. Uses this hash in the sprite filename
3. Updates the hash only when icons actually change
4. Automatically cleans up old sprite versions

This ensures:
- Browser always loads the correct sprite version
- No manual cache clearing needed
- Old sprites are automatically removed
- Unnecessary rebuilds are avoided

### Development Mode

In development mode, the plugin:
1. Watches for changes in the icons directory
2. Automatically rebuilds the sprite when:
   - New icons are added
   - Icons are renamed or deleted
   - Icon content is modified
3. Updates types and sprite info
4. Cleans up old sprite versions

### Production Build

During production build:
1. Generates optimized sprite with SVGO
2. Creates a file with hash
3. Generates TypeScript types

## Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `iconsDir` | `string` | Directory containing SVG icons |
| `outputSprite` | `string` | Where to output the sprite file |
| `typesOutput` | `string` | Where to generate TypeScript types |
| `exclude` | `string[]` | Optional: SVG files to exclude |
| `svgoConfig` | `SVGOConfig` | Optional: SVGO optimization config |

## Best Practices

1. **Icon Names**:
   - Use kebab-case for icon filenames
   - Avoid special characters
   - Names will be used as sprite IDs

2. **SVG Files**:
   - Keep icons simple and optimized
   - Remove unnecessary attributes
   - Use currentColor for fill and stroke
   - Use consistent viewBox sizes

3. **BaseIcon Implementation**:
   ```vue
   <script setup lang="ts">
   import {spriteInfo} from "@/types/icons"
   import type {IconName} from "@/types/icons"
   
   // Icon name is type-safe and required
   defineProps<{name: IconName}>()
   </script>
   
   <template>
     <svg>
       <!-- href format: /{filename}#{icon-name} -->
       <use :href="`/${spriteInfo.filename}#${name}`" />
     </svg>
   </template>
   ```
   
   Key points:
   - Import `spriteInfo` to get the current sprite filename
   - Use TypeScript for type-safe icon names
   - Use SVG `<use>` element to reference icons from sprite
   - Format href as `/{filename}#{icon-name}`

## TypeScript Support

The plugin provides full TypeScript support:
- Auto-generated types for icon names
- Type-safe icon usage in components
- Proper type definitions for configuration 