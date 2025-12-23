import type { MenuOption } from 'naive-ui'
// utils/route-to-menu.ts
import type { RouteRecordRaw } from 'vue-router'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

function renderIcon(icon?: string) {
  return () => h(Icon, { icon: icon ?? 'fluent:document-one-page-24-filled', width: '24px', height: '24px' })
}

/**
 * 将 Vue Router routes 转换为 Naive UI MenuOption[]
 */
export function transformRouteToMenu(
  routes: RouteRecordRaw[],
  parentPath = ''
): MenuOption[] {
  const menuOptions: MenuOption[] = []

  for (const route of routes) {
    const { path, name, meta = {}, children } = route

    // 跳过没有 name 或 meta.title 的路由（或根据你规则）
    if (!name || !meta.title || meta.hidden)
      continue

    // 构建完整路径（处理嵌套路由）
    const fullPath = parentPath ? `${parentPath}/${path}` : path

    // 递归处理子路由
    const childOptions = children
      ? transformRouteToMenu(children, fullPath)
      : undefined

    // 构建菜单项
    const menuItem: MenuOption = {
      key: fullPath,
      label: meta.title,
      icon: renderIcon(meta.icon as string),
      // 如果有子菜单，才添加 children 字段
      ...(childOptions && childOptions.length > 0 && { children: childOptions })
    }

    menuOptions.push(menuItem)
  }

  return menuOptions
}
