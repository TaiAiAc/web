import type { Reactive } from 'vue'
import type { Props } from './props'
import { inject, provide } from 'vue'
import { normalizeAndRedirect } from './transformRoutes'

export interface LayoutEmits {
  /** @description 更新是否折叠侧边栏 */
  updateIsCollapsed: (value: boolean) => void
  /** @description 更新反色样式 */
  updateInverted: (value: boolean) => void
  /** @description 更新当前激活的路由键 */
  updateActiveKey: (value: string) => void
}

export const LayoutContextKey = Symbol('LayoutContext')
export const LayoutEmitsKey = Symbol('LayoutEmits')

export const HasSiderLayoutKey = Symbol('hasSiderLayout')

export function provideLayoutContext(props: Required<Props>) {
  const context = reactive({
  // 使用 toRef 保持与 props 的响应式链接
    type: toRef(props, 'type'),
    bordered: toRef(props, 'bordered'),
    inverted: toRef(props, 'inverted'),
    isCollapsed: toRef(props, 'isCollapsed'),
    headerHeight: toRef(props, 'headerHeight'),
    footerHeight: toRef(props, 'footerHeight'),
    siderWidth: toRef(props, 'siderWidth'),
    collapsedWidth: toRef(props, 'collapsedWidth'),
    activeKey: toRef(props, 'activeKey'),
    menuOptions: toRef(props, 'menuOptions'),
    baseRoutes: computed(() => normalizeAndRedirect(unref((props as any).baseRoutes)))
  })

  const hasSiderLayout = computed(() => ['left-menu', 'left-mixed', 'left-mixed-top-priority', 'top-mixed-side-priority', 'top-mixed-top-priority'].includes(context.type))

  provide(LayoutContextKey, context)
  provide(HasSiderLayoutKey, hasSiderLayout)
}

export function useContext() {
  const context = inject<Reactive<Props>>(LayoutContextKey)!
  const layoutEmit = inject<Reactive<LayoutEmits>>(LayoutEmitsKey)!
  const hasSiderLayout = inject<Reactive<boolean>>(HasSiderLayoutKey)!

  const type = computed(() => unref(context.type))
  const bordered = computed(() => unref(context.bordered))
  const inverted = computed(() => unref(context.inverted))
  const isCollapsed = computed(() => unref(context.isCollapsed))
  const headerHeight = computed(() => unref(context.headerHeight))
  const footerHeight = computed(() => unref(context.footerHeight))
  const siderWidth = computed(() => unref(context.siderWidth))
  const collapsedWidth = computed(() => unref(context.collapsedWidth))
  const activeKey = computed(() => unref(context.activeKey))
  const menuOptions = computed(() => unref(context.menuOptions))
  const baseRoutes = computed(() => unref((context as any).baseRoutes) ?? [])

  const firstLevelMenuOptions = computed(() => {
    const opts = unref(menuOptions) as any[] || []
    return opts.map(o => ({ key: o.key, label: o.label, icon: o.icon }))
  })

  const subLevelMenuOptions = computed(() => {
    const changeRange = firstLevelMenuOptions.value.map(o => o.key)
    const opts = unref(menuOptions) as any[] || []
    const key = String(unref(activeKey) ?? '')
    const topKey = changeRange.find(k => key === k || key.startsWith(`${k}/`)) ?? changeRange[0] ?? ''
    const parent = (opts || []).find(o => o.key === topKey)

    return parent?.children ?? []
  })

  const isLeftMain = computed(() => ['left-menu', 'left-mixed', 'top-mixed-side-priority'].includes(type.value!))

  const isTopMain = computed(() => ['top-menu', 'left-mixed-top-priority', 'top-mixed-top-priority'].includes(type.value!))

  const isLeftMixed = computed(() => ['left-mixed', 'left-mixed-top-priority'].includes(type.value!))

  return {
    ctx: context,
    type,
    bordered,
    inverted,
    isCollapsed,
    headerHeight,
    footerHeight,
    siderWidth,
    collapsedWidth,
    activeKey,
    menuOptions,
    baseRoutes,
    hasSiderLayout,
    firstLevelMenuOptions,
    subLevelMenuOptions,
    isLeftMain,
    isTopMain,
    isLeftMixed,
    ...layoutEmit
  }
}
