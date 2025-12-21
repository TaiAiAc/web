import type { ConfigProviderProps, GlobalThemeOverrides } from 'naive-ui'
import { ref } from 'vue'

type BrandKey = 'primary' | 'info' | 'success' | 'warning' | 'error'
type BrandPalette = Record<BrandKey, string>

function clamp(v: number) {
  return Math.max(0, Math.min(255, v))
}

function hexToRgb(hex: string): { r: number, g: number, b: number } {
  const value = hex.replace('#', '')
  const full = value.length === 3 ? value.split('').map(s => s + s).join('') : value
  const num = Number.parseInt(full, 16)
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map(x => clamp(x).toString(16).padStart(2, '0')).join('')}`
}

function mix(hex: string, target: '#000000' | '#ffffff', ratio: number) {
  const a = hexToRgb(hex)
  const b = hexToRgb(target)
  const r = Math.round(a.r * (1 - ratio) + b.r * ratio)
  const g = Math.round(a.g * (1 - ratio) + b.g * ratio)
  const bl = Math.round(a.b * (1 - ratio) + b.b * ratio)
  return rgbToHex(r, g, bl)
}

function lighten(hex: string, ratio = 0.08) {
  return mix(hex, '#ffffff', ratio)
}

function darken(hex: string, ratio = 0.1) {
  return mix(hex, '#000000', ratio)
}

function toOverrides(palette: BrandPalette): GlobalThemeOverrides {
  const primary = palette.primary
  const info = palette.info
  const success = palette.success
  const warning = palette.warning
  const error = palette.error
  return {
    common: {
      primaryColor: primary,
      primaryColorHover: lighten(primary, 0.08),
      primaryColorPressed: darken(primary, 0.12),
      primaryColorSuppl: primary,
      infoColor: info,
      infoColorHover: lighten(info, 0.08),
      infoColorPressed: darken(info, 0.12),
      infoColorSuppl: info,
      successColor: success,
      successColorHover: lighten(success, 0.08),
      successColorPressed: darken(success, 0.12),
      successColorSuppl: success,
      warningColor: warning,
      warningColorHover: lighten(warning, 0.08),
      warningColorPressed: darken(warning, 0.12),
      warningColorSuppl: warning,
      errorColor: error,
      errorColorHover: lighten(error, 0.08),
      errorColorPressed: darken(error, 0.12),
      errorColorSuppl: error
    }
  }
}

export function useColorScheme(defaults: BrandPalette = {
  primary: '#18a058',
  info: '#2080f0',
  success: '#18a058',
  warning: '#f0a020',
  error: '#d03050'
}): {
  paletteRef: import('vue').Ref<BrandPalette>
  overridesRef: import('vue').Ref<GlobalThemeOverrides>
  setPrimary: (color: string) => void
  setColor: (key: BrandKey, color: string) => void
  setPalette: (next: Partial<BrandPalette>) => void
  reset: () => void
  getConfigProps: () => Pick<ConfigProviderProps, 'themeOverrides'>
} {
  const paletteRef = ref<BrandPalette>({ ...defaults })
  const overridesRef = ref<GlobalThemeOverrides>(toOverrides(paletteRef.value))

  function setPrimary(color: string) {
    paletteRef.value.primary = color
    overridesRef.value = toOverrides(paletteRef.value)
  }

  function setColor(key: BrandKey, color: string) {
    paletteRef.value[key] = color
    overridesRef.value = toOverrides(paletteRef.value)
  }

  function setPalette(next: Partial<BrandPalette>) {
    paletteRef.value = { ...paletteRef.value, ...next }
    overridesRef.value = toOverrides(paletteRef.value)
  }

  function reset() {
    paletteRef.value = { ...defaults }
    overridesRef.value = toOverrides(paletteRef.value)
  }

  function getConfigProps(): Pick<ConfigProviderProps, 'themeOverrides'> {
    return { themeOverrides: overridesRef.value }
  }

  return {
    paletteRef,
    overridesRef,
    setPrimary,
    setColor,
    setPalette,
    reset,
    getConfigProps
  }
}
