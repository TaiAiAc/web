import type { ButtonProps } from 'naive-ui'
import type { BaseButtonProps } from '../base/props'
import type { ActionButtonMode, ActionItem } from './props'
import { unref } from 'vue'
import { DEFAULT_ACTION_ICONS } from './props'

const DEFAULT_ICON = 'carbon:unknown'

// 获取图标
export function getIcon(item: ActionItem) {
  if (item.icon)
    return item.icon
  return DEFAULT_ACTION_ICONS[item.key as string] || DEFAULT_ICON
}

// 判断是否禁用
export function isDisabled(item: ActionItem) {
  if (item.disabled === undefined)
    return false
  if (typeof item.disabled === 'function')
    return item.disabled()
  return unref(item.disabled)
}

export function getPopconfirmProps(item: ActionItem) {
  if (!item.popconfirm)
    return undefined

  if (typeof item.popconfirm === 'object') {
    const { onPositiveClick: _, ...rest } = item.popconfirm as any
    return rest
  }

  return item.popconfirm
}

// 解析按钮属性
export function resolveButtonProps(
  item: ActionItem,
  mode: ActionButtonMode = 'text',
  defaultButtonProps?: ButtonProps
): Omit<Partial<BaseButtonProps>, 'onClick'> {
  const { onClick: _1, ...restDefaultProps } = defaultButtonProps || {}
  const { onClick: _2, ...restItemProps } = item.props || {}

  const baseProps: Partial<BaseButtonProps> = {
    ...restDefaultProps,
    ...restItemProps,
    disabled: isDisabled(item),
    size: item.size || defaultButtonProps?.size,
    popconfirm: getPopconfirmProps(item),
    popText: item.popText,
    positiveText: item.positiveText,
    negativeText: item.negativeText,
    permission: item.permission
  }

  // Icon
  if (mode !== 'text') {
    baseProps.icon = getIcon(item)
  }

  // Label & Tooltip
  if (mode === 'icon') {
    baseProps.tooltip = item.tooltip || item.label
  }
  else {
    // label is handled in template via slot
    if (item.tooltip) {
      baseProps.tooltip = item.tooltip
    }
  }

  // Styling
  if (mode === 'button') {
    baseProps.text = false
  }
  else if (mode === 'secondary') {
    baseProps.text = false
    baseProps.secondary = true
    baseProps.type = 'primary'
  }
  else {
    baseProps.text = true
  }

  return baseProps as Omit<Partial<BaseButtonProps>, 'onClick'>
}

// 解析更多按钮属性
export function resolveMoreButtonProps(
  mode: ActionButtonMode = 'text',
  defaultButtonProps?: ButtonProps
): Omit<Partial<BaseButtonProps>, 'onClick'> {
  const { onClick: _, ...restDefaultProps } = defaultButtonProps || {}

  const baseProps: Partial<BaseButtonProps> = {
    ...restDefaultProps
  }

  if (mode !== 'text') {
    baseProps.icon = DEFAULT_ACTION_ICONS.more
  }

  if (mode !== 'icon') {
    // label is handled in template via slot
  }

  if (mode === 'button') {
    baseProps.text = false
  }
  else if (mode === 'secondary') {
    baseProps.text = false
    baseProps.secondary = true
    baseProps.type = 'primary'
  }
  else {
    baseProps.text = true
  }

  return baseProps as Omit<Partial<BaseButtonProps>, 'onClick'>
}
