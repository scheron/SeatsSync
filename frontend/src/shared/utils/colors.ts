export function hexToRgb(hex: string): [number, number, number] {
  const normalizedHex = hex.replace(/^#/, "")
  const bigint = parseInt(normalizedHex.slice(0, 6), 16)

  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255]
}

export function hexToHsl(hex: string): [number, number, number] {
  hex = hex.replace(/^#/, "")
  const [r, g, b] = hexToRgb(hex).map((channel) => channel / 255)

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let h = 0
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6
    else if (max === g) h = (b - r) / delta + 2
    else h = (r - g) / delta + 4
    h *= 60
  }
  if (h < 0) h += 360

  const l = (max + min) / 2
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))

  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)]
}

export function hexToHsb(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex).map((channel) => channel / 255)

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let h = 0
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6
    else if (max === g) h = (b - r) / delta + 2
    else h = (r - g) / delta + 4
    h *= 60
  }
  if (h < 0) h += 360

  const brightness = max * 100
  const saturation = max === 0 ? 0 : (delta / max) * 100

  return [Math.round(h), Math.round(saturation), Math.round(brightness)]
}

export function hslToHsb(h: number, s: number, l: number): [number, number, number] {
  s /= 100
  l /= 100

  const brightness = l + s * Math.min(l, 1 - l)
  const saturation = brightness === 0 ? 0 : 2 * (1 - l / brightness) * 100

  return [h, Math.round(saturation), Math.round(brightness * 100)]
}

export function hsbToHsl(h: number, s: number, b: number): [number, number, number] {
  s /= 100
  b /= 100

  const l = ((2 - s) * b) / 2
  const saturation = l === 0 || l === 1 ? 0 : (s * b) / (1 - Math.abs(2 * l - 1))

  return [h, Math.round(saturation * 100), Math.round(l * 100)]
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (value: number) => {
    value = Math.max(0, Math.min(255, Math.round(value) || 0))
    return value.toString(16).padStart(2, "0").toUpperCase()
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function hsbToHex(hue: number, saturation: number, brightness: number): string {
  const s = saturation / 100
  const v = brightness / 100

  const c = v * s
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1))
  const m = v - c

  let red = 0,
    green = 0,
    blue = 0

  if (hue >= 0 && hue < 60) {
    red = c
    green = x
    blue = 0
  } else if (hue >= 60 && hue < 120) {
    red = x
    green = c
    blue = 0
  } else if (hue >= 120 && hue < 180) {
    red = 0
    green = c
    blue = x
  } else if (hue >= 180 && hue < 240) {
    red = 0
    green = x
    blue = c
  } else if (hue >= 240 && hue < 300) {
    red = x
    green = 0
    blue = c
  } else if (hue >= 300 && hue < 360) {
    red = c
    green = 0
    blue = x
  }

  red = Math.round((red + m) * 255)
  green = Math.round((green + m) * 255)
  blue = Math.round((blue + m) * 255)

  return rgbToHex(red, green, blue)
}
