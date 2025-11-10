import type { ButtonProps } from 'naive-ui'
import type { FormProps } from '../form'

export interface Props extends FormProps {
  title?: string
  // 是否显示操作按钮（查询/重置）
  showActionButtonGroup?: boolean
  // 显示重置按钮
  showResetButton?: boolean
  // 重置按钮配置
  resetButtonOptions?: ButtonProps
  // 显示确认按钮
  showSubmitButton?: boolean
  // 确认按钮配置
  submitButtonOptions?: ButtonProps
  // 展开收起按钮
  showAdvancedButton?: boolean
  // 确认按钮文字
  submitButtonText?: string
  // 重置按钮文字
  resetButtonText?: string
  // 重置时是否提交表单
  submitOnReset?: boolean
}
