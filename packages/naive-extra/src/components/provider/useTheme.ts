import type { ConfigProviderProps, GlobalTheme } from 'naive-ui'
import type { ComputedRef, Ref } from 'vue'
import { darkTheme } from 'naive-ui'
import { computed, ref } from 'vue'

export function useTheme(defaultMode: 'light' | 'dark' | 'system' = 'light'): {
  themeRef: Ref<GlobalTheme | null>
  isDark: ComputedRef<boolean>
  setDark: () => void
  setLight: () => void
  setSystem: () => void
  stopSystem: () => void
  toggle: () => void
  getConfigProps: () => Pick<ConfigProviderProps, 'theme'>
} {
  const themeRef = ref<GlobalTheme | null>(defaultMode === 'dark' ? darkTheme : null)
  const mql: MediaQueryList | null
    = typeof window !== 'undefined' && 'matchMedia' in window
      ? window.matchMedia('(prefers-color-scheme: dark)')
      : null

  const isDark = computed<boolean>(() => themeRef.value === darkTheme)

  function setDark() {
    themeRef.value = darkTheme
  }

  function setLight() {
    themeRef.value = null
  }

  function applySystem() {
    if (!mql)
      return
    themeRef.value = mql.matches ? darkTheme : null
  }

  function setSystem() {
    if (!mql)
      return
    applySystem()
    mql.addEventListener('change', applySystem as EventListener)
  }

  function stopSystem() {
    if (!mql)
      return
    mql.removeEventListener('change', applySystem as EventListener)
  }

  function toggle() {
    isDark.value ? setLight() : setDark()
  }

  function getConfigProps(): Pick<ConfigProviderProps, 'theme'> {
    return {
      theme: themeRef.value ?? undefined
    }
  }

  if (defaultMode === 'system') {
    setSystem()
  }

  return {
    themeRef,
    isDark,
    setDark,
    setLight,
    setSystem,
    stopSystem,
    toggle,
    getConfigProps
  }
}
