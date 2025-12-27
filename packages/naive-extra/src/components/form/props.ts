import type { GridItemProps, GridProps, SwitchProps } from 'naive-ui'
import type { CSSProperties } from 'vue'

export type ComponentType
  = | 'NInput'
    | 'NInputGroup'
    | 'NInputPassword'
    | 'NInputSearch'
    | 'NInputTextArea'
    | 'NInputNumber'
    | 'NInputCountDown'
    | 'NDynamicInput'
    | 'NSelect'
    | 'NTreeSelect'
    | 'NRadioButtonGroup'
    | 'NRadioGroup'
    | 'NCheckbox'
    | 'NCheckboxGroup'
    | 'NAutoComplete'
    | 'NCascader'
    | 'NDatePicker'
    | 'NMonthPicker'
    | 'NRangePicker'
    | 'NWeekPicker'
    | 'NTimePicker'
    | 'NSwitch'
    | 'NStrengthMeter'
    | 'NUpload'
    | 'NIconPicker'
    | 'NRender'
    | 'NSlider'
    | 'NRate'
    | 'NDynamicTags'
    | 'NImage'

export interface FormSchema<T = Recordable<string>> {
  field: keyof T
  label: string
  labelMessage?: string
  labelMessageStyle?: object | string
  defaultValue?: any
  component?: ComponentType
  componentProps?: Record<string, any>
  slot?: string
  rules?: object[]
  giProps?: GridItemProps
  isFull?: boolean
  suffix?: string
}

export interface Props {
  schemas: FormSchema<Recordable<string>>[]
  disabled?: boolean
  // 标签宽度  固定宽度
  labelWidth?: number | string
  labelPlacement?: 'top' | 'left'
  // 是否展示为行内表单
  inline?: boolean
  // 大小
  size?: 'small' | 'medium' | 'large'
  // 组件是否width 100%
  isFull?: boolean
  // grid 配置
  gridProps?: GridProps
  // grid 样式
  gridStyle?: CSSProperties
  // gi配置
  giProps?: GridItemProps
}

export interface CustomSwitchProps extends SwitchProps {
  checkedText: string
  uncheckedText: string
}
