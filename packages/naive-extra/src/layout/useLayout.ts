/** 提供给用户的布局上下文以及一些协助使用的函数 */

import type { MenuOption } from 'naive-ui'
import type { ComputedRef, Ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import type { LayoutType, RouteMeta } from './types'
import { computed, isRef, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DEFAULT_LAYOUT_PROPS } from './const'
import { transformRouteToMenu } from './route-to-menu'
import { filterRouteTree, normalizeAndRedirect, sortRouteTree, toRouteTree } from './transformRoutes'

// 仅在此文件内用简化上下文类型，避免类型实例化过深
export interface UseLayoutContext {
  type: 'left-menu' | string
  bordered: boolean
  inverted: boolean
  isCollapsed: boolean
  headerHeight: number
  footerHeight: number
  siderWidth: number
  collapsedWidth: number
  routes: RouteLike[]
  activeKey: string
  menuOptions: MenuOption[]
  homePath?: string
  excludePaths?: string[]
  updateIsCollapsed: (v: boolean) => void
  updateInverted: (v: boolean) => void
  updateActiveKey: (v: string) => void
}

/**
 * 使用路由生成菜单选项（响应式）
 *
 * 将 Vue Router 的 routes 转换为 Naive UI 的菜单配置，并保持响应式。
 * 支持传入 `Ref<RouteRecordRaw[]>` 或普通数组，内部统一为 ref 处理。
 *
 * @param routes - 路由数组或其响应式引用
 * @returns 返回包含 `menuOptions` 的对象（ComputedRef<MenuOption[]>）
 *
 * @throws {TypeError} 当传入的 routes 不是数组或不符合 RouteRecordRaw 时（仅在 TS 编译期提示）
 *
 * @example
 * ```ts
 * const routes = ref<RouteRecordRaw[]>(router.options.routes)
 * const { menuOptions } = useLayoutMenu(routes)
 * ```
 *
 * @remarks
 * - 内部使用 `transformRouteToMenu` 做路由到菜单的递归转换
 * - `routes` 变更时，`menuOptions` 会自动更新
 *
 * @security
 * - 不执行任何有副作用的操作；仅做数据映射
 *
 * @performance
 * - 递归转换的时间复杂度与路由数量相关，通常可接受
 */
export function useLayoutMenu(
  routes: Ref<RouteLike[]> | RouteLike[]
): { menuOptions: ComputedRef<MenuOption[]> } {
  const routesRef = isRef(routes) ? routes : ref(routes)
  const menuOptions = computed<MenuOption[]>(() => transformRouteToMenu(routesRef.value as any))
  return { menuOptions }
}

/**
 * 获取扁平路由列表（基于 Vue Router）
 *
 * 读取 `useRouter().getRoutes()` 并转换为简化的 `RouteRecordRaw[]`（扁平结构）。
 * 自动补充 `meta.title` 兜底为 `name`，并过滤 `meta.showInMenu === false` 的项。
 *
 * @returns 扁平路由数组，适配菜单转换
 *
 * @example
 * ```ts
 * const routes = getRoutes()
 * ```
 */
export interface RouteLike {
  path: string
  name?: string
  meta?: RouteMeta
  children?: RouteLike[]
}

/**
 * 管理布局的活跃菜单键（响应式）
 *
 * 提供响应式的 `activeKey` 与设置函数，便于在上下文中统一状态。
 *
 * @param initialKey - 初始激活键，默认空字符串
 * @returns `activeKey` 与 `setActiveKey` 函数
 *
 * @example
 * ```ts
 * const { activeKey, setActiveKey } = useActiveKey()
 * setActiveKey('/dashboard')
 * ```
 *
 * @remarks
 * - 简化上下文中对当前选中菜单项的管理
 *
 * @security
 * - 无副作用，安全
 *
 * @performance
 * - 常量时间操作
 */
export function useActiveKey(initialKey = ''): {
  activeKey: Ref<string>
  setActiveKey: (key: string) => void
} {
  const activeKey = ref<string>(initialKey)
  const setActiveKey = (key: string) => {
    activeKey.value = key
  }
  return { activeKey, setActiveKey }
}

/**
 * 创建布局辅助方法集合
 *
 * 提供统一的布局状态管理（折叠、激活键）、菜单生成以及用于 provide/inject 的上下文对象构建。
 *
 * @param option - 布局初始化与参数配置
 * @param option.routes - 路由数组或其 Ref（用于生成菜单）
 * @param option.initialCollapsed - 初始折叠状态，默认 false
 * @param option.initialActiveKey - 初始激活菜单键，默认 ''
 * @param option.bordered - 是否显示边框，支持布尔或 Ref
 * @param option.inverted - 是否启用反色样式，支持布尔或 Ref
 * @param option.headerHeight - 头部高度，支持 number 或 Ref<number>
 * @param option.footerHeight - 底部高度，支持 number 或 Ref<number>
 * @param option.siderWidth - 侧栏宽度，支持 number 或 Ref<number>
 * @param option.collapsedWidth - 折叠宽度，支持 number 或 Ref<number>
 * @returns 返回包含状态控制、菜单选项与上下文的辅助对象
 * @throws {TypeError} 在编译期校验参数类型，不在运行时抛错
 *
 * @remarks
 * - 统一创建 ComputedRef 包裹的配置，确保在 provide/inject 下保持响应式
 * - `routes` 支持数组或 Ref，内部自动转换为响应式
 *
 * @security
 * - 无副作用，仅管理 UI 状态与映射
 *
 * @performance
 * - 主要开销为菜单映射与少量 computed，通常可忽略
 */

export function useLayout(option: {
  baseRoutes: Ref<RouteRecordRaw[]> | RouteRecordRaw[]
  initialCollapsed?: boolean
  initialActiveKey?: string
  type?: LayoutType
  bordered?: boolean
  inverted?: boolean
  headerHeight?: number
  footerHeight?: number
  siderWidth?: number
  collapsedWidth?: number
  homePath?: string
  excludePaths?: string[]
}) {
  const route = useRoute()
  const router = useRouter()

  // 状态管理
  const collapsed = ref(option.initialCollapsed ?? false)
  const { activeKey, setActiveKey } = useActiveKey(option.initialActiveKey ?? option.homePath ?? '/')
  const type = ref<LayoutType>(option.type ?? DEFAULT_LAYOUT_PROPS.type)

  // 配置项全部转为 ref（统一响应式）
  const bordered = ref(option.bordered ?? DEFAULT_LAYOUT_PROPS.bordered)
  const inverted = ref(option.inverted ?? DEFAULT_LAYOUT_PROPS.inverted)
  const headerHeight = ref(option.headerHeight ?? DEFAULT_LAYOUT_PROPS.headerHeight)
  const footerHeight = ref(option.footerHeight ?? DEFAULT_LAYOUT_PROPS.footerHeight)
  const siderWidth = ref(option.siderWidth ?? DEFAULT_LAYOUT_PROPS.siderWidth)
  const collapsedWidth = ref(option.collapsedWidth ?? DEFAULT_LAYOUT_PROPS.collapsedWidth)

  // 基础路由处理
  const baseRoutes = isRef(option.baseRoutes) ? option.baseRoutes : ref(option.baseRoutes)
  const normalizedBaseRoutes = computed(() => normalizeAndRedirect(baseRoutes.value as RouteRecordRaw[]))
  const routesTree = computed<RouteLike[]>(() => {
    const tree = toRouteTree(normalizedBaseRoutes.value) as any
    const sorted = sortRouteTree(tree)
    const filtered = filterRouteTree(sorted as any, option.excludePaths ?? [])
    return filtered as any
  })

  const menuOptions = computed<MenuOption[]>(() => transformRouteToMenu(normalizedBaseRoutes.value as any))

  // ✅ 构建响应式 context：直接放 ref/computed，不要 .value！
  const context = reactive({
    type,
    // 响应式字段（ref 会被 reactive 自动 unwrap 使用，但保持响应链接）
    bordered,
    inverted,
    isCollapsed: collapsed,
    headerHeight,
    footerHeight,
    siderWidth,
    collapsedWidth,
    activeKey,
    menuOptions,
    routes: routesTree as unknown as any,
    homePath: option.homePath,
    excludePaths: option.excludePaths,

    // 方法
    updateIsCollapsed(v: boolean) {
      collapsed.value = v
    },
    updateInverted(v: boolean) {
      inverted.value = v
    },
    updateActiveKey(v: string) {
      setActiveKey(v)
      router.push(v)
    }
  }) as unknown as UseLayoutContext

  // 监听路由变化，更新激活的菜单项
  const stop = watch(
    () => route.path,
    (path) => {
      setActiveKey(path)
    },
    { immediate: true }
  )

  const stopSync = watch(
    normalizedBaseRoutes,
    (list) => {
      for (const r of list as RouteRecordRaw[]) {
        const name = r.name as string | undefined
        if (name && router.hasRoute(name)) {
          router.removeRoute(name)
        }
        router.addRoute(r)
      }
    },
    { immediate: true, deep: true }
  )

  onUnmounted(() => stop())
  onUnmounted(() => stopSync())

  function addRoute(route: RouteRecordRaw) {
    const existing = new Set<string>(router.getRoutes().map(r => String(r.name ?? '')))
    const name = route.name as string | undefined
    if (name && existing.has(name))
      return
    baseRoutes.value = [...(baseRoutes.value as RouteRecordRaw[]), route]
    const [rec] = normalizeAndRedirect([route])
    router.addRoute(rec)
  }

  function addRoutes(routes: RouteRecordRaw[]) {
    const existing = new Set<string>(router.getRoutes().map(r => String(r.name ?? '')))
    const toAdd = routes.filter((r) => {
      const n = r.name as string | undefined
      return !n || !existing.has(n)
    })
    if (!toAdd.length)
      return
    baseRoutes.value = [...(baseRoutes.value as RouteRecordRaw[]), ...toAdd]
    const recs = normalizeAndRedirect(toAdd)
    for (const rec of recs) router.addRoute(rec)
  }

  function removeRoute(id: string) {
    const name = id
    if (router.hasRoute(name)) {
      router.removeRoute(name)
    }
    baseRoutes.value = (baseRoutes.value as RouteRecordRaw[]).filter(r => r.name !== id && r.path !== id)
  }

  return {
    collapsed,
    baseRoutes,
    addRoute,
    addRoutes,
    removeRoute,
    toggle: () => (collapsed.value = !collapsed.value),
    setCollapsed: (v: boolean) => (collapsed.value = v),
    activeKey,
    setActiveKey,
    menuOptions,
    context,
    type,
    bordered,
    inverted,
    headerHeight,
    footerHeight,
    siderWidth,
    collapsedWidth
  }
}
