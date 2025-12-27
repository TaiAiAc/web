<script setup lang="ts">
/**
 * 引入 async-validator 类型以为声明生成提供稳定引用，避免 TS2742。
 * 仅类型导入，不会影响运行时体积或行为。
 */
import type {} from 'async-validator'
import type { ButtonProps } from 'naive-ui'
import type { Props } from './props'
import { isNullOrUnDef } from '@quiteer/is'
import { computed, nextTick, onMounted, ref, toRaw, unref, useAttrs, watch, watchEffect } from 'vue'
import { QuiForm } from '../form'

const props = withDefaults(defineProps<Props>(), {
  title: '搜索',
  labelWidth: 80,
  labelPlacement: 'top',
  layout: 'inline',
  inline: false,
  size: 'medium',
  isFull: true,
  showActionButtonGroup: true,
  showResetButton: true,
  resetButtonOptions: undefined,
  showSubmitButton: true,
  submitButtonOptions: undefined,
  showAdvancedButton: true,
  expanded: undefined,
  submitButtonText: '查询',
  resetButtonText: '重置',
  gridProps: undefined
})

const emit = defineEmits<{
  'reset': []
  'submit': [data: any]
  'update:expanded': [value: boolean]
}>()

const slots = defineSlots()

const attrs = useAttrs()

const formProps = computed(() => {
  return { ...toRaw(props), ...attrs }
})

const formRef = ref<InstanceType<typeof QuiForm>>()
const loadingSub = ref(false)

const submitBtnProps = computed((): ButtonProps => {
  return {
    size: props.size,
    type: 'primary',
    ...props.submitButtonOptions
  }
})

const resetBtnProps = computed((): ButtonProps => {
  return {
    size: props.size,
    type: 'default',
    ...props.resetButtonOptions
  }
})

/**
 * 提交搜索请求
 *
 * 校验内部表单并返回过滤后的字段值，同时触发外部 `submit` 事件。
 *
 * @param e - 原生点击/提交事件
 * @returns 成功时返回过滤后的表单数据对象；失败或未挂载时返回 `false`
 *
 * @example
 * ```ts
 * await handleSubmit()
 * ```
 *
 * @remarks
 * - 内部调用 `QuiForm.validate()` 保证校验一致性
 * - 使用 `loadingSub` 控制提交按钮 loading 状态
 */
async function handleSubmit(e?: Event): Promise<object | boolean> {
  if (e) {
    e.preventDefault()
  }
  loadingSub.value = true

  const formEl = unref(formRef)
  if (!formEl)
    return false
  try {
    await formEl.validate()
    const values = formEl.getFieldsValue()
    loadingSub.value = false
    emit('submit', values)
    return values
  }
  catch (error: any) {
    emit('submit', null)
    loadingSub.value = false
    console.error(error)
    return false
  }
}

/**
 * 重置搜索条件
 *
 * 调用内部表单的重置逻辑，并根据 `submitOnReset` 配置决定是否立即提交一次。
 *
 * @returns 无返回值
 *
 * @example
 * ```ts
 * resetFields()
 * ```
 *
 * @remarks
 * - 当 `submitOnReset` 为 `true` 时，重置后调用 `handleSubmit`
 */
async function resetFields(): Promise<void> {
  await formRef.value?.resetFields()
  if (props.submitOnReset) {
    await handleSubmit()
  }
}

const expandedNames = ref<string[]>([])

const isControlledExpanded = computed(() => typeof props.expanded !== 'undefined')

watch(
  () => props.expanded,
  (val) => {
    if (typeof val !== 'undefined') {
      expandedNames.value = val ? ['search'] : []
    }
  },
  { immediate: true }
)

watch(
  expandedNames,
  (names) => {
    emit('update:expanded', !!names.length)
  }
)

/**
 * 展开搜索栏
 *
 * @example
 * ```ts
 * expandedBar()
 * ```
 */
function expandedBar() {
  expandedNames.value = ['search']
}

/**
 * 收起搜索栏
 *
 * @example
 * ```ts
 * closeBar()
 * ```
 */
function closeBar() {
  expandedNames.value = []
}

/**
 * 表单重置事件处理
 *
 * 透传外部 `reset` 事件，并按需触发提交。
 */
async function onFormReset() {
  emit('reset')
  if (props.submitOnReset) {
    await handleSubmit()
  }
}

onMounted(() => {
  if (!props.showAdvancedButton && !isControlledExpanded.value) {
    expandedBar()
  }
})

watchEffect(() => {
  if (props.showAdvancedButton === false && !isControlledExpanded.value) {
    expandedBar()
  }
})

/**
 * 获取去除空值的表单字段
 *
 * 过滤 `null/undefined` 字段，避免将无效条件提交至后端。
 *
 * @returns 仅包含有效值的表单对象
 */
function getFilteredFieldsValue() {
  const state = formRef.value?.getFieldsValue() ?? {}
  const formState = {} as typeof state

  for (const key in state) {
    if (!isNullOrUnDef(state[key])) {
      formState[key] = state[key]
    }
  }
  return formState
}

defineExpose({
  getFormRef: () => formRef.value,
  getFieldsValue: getFilteredFieldsValue,
  submit: handleSubmit,
  reset: resetFields,
  expandedBar,
  closeBar,
  /**
   * 设置搜索数据并自动展开
   *
   * @param data - 需要写入的搜索条件键值对
   */
  setSearchData: async (data: Recordable) => {
    expandedBar()
    await nextTick()
    formRef.value?.setFieldsValue(data)
  },
  resetFields
})
</script>

<template>
  <NCard size="small">
    <NCollapse v-model:expanded-names="expandedNames" class="select-none" display-directive="show">
      <template v-if="showAdvancedButton" #header-extra>
        <NFlex align="center" :gap="0" class="text-purple-8">
          {{ expandedNames.length ? '关闭' : '展开' }}
          <i v-if="!expandedNames.length" class="i-mdi-arrow-up-down-bold" />
          <i v-else class="i-mdi-arrow-collapse-vertical" />
        </NFlex>
      </template>
      <NCollapseItem :title="title" name="search">
        <QuiForm ref="formRef" v-bind="formProps" size="small" @reset="onFormReset">
          <template v-for="(_, key, i) in slots" :key="i" #[key]="{ model, field, value }">
            <slot :name="key" :model="model" :field="field" :value="value" />
          </template>
          <template #action-button>
            <NButton
              v-if="showSubmitButton"
              size="small"
              v-bind="submitBtnProps"
              :loading="loadingSub"
              attr-type="submit"
              secondary
              @click="handleSubmit"
            >
              <template #icon>
                <i class="i-ic-round-search text-icon" />
              </template>
              {{ submitButtonText }}
            </NButton>
            <NButton v-if="showResetButton" size="small" secondary v-bind="resetBtnProps" @click="resetFields">
              <template #icon>
                <i class="i-ic-round-refresh text-icon" />
              </template>
              {{ resetButtonText }}
            </NButton>
          </template>
        </QuiForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<style lang="scss" scoped></style>
