import type { LayoutType } from '../../../../packages/naive-extra/src'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { useLayout } from '../../../../packages/naive-extra/src'
import { routes } from '../router'

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
    type,
    baseRoutes,
    addRoute,
    addRoutes,
    removeRoute
  } = useLayout({
    baseRoutes: routes,
    // initialCollapsed: false,
    initialActiveKey: '/button',
    homePath: '/'
    // bordered: true,
    // inverted: false,
    // headerHeight: 56,
    // footerHeight: 50,
    // siderWidth: 240,
    // collapsedWidth: 60,
    // type: 'top-menu'
  })

  function setType(next: LayoutType) {
    type.value = next
  }

  const router = useRouter()

  router.addRoute({
    path: '/',
    name: 'home',
    meta: {
      title: '首页'
    },
    component: () => import('@/pages/home.vue')
  })

  return {
    baseRoutes,
    addRoute,
    addRoutes,
    removeRoute,
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
