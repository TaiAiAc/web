import type { MenuOption } from 'naive-ui'
import type { Reactive } from 'vue'
import type { Props } from './props'
import { inject, provide } from 'vue'

export interface LayoutContext extends Props {
  /** @description 当前激活的路由键 */
  activeKey: string
  /** @description 菜单选项 */
  menuOptions: MenuOption[]
  /** @description 更新是否折叠侧边栏 */
  updateIsCollapsed: (value: boolean) => void
  /** @description 更新反色样式 */
  updateInverted: (value: boolean) => void
  /** @description 更新当前激活的路由键 */
  updateActiveKey: (value: string) => void
  /** @description 当激活路由键改变时触发 */
  onActive: (key: string) => void
}

export const LayoutContextKey = Symbol('LayoutContext')

export const DEFAULT_LAYOUT_PROPS: Required<Props> = {
  /** @description 布局类型 */
  type: 'left-menu',
  /** @description 是否显示边框 */
  bordered: true,
  /** @description 反色样式（Header/Sider/Footer/Menu） */
  inverted: false,
  /** @description 是否折叠侧边栏 */
  isCollapsed: false,
  /** @description 头部高度 */
  headerHeight: 56,
  /** @description 底部高度 */
  footerHeight: 50,
  /** @description 侧边栏宽度 */
  siderWidth: 240,
  /** @description 折叠侧边栏宽度 */
  collapsedWidth: 60,
  /** @description 菜单路由 */
  menuOptions: []
}

export function provideLayoutContext(context: LayoutContext) {
  const reactiveContext = computed(() => context)
  provide(LayoutContextKey, reactiveContext)
}

export function injectLayoutContext() {
  return inject<Reactive<LayoutContext>>(LayoutContextKey)
}
