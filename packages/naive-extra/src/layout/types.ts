/**
 * 应用布局类型枚举（kebab-case 格式）
 * 用于动态切换页面整体结构，省略 "layout" 后缀以保持简洁
 */
export type LayoutType
  /**
   * 左侧纯菜单布局：左侧为垂直导航菜单，右侧为主内容区
   */
  = | 'left-menu'

  /**
   * 左侧混合布局：左侧包含菜单及其他功能模块（如用户信息、快捷入口等）
   */
    | 'left-mixed'

  /**
   * 左侧混合 + 顶部优先布局：左侧有混合内容，但顶部区域（如全局导航或搜索栏）在视觉或交互上占主导地位
   */
    | 'left-mixed-top-priority'

  /**
   * 顶部纯菜单布局：顶部为水平导航菜单，下方为主内容区（无侧边栏）
   */
    | 'top-menu'

  /**
   * 顶部混合 + 侧边优先布局：顶部含导航或操作栏，但页面主要内容由左侧/右侧侧边区域承载（如配置面板、目录树等）
   */
    | 'top-mixed-side-priority'

  /**
   * 顶部混合 + 顶部优先布局：顶部区域包含主导航及核心操作，侧边内容为辅助信息（如筛选条件、状态面板）
   */
    | 'top-mixed-top-priority'

  /**
   * 无菜单布局：页面不包含任何主导航菜单，适用于登录页、引导页、全屏应用等场景
   */
    | 'blank'

export interface RouteMeta {
  /**
   * 页面标题（用于 document.title 或 tab 标签）
   */
  title?: string

  /**
   * 是否需要认证（true: 需登录，false: 免登录）
   * @default true
   */
  requiresAuth?: boolean

  /**
   * 所需权限（字符串数组或字符串）
   */
  permissions?: string | string[]

  /**
   * 所属角色（如 'admin', 'user'）
   */
  roles?: string[]

  /**
   * 是否在侧边栏菜单中显示
   * @default true
   */
  showInMenu?: boolean

  /**
   * 菜单图标（Iconify 格式，如 'mdi:home'）
   */
  icon?: string

  /**
   * 使用的布局名称（如 'blank', 'main'）
   */
  layout?: 'blank' | 'main'

  /**
   * 是否开启 keep-alive 缓存
   */
  keepAlive?: boolean

  /**
   * 页面过渡动画名
   */
  transition?: string

  // 可继续扩展...
}
