import type { ButtonProps, PopconfirmProps } from 'naive-ui'
import type { Ref } from 'vue'
import type { ButtonPermission } from '../base/props'

export type ActionButtonMode = 'icon' | 'text' | 'icon-text' | 'button' | 'secondary'

export enum ActionEnum {
  EDIT = 'edit',
  DELETE = 'delete',
  VIEW = 'view',
  ADD = 'add',
  SEARCH = 'search',
  DOWNLOAD = 'download',
  UPLOAD = 'upload',
  SETTING = 'setting'
}

export interface ActionItem {
  /** 唯一标识，也是默认的图标映射键值 */
  key: ActionEnum | string
  /** 按钮显示文本 */
  label: string
  /** 按钮尺寸 */
  size?: ButtonProps['size']
  /** 图标名称，如果不传则显示 defaultIcon */
  icon?: string
  /** 按钮属性 */
  props?: ButtonProps
  /** 点击事件 */
  onClick?: (key: ActionEnum | string, item: ActionItem) => void
  /** 是否显示 */
  show?: boolean | (() => boolean) | Ref<boolean>
  /** 是否禁用 */
  disabled?: boolean | (() => boolean) | Ref<boolean>
  /** 提示文本，默认使用 label */
  tooltip?: string
  /** 二次确认框配置，存在则开启二次确认 */
  popconfirm?: PopconfirmProps
  /** 确认框内容 */
  popText?: string
  /** 确认按钮文字 */
  positiveText?: string
  /** 取消按钮文字 */
  negativeText?: string
  /** 确认回调 */
  onPositiveClick?: (key: ActionEnum | string, item: ActionItem) => void
  /** 权限控制 */
  permission?: ButtonPermission
}

export const DEFAULT_ACTION_ICONS: Record<string, string> = {
  [ActionEnum.EDIT]: 'carbon:edit',
  [ActionEnum.DELETE]: 'carbon:trash-can',
  [ActionEnum.VIEW]: 'carbon:view',
  [ActionEnum.ADD]: 'carbon:add',
  [ActionEnum.SEARCH]: 'carbon:search',
  [ActionEnum.DOWNLOAD]: 'carbon:download',
  [ActionEnum.UPLOAD]: 'carbon:upload',
  [ActionEnum.SETTING]: 'carbon:settings',
  more: 'carbon:overflow-menu-horizontal'
}

export interface ActionButtonProps {
  /** 操作按钮列表 */
  actions?: ActionItem[]
  /** 显示模式：纯图标 | 纯文字 | 图标+文字 */
  mode?: ActionButtonMode
  /** 最大显示数量，超过折叠 */
  max?: number
  /** 统一的按钮属性 */
  buttonProps?: ButtonProps
  /** 按钮尺寸 */
  size?: ButtonProps['size']
  /** 是否显示分割线 */
  showDivider?: boolean
  /** 是否开启响应式折叠，开启后 max 属性失效，根据宽度自动计算显示数量 */
  responsive?: boolean
}
