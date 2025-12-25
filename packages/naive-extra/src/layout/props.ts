import type { MenuOption } from 'naive-ui'
import type { RouteRecordRaw } from 'vue-router'
import type { LayoutType } from './types'

export type Props = Partial<{
  /** @description 布局类型 */
  type: LayoutType
  /** @description 是否显示边框 */
  bordered: boolean
  /** @description 反色样式（Header/Sider/Footer/Menu） */
  inverted: boolean
  /** @description 是否折叠侧边栏 */
  isCollapsed: boolean
  /** @description 头部高度 */
  headerHeight: number
  /** @description 底部高度 */
  footerHeight: number
  /** @description 侧边栏宽度 */
  siderWidth: number
  /** @description 折叠侧边栏宽度 */
  collapsedWidth: number
  /** @description 当前激活的路由键 */
  activeKey: string
  /** @description 菜单路由 */
  menuOptions: MenuOption[]
}> & {
  /** @description 基础路由 */
  baseRoutes: RouteRecordRaw[]
}
