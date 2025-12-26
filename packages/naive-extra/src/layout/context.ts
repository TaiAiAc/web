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

export interface LayoutContextState extends Props {
  mainActiveKey: string
  subActiveKey: string
  isLeftMain: boolean
  isTopMain: boolean
  isLeftMixed: boolean
}

export function provideLayoutContext(props: Required<Props>) {
  const mainActiveKey = ref(props.activeKey)
  const subActiveKey = ref(props.activeKey)

  const isLeftMain = computed(() => props.type!.includes('side'))

  const isTopMain = computed(() => props.type!.includes('top'))

  const isLeftMixed = computed(() => props.type!.includes('mixed'))

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
    baseRoutes: computed(() => normalizeAndRedirect(unref((props as any).baseRoutes))),
    mainActiveKey,
    subActiveKey,
    isLeftMain,
    isTopMain,
    isLeftMixed
  })

  const hasSiderLayout = computed(() => ['side-menu', 'side-menu/2', 'side-mixed-menu/2', 'top-menu/2', 'top-mixed-menu/2'].includes(context.type))

  provide(LayoutContextKey, context)
  provide(HasSiderLayoutKey, hasSiderLayout)
}

export function useContext() {
  const context = inject<Reactive<LayoutContextState>>(LayoutContextKey)!
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
  const baseRoutes = computed(() => unref((context as any).baseRoutes) ?? [])

  const activeKey = computed(() => unref(context.activeKey))
  const menuOptions = computed(() => unref(context.menuOptions))

  const mainActiveKey = toRef(context, 'mainActiveKey')
  const subActiveKey = toRef(context, 'subActiveKey')

  const isLeftMain = computed(() => unref(context.isLeftMain))
  const isTopMain = computed(() => unref(context.isTopMain))
  const isLeftMixed = computed(() => unref(context.isLeftMixed))

  const mainMenuOptions = computed(() => {
    const opts = unref(menuOptions) as any[] || []
    return opts.map(o => ({ key: o.key, label: o.label, icon: o.icon }))
  })

  const subMenuOptions = computed(() => {
    const changeRange = mainMenuOptions.value.map(o => o.key)
    const opts = unref(menuOptions) as any[] || []
    const key = String(unref(mainActiveKey) ?? '')
    const topKey = changeRange.find(k => key === k || key.startsWith(`${k}/`)) ?? changeRange[0] ?? ''
    const parent = (opts || []).find(o => o.key === topKey)

    return parent?.children ?? []
  })

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
    subActiveKey,
    mainActiveKey,
    menuOptions,
    baseRoutes,
    hasSiderLayout,
    mainMenuOptions,
    subMenuOptions,
    isLeftMain,
    isTopMain,
    isLeftMixed,
    ...layoutEmit
  }
}
