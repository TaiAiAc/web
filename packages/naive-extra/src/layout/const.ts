import type { Props } from './props'
import type { LayoutType } from './types'

export const DEFAULT_LAYOUT_PROPS: Required<Omit<Props, 'baseRoutes'>> = {
  /** @description 布局类型 */
  type: 'side-menu',
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
  activeKey: '/',
  /** @description 菜单路由 */
  menuOptions: []
}

export const DEFAULT_LAYOUT_TYPE: { type: LayoutType, name: string, desc: string }[] = [
  {
    type: 'side-menu',
    name: '左侧菜单布局',
    desc: '左侧菜单布局，左侧为垂直导航菜单，右侧为主内容区'
  },
  {
    type: 'side-menu/2',
    name: '左侧-顶部菜单布局',
    desc: '左侧为垂直导航菜单，顶部为水平导航菜单，下方为主内容区'
  },
  {
    type: 'side-mixed-menu/2',
    name: '左侧混合-顶部菜单布局',
    desc: '左侧为垂直导航菜单，顶部为水平导航菜单，下方为主内容区'
  },
  {
    type: 'top-menu',
    name: '顶部菜单布局',
    desc: '无侧边栏，顶部为水平导航菜单，下方为主内容区'
  },
  {
    type: 'top-menu/2',
    name: '顶部-左侧菜单布局',
    desc: '顶部菜单为主，顶部为水平导航菜单，左侧为垂直导航菜单，下方为主内容区'
  },
  {
    type: 'top-mixed-menu/2',
    name: '顶部-左侧混合菜单布局',
    desc: '顶部菜单为主，顶部为水平导航菜单，左侧为垂直导航菜单，下方为主内容区'
  },
  {
    type: 'blank',
    name: '无菜单布局',
    desc: '无菜单布局，页面不包含任何主导航菜单，适用于登录页、引导页、全屏应用等场景'
  }
]
