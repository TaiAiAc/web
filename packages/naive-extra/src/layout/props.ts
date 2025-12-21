import type { ComputedRef } from 'vue'
import type { LayoutType } from './types'

// minimal props for no-menu layout

export interface HeaderConfig {
  height?: number | string
  inverted?: boolean
  position?: 'static' | 'absolute'
}

export interface ContentConfig {
  contentClass?: string
  contentStyle?: string | Record<string, any>
  position?: 'static' | 'absolute'
  embedded?: boolean
  nativeScrollbar?: boolean
}

export interface FooterConfig {
  height?: number | string
  inverted?: boolean
  position?: 'static' | 'absolute'
}

export interface Props {
  layoutType?: LayoutType
  inverted?: boolean
  header?: HeaderConfig
  content?: ContentConfig
  footer?: FooterConfig
}

export interface UseLayoutReturn {
  collapsed: ComputedRef<boolean>
  toggle: () => void
  setCollapsed: (v: boolean) => void
  isMobile: ComputedRef<boolean>
}
