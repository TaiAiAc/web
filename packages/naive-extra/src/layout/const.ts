import type { Props } from './props'
import type { LayoutType } from './types'

export const DEFAULT_LAYOUT_PROPS: Required<Omit<Props, 'baseRoutes'>> = {
  /** @description 布局类型 */
  type: 'left-menu',
  /** @description 是否显示边框 */
  bordered: true,
  /** @description 反色样式（Header/Sider/Footer/Menu） */
  inverted: false,
  /** @description 是否折叠侧边栏 */
  isCollapsed: false,
  /** @description 头部高度 */
  headerHeight: 48,
  /** @description 底部高度 */
  footerHeight: 48,
  /** @description 侧边栏宽度 */
  siderWidth: 240,
  /** @description 折叠侧边栏宽度 */
  collapsedWidth: 60,
  /** @description 当前激活的路由键 */
  activeKey: '',
  /** @description 菜单路由 */
  menuOptions: []
}

export const DEFAULT_LAYOUT_TYPE: { type: LayoutType, name: string }[] = [
  {
    type: 'left-menu',
    name: '左侧菜单布局'
  },
  {
    type: 'left-mixed-top-priority',
    name: '左混合-顶部优先'
  },
  {
    type: 'top-menu',
    name: '顶部菜单布局'
  },
  {
    type: 'top-mixed-side-priority',
    name: '顶部混合-侧边优先'
  },
  {
    type: 'top-mixed-top-priority',
    name: '顶部混合-顶部优先'
  },
  {
    type: 'blank',
    name: '无菜单布局'
  }
]
