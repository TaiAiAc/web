import type { ButtonProps, PopconfirmProps } from 'naive-ui'

export interface ButtonPermission {
  /** 权限组：[拥有的权限列表, 需要的权限] */
  group: [string[], string]
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示 */
  show?: boolean
}

export interface BaseButtonProps extends /* @vue-ignore */ ButtonProps {
  /** 图标名称 */
  icon?: string
  /** 提示文本 */
  tooltip?: string
  /** 是否为文本按钮 */
  text?: boolean
  /** Popconfirm 配置 */
  popconfirm?: PopconfirmProps
  /** Popconfirm 内容文本 */
  popText?: string
  /** Popconfirm 确认按钮文本 */
  positiveText?: string
  /** Popconfirm 取消按钮文本 */
  negativeText?: string
  /** 权限 */
  permission?: ButtonPermission
}
