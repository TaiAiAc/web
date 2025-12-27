import { useColorScheme, useLocale, useTheme } from 'naive-extra'
import { defineStore } from 'pinia'

const DEFAULT_COLORS = {
  primary: '#18a058',
  info: '#2080f0',
  success: '#18a058',
  warning: '#f0a020',
  error: '#d03050'
}

export const useAppStore = defineStore('app', {
  state: () => ({
    lang: 'zh' as 'zh' | 'en',
    mode: 'light' as 'light' | 'dark',
    colors: { ...DEFAULT_COLORS }
  }),
  actions: {
    init() {
      const savedLang = localStorage.getItem('__app_lang__') as 'zh' | 'en' | null
      const savedMode = localStorage.getItem('__app_mode__') as 'light' | 'dark' | null
      const savedColors = localStorage.getItem('__app_colors__')
      if (savedLang)
        this.lang = savedLang
      if (savedMode)
        this.mode = savedMode
      if (savedColors) {
        try {
          const parsed = JSON.parse(savedColors)
          this.colors = { ...this.colors, ...parsed }
        }
        catch {}
      }
      if (this.lang === 'zh')
        this.locale.setZh()
      else this.locale.setEn()
      if (this.mode === 'dark')
        this.theme.setDark()
      else this.theme.setLight()
      this.colorScheme.setPalette(this.colors)
    },
    setZh() {
      this.lang = 'zh'
      this.locale.setZh()
      localStorage.setItem('__app_lang__', this.lang)
    },
    setEn() {
      this.lang = 'en'
      this.locale.setEn()
      localStorage.setItem('__app_lang__', this.lang)
    },
    toggleLocale() {
      if (this.lang === 'zh')
        this.setEn()
      else this.setZh()
    },
    setDark() {
      this.mode = 'dark'
      this.theme.setDark()
      localStorage.setItem('__app_mode__', this.mode)
    },
    setLight() {
      this.mode = 'light'
      this.theme.setLight()
      localStorage.setItem('__app_mode__', this.mode)
    },
    toggleTheme() {
      if (this.mode === 'dark')
        this.setLight()
      else this.setDark()
    },
    setPrimary(hex: string) {
      this.colors.primary = hex
      this.colorScheme.setPrimary(hex)
      localStorage.setItem('__app_colors__', JSON.stringify(this.colors))
    },
    setPalette(next: Partial<typeof this.colors>) {
      this.colors = { ...this.colors, ...next }
      this.colorScheme.setPalette(this.colors)
      localStorage.setItem('__app_colors__', JSON.stringify(this.colors))
    },
    resetColors() {
      this.colors = { ...DEFAULT_COLORS }
      this.colorScheme.setPalette(this.colors)
      localStorage.setItem('__app_colors__', JSON.stringify(this.colors))
    }
  },
  getters: {
    locale(): ReturnType<typeof useLocale> {
      return useLocale(this.lang)
    },
    theme(): ReturnType<typeof useTheme> {
      return useTheme(this.mode)
    },
    colorScheme(): ReturnType<typeof useColorScheme> {
      return useColorScheme(this.colors)
    },
    isDark(): boolean {
      return this.theme.isDark.value
    },
    configProps(): Record<string, any> {
      return {
        ...this.locale.getConfigProps(),
        ...this.theme.getConfigProps(),
        ...this.colorScheme.getConfigProps()
      }
    },
    primary(): string {
      return this.colors.primary
    }
  }
})
