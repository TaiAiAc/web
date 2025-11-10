import type { FormSchema } from './types'
import { isArray, isBoolean, isFunction, isNullOrUnDef, isObject, isString } from '@quiteer/is'
import {
  NCascader,
  NDatePicker,
  NDynamicInput,
  NDynamicTags,
  NInput,
  NInputNumber,
  NSelect,
  NSwitch,
  NTimePicker
} from 'naive-ui'
import UploadView from './components/UploadView.vue'

// 加工 form values
export function handleFormValues(values: Recordable) {
  if (!isObject(values)) {
    return {}
  }
  const res: Recordable = {}
  for (const item of Object.entries(values)) {
    let [key, value] = item
    if (!key || (isArray(value) && value.length === 0) || isFunction(value) || isNullOrUnDef(value)) {
      continue
    }
    // 删除空格
    if (isString(value)) {
      value = value.trim()
    }

    Reflect.set(res, key, value)
  }
  return res
}

export function getComponentProps(schema: FormSchema, disabled: boolean) {
  const compProps = schema.componentProps ?? {}

  const isReadonly = isBoolean(compProps.disabled) ? compProps.disabled : disabled

  const props = {
    clearable: !isReadonly,
    ...compProps
  }

  if (schema.component === 'NInput')
    return { ...props, readonly: isReadonly }

  return {
    disabled: isReadonly,
    ...props
  }
}

// 获取对应组件
export function getComponent(schema: FormSchema) {
  const components = {
    NInput,
    NInputNumber,
    NSelect,
    NSwitch,
    NDatePicker,
    NTimePicker,
    NCascader,
    NDynamicInput,
    NDynamicTags,
    NUpload: UploadView
  }

  return Reflect.get(components, schema.component ?? '')
}
