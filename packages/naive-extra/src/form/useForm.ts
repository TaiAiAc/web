// 获取 schemas 中的 select 组件的配置项
// 可以从外部配置 下拉选项
// 场景通过接口获取下拉选项

import type { FormSchema } from './props'

export function useForm(schemas: FormSchema[]) {
  function useItemByField(field: string) {
    return schemas.find(item => item.field === field)
  }

  return {
    useItemByField
  }
}
