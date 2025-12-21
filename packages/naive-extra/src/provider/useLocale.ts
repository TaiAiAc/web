import type { ConfigProviderProps, NDateLocale, NLocale } from 'naive-ui'
import type { ComputedRef, Ref } from 'vue'
import { dateEnUS, dateZhCN, enUS, zhCN } from 'naive-ui'
import { computed, ref } from 'vue'

export function useLocale(defaultLang: 'zh' | 'en' = 'zh'): {
  localeRef: Ref<NLocale>
  dateLocaleRef: Ref<NDateLocale>
  isZh: ComputedRef<boolean>
  setZh: () => void
  setEn: () => void
  toggle: () => void
  getConfigProps: () => Pick<ConfigProviderProps, 'locale' | 'dateLocale'>
} {
  const localeRef = ref<NLocale>(defaultLang === 'zh' ? zhCN : enUS)
  const dateLocaleRef = ref<NDateLocale>(defaultLang === 'zh' ? dateZhCN : dateEnUS)

  const isZh = computed(() => localeRef.value.name === zhCN.name)

  function setZh() {
    localeRef.value = zhCN
    dateLocaleRef.value = dateZhCN
  }

  function setEn() {
    localeRef.value = enUS
    dateLocaleRef.value = dateEnUS
  }

  function toggle() {
    isZh.value ? setEn() : setZh()
  }

  function getConfigProps(): Pick<ConfigProviderProps, 'locale' | 'dateLocale'> {
    return {
      locale: localeRef.value,
      dateLocale: dateLocaleRef.value
    }
  }

  return {
    localeRef,
    dateLocaleRef,
    isZh,
    setZh,
    setEn,
    toggle,
    getConfigProps
  }
}
