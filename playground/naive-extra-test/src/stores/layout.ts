import type { LayoutType } from '@quiteer/naive-extra'
import { useLayout } from '@quiteer/naive-extra'
import { defineStore } from 'pinia'
import router from '../router'

export const useLayoutStore = defineStore('layout', () => {
  const {
    collapsed,
    toggle,
    setCollapsed,
    activeKey,
    setActiveKey,
    menuOptions,
    bordered,
    inverted,
    headerHeight,
    footerHeight,
    siderWidth,
    collapsedWidth,
    type
  } = useLayout({
    routes: router.getRoutes().filter(r => r.path !== '/' && (r.meta as any)?.hidden !== true).map(r => ({
      path: r.path,
      name: r.name as string,
      meta: {
        ...(r.meta as any),
        title: (r.meta as any)?.title ?? (r.name as string)
      }
    })),
    initialCollapsed: false,
    initialActiveKey: '/button',
    bordered: true,
    inverted: false,
    headerHeight: 56,
    footerHeight: 50,
    siderWidth: 240,
    collapsedWidth: 60,
    type: 'left-menu'
  })

  function setType(next: LayoutType) {
    type.value = next
  }

  return {
    collapsed,
    toggle,
    setCollapsed,
    activeKey,
    setActiveKey,
    menuOptions,
    bordered,
    inverted,
    headerHeight,
    footerHeight,
    siderWidth,
    collapsedWidth,
    type,
    setType
  }
})
