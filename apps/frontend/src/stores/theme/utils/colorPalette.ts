import {hexToHsb, hsbToHsl} from "@/utils/colors"

function calcStepValue(start: number, end: number, steps: number) {
  return Math.round(Math.abs(start - end) / steps)
}

export function generatePrimaryPalette(hex: string): {[key: number]: [number, number, number]} {
  const [h, s, b] = hexToHsb(hex)

  const palette = Array(19).fill(null)

  // Hardcoded values for white, black, tint, shade and accent colors
  palette[0] = [0, 0, 100] // White (0)
  palette[1] = [h, 4, 100] // Tint (50)
  palette[9] = [h, s, b] // Accent (450)
  palette[17] = [h, 60, 12] // Shade (850)
  palette[18] = [0, 0, 0] // Black (900)

  // Calculate incremental steps for tint and shade
  const tintStepS = calcStepValue(s, 4, 8)
  const tintStepB = calcStepValue(b, 100, 8)
  const shadeStepS = calcStepValue(s, 60, 8)
  const shadeStepB = calcStepValue(b, 12, 8)

  // Generate tint values (steps from 100 to 400)
  for (let i = 2; i < 9; i++) {
    const [prevH, prevS, prevB] = palette[i - 1]
    palette[i] = [prevH, prevS + tintStepS, prevB - tintStepB]
  }

  // Generate shade values (steps from 500 to 800)
  for (let i = 10; i < 17; i++) {
    const [prevH, prevS, prevB] = palette[i - 1]
    palette[i] = [prevH, prevS - shadeStepS, prevB - shadeStepB]
  }

  // Convert array to an object with keys from 50 to 900
  return palette.reduce((acc, step, index) => {
    acc[index * 50] = step
    return acc
  }, {}) as {[key: number]: [number, number, number]}
}

export function updateCssVariables(palette: Record<string, [number, number, number]>) {
  const root = document.documentElement

  Object.entries(palette).forEach(([key, hsb]) => {
    const [h, s, l] = hsbToHsl(...hsb)
    root.style.setProperty(`--c-${key}`, `${h} ${s}% ${l}%`)
  })
}
