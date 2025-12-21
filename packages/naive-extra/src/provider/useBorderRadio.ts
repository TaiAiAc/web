import type { ConfigProviderProps, GlobalThemeOverrides } from 'naive-ui'
import type { Ref } from 'vue'
import { ref } from 'vue'

export function useBorderRadio(defaultPx = 3): {
  radiusRef: Ref<number>
  setRadius: (px: number) => void
  increase: (delta?: number) => void
  decrease: (delta?: number) => void
  reset: () => void
  getConfigProps: () => Pick<ConfigProviderProps, 'themeOverrides'>
} {
  const radiusRef = ref<number>(defaultPx)

  function normalize(px: number) {
    return Math.max(0, Math.round(px))
  }

  function toOverrides(px: number): GlobalThemeOverrides {
    return {
      common: {
        borderRadius: `${normalize(px)}px`
      }
    }
  }

  function setRadius(px: number) {
    radiusRef.value = normalize(px)
  }

  function increase(delta = 1) {
    setRadius(radiusRef.value + delta)
  }

  function decrease(delta = 1) {
    setRadius(radiusRef.value - delta)
  }

  function reset() {
    radiusRef.value = normalize(defaultPx)
  }

  function getConfigProps(): Pick<ConfigProviderProps, 'themeOverrides'> {
    return { themeOverrides: toOverrides(radiusRef.value) }
  }

  return {
    radiusRef,
    setRadius,
    increase,
    decrease,
    reset,
    getConfigProps
  }
}
