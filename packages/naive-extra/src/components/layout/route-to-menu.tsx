import type { MenuOption } from 'naive-ui'
import type { RouteRecordRaw } from 'vue-router'
import { Icon } from '@iconify/vue'
import { RouterLink } from 'vue-router'

function renderLabel(label: string, name: string) {
  return () => (
    <RouterLink to={{ name }}>
      {label}
    </RouterLink>
  )
}

function renderIcon(icon?: string) {
  return () => (
    <Icon
      icon={icon ?? 'fluent:document-one-page-24-filled'}
      width="24px"
      height="24px"
    />
  )
}

/**
 * 将 Vue Router routes 转换为 Naive UI MenuOption[]
 */
export function transformRouteToMenu(
  routes: RouteRecordRaw[],
  parentPath = ''
): MenuOption[] {
  const menuOptions: MenuOption[] = []

  function joinPath(parent: string, p: string) {
    const full = p.startsWith('/')
      ? p
      : (parent ? `${parent}/${p}` : `/${p}`)
    return full.replace(/\/+/g, '/')
  }

  for (const route of routes) {
    const { path, name, meta = {}, children } = route

    // 跳过没有 name 或 meta.title 的路由（或根据你规则）
    if (!name || !meta.title || meta.hidden)
      continue

    // 构建完整路径（处理嵌套路由）
    const fullPath = joinPath(parentPath, path)

    // 递归处理子路由
    const childOptions = children ? transformRouteToMenu(children, fullPath) : undefined
    const isParent = !!(childOptions && childOptions.length > 0)

    // 构建菜单项
    const menuItem: MenuOption = {
      key: fullPath,
      label: isParent ? (meta.title as string) : renderLabel(meta.title as string, name as string),
      icon: renderIcon(meta.icon as string),
      // 如果有子菜单，才添加 children 字段
      ...(childOptions && childOptions.length > 0 && { children: childOptions })
    }

    menuOptions.push(menuItem)
  }
  return menuOptions
}
