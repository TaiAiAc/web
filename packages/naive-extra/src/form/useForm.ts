import type { Ref } from 'vue'
import type { FormSchema } from './props'

interface Option { label: string, value: any, disabled?: boolean }

/**
 * 基于表单 `schemas` 提供便捷的查询与更新工具
 *
 * 适用于外部通过接口动态配置下拉选项、默认值、组件属性等场景，
 * 对传入的 `schemas` 进行就地更新（保持响应式）。
 *
 * @param schemas - 表单项描述数组，建议传入响应式引用
 * @returns 返回一组对 `schemas` 的操作方法
 *
 * @example
 * ```ts
 * const { setOptions, setComponentProps } = useForm(schemas)
 * setOptions('status', [{ label: '启用', value: 1 }])
 * setComponentProps('status', { clearable: true })
 * ```
 *
 * @remarks
 * - 所有更新均为原地更新，适配 Vue 的响应式数组/对象
 * - 仅对存在的字段进行更新，不会抛异常
 *
 * @security
 * 请勿在 `componentProps` 中写入敏感信息
 *
 * @performance
 * 操作复杂度均为 O(n) 或更低，适合一般表单规模
 */
export function useForm(schemas: FormSchema[], formRef?: Ref<any>) {
  /**
   * 查找指定字段的 schema
   *
   * @param field - 字段名
   * @returns 命中的 `FormSchema` 或 `undefined`
   *
   * @example
   * ```ts
   * const schema = useItemByField('status')
   * ```
   */
  function useItemByField(field: string) {
    return schemas.find(item => item.field === field)
  }

  /**
   * 为 Select/RadioGroup/Checkbox 等具备 `options` 的组件设置选项
   *
   * @param field - 字段名
   * @param options - 选项数组，包含 `label` 与 `value`
   *
   * @example
   * ```ts
   * setOptions('status', [
   *   { label: '未上架', value: 0 },
   *   { label: '已上架', value: 1 }
   * ])
   * ```
   *
   * @remarks
   * - 支持的组件：`NSelect`、`NRadioGroup`、`NCheckbox`
   */
  function setOptions(field: string, options: Option[]) {
    const target = useItemByField(field)
    if (!target)
      return
    const comp = target.component
    const allow = comp === 'NSelect' || comp === 'NRadioGroup' || comp === 'NCheckbox'
    if (!allow)
      return
    if (!target.componentProps || typeof target.componentProps !== 'object') {
      target.componentProps = {}
    }
    target.componentProps.options = options
  }

  /**
   * 获取指定字段的选项数组
   *
   * @param field - 字段名
   * @returns 选项数组或 `undefined`
   *
   * @example
   * ```ts
   * const opts = getOptions('status')
   * ```
   */
  function getOptions(field: string): Option[] | undefined {
    const target = useItemByField(field)
    return target?.componentProps?.options
  }

  /**
   * 合并更新组件属性 `componentProps`
   *
   * @param field - 字段名
   * @param props - 待合并的属性对象
   *
   * @example
   * ```ts
   * setComponentProps('status', { clearable: true })
   * ```
   */
  function setComponentProps(field: string, props: Record<string, any>) {
    const target = useItemByField(field)
    if (!target)
      return
    if (!target.componentProps || typeof target.componentProps !== 'object') {
      target.componentProps = {}
    }
    Object.assign(target.componentProps, props)
  }

  /**
   * 设置单个字段的默认值
   *
   * @param field - 字段名
   * @param value - 默认值
   *
   * @example
   * ```ts
   * setDefaultValue('status', 1)
   * ```
   */
  function setDefaultValue(field: string, value: any) {
    const target = useItemByField(field)
    if (!target)
      return
    target.defaultValue = value
  }

  /**
   * 局部更新指定字段的 schema
   *
   * @param field - 字段名
   * @param patch - 局部更新内容
   *
   * @example
   * ```ts
   * replaceSchema('status', { label: '上架状态', component: 'NSelect' })
   * ```
   */
  function replaceSchema(field: string, patch: Partial<FormSchema>) {
    const target = useItemByField(field)
    if (!target)
      return
    Object.assign(target, patch)
  }

  /**
   * 新增或替换（按 `field` 唯一）一个 schema
   *
   * @param schema - 完整的表单项描述
   *
   * @example
   * ```ts
   * upsertSchema({ field: 'title', label: '标题', component: 'NInput' })
   * ```
   */
  function upsertSchema(schema: FormSchema) {
    const idx = schemas.findIndex(s => s.field === schema.field)
    if (idx >= 0) {
      schemas[idx] = { ...schemas[idx], ...schema }
    }
    else {
      schemas.push(schema)
    }
  }

  /**
   * 移除指定字段的 schema
   *
   * @param field - 字段名
   * @returns 是否删除成功
   *
   * @example
   * ```ts
   * const ok = removeSchema('status')
   * ```
   */
  function removeSchema(field: string): boolean {
    const idx = schemas.findIndex(s => s.field === field)
    if (idx < 0)
      return false
    schemas.splice(idx, 1)
    return true
  }

  /**
   * 列出所有字段名
   *
   * @returns 字段名数组
   *
   * @example
   * ```ts
   * const fields = listFields()
   * ```
   */
  function listFields(): string[] {
    return schemas.map(s => String(s.field))
  }

  /**
   * 从 `schemas` 生成规则映射（`path -> rules[]`）
   *
   * @returns 规则映射对象
   *
   * @example
   * ```ts
   * const rules = toRulesMap()
   * ```
   */
  function toRulesMap(): Record<string, object[]> {
    const acc: Record<string, object[]> = {}
    schemas.forEach((s) => {
      if (Array.isArray(s.rules) && s.rules.length) {
        acc[String(s.field)] = s.rules
      }
    })
    return acc
  }

  function getFormRef() {
    return formRef?.value
  }

  function bindFormRef(ref: Ref<any>) {
    ;(formRef as any) = ref
  }

  function validate(): Promise<void> | undefined {
    return formRef?.value?.validate()
  }

  function resetFields(): Promise<void> | undefined {
    return formRef?.value?.resetFields()
  }

  function clearValidate(): Promise<void> | undefined {
    return formRef?.value?.clearValidate()
  }

  function getFieldsValue(): Record<string, any> | undefined {
    return formRef?.value?.getFieldsValue()
  }

  function setFieldsValue(values: Record<string, any>): void {
    formRef?.value?.setFieldsValue(values)
  }

  return {
    useItemByField,
    setOptions,
    getOptions,
    setComponentProps,
    setDefaultValue,
    replaceSchema,
    upsertSchema,
    removeSchema,
    listFields,
    toRulesMap,
    getFormRef,
    bindFormRef,
    validate,
    resetFields,
    clearValidate,
    getFieldsValue,
    setFieldsValue
  }
}
