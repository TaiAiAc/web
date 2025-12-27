<script setup lang="ts">
import type { FormProps, FormRules, GridProps, NForm } from 'naive-ui'
import type { Props } from './props'
import { isArray, isBoolean, isNullOrUnDef } from '@quiteer/is'
import { computed, nextTick, onMounted, reactive, ref, toRaw, unref, useAttrs } from 'vue'
import { getComponent, getComponentProps, handleFormValues } from './helper'

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  labelWidth: 80,
  labelPlacement: 'top',
  layout: 'inline',
  inline: false,
  size: 'medium',
  isFull: true,
  gridProps: undefined
})

const emit = defineEmits<{
  reset: []
}>()
const attrs = useAttrs()
const formProps = computed((): FormProps => {
  const rules: FormRules = {}

  props.schemas.forEach((item) => {
    if (item.rules && isArray(item.rules)) {
      rules[item.field] = item.rules
    }
  })

  return {
    labelWidth: props.labelWidth,
    inline: props.inline,
    size: props.size,
    labelPlacement: props.labelPlacement,
    labelAlign: 'left',
    rules,
    ...unref(attrs)
  }
})

const getGrid = computed((): GridProps => {
  return {
    cols: props.inline ? '1 s:2 m:4 l:5  2xl:6' : '1',
    xGap: 10,
    responsive: 'screen',
    ...props.gridProps
  }
})

const formElRef = ref<InstanceType<typeof NForm>>()
const formModel = reactive<Recordable>({})
const defaultFormModel = ref<Recordable>({})

// 初始化默认值
function initDefault() {
  const obj: Record<string, string | number> = {}
  props.schemas.forEach((item) => {
    const { defaultValue } = item
    if (!isNullOrUnDef(defaultValue)) {
      obj[item.field] = defaultValue
      formModel[item.field] = defaultValue
    }
  })
  defaultFormModel.value = obj
}

onMounted(() => {
  initDefault()
})

// 验证
/**
 * 表单校验函数：
 * 统一返回 Promise<void>，避免类型推断依赖 async-validator 的内部路径。
 */
function validate(): Promise<void> {
  const form = unref(formElRef)
  if (!form) {
    return Promise.resolve()
  }

  return form.validate().then(() => {})
}

/**
 * 清空校验状态：
 * 当表单未挂载时直接返回已完成的 Promise，保证返回类型稳定。
 */
async function clearValidate(): Promise<void> {
  const form = unref(formElRef)
  if (!form) {
    return
  }
  await form.restoreValidation()
}

// 重置
async function resetFields(): Promise<void> {
  const formEl = unref(formElRef)
  if (!formEl)
    return

  Object.keys(formModel).forEach((key) => {
    formModel[key] = unref(defaultFormModel)[key] || null
  })
  await clearValidate()
  emit('reset')
}

// 获取表单值
function getFieldsValue() {
  const form = handleFormValues(toRaw(formModel))
  return form
}

const isSetFieldsValue = ref(false)

defineExpose({
  // 验证
  validate,
  // 重置
  resetFields,
  // 清空校验
  clearValidate,
  // 获取表单值
  getFieldsValue,
  // 设置表单字段值
  setFieldsValue(values: Recordable) {
    isSetFieldsValue.value = true
    const fields = unref(props.schemas)
      ?.map(item => item.field)
      ?.filter(Boolean)

    Object.keys(values).forEach((key) => {
      const value = values[key]
      if (value && fields.includes(key)) {
        formModel[key] = value
      }
    })
    nextTick(() => {
      isSetFieldsValue.value = false
    })
  }
})
</script>

<template>
  <NForm v-bind="formProps" id="__AI_FORM__" ref="formElRef" :model="formModel">
    <NGrid v-bind="getGrid" :style="gridStyle">
      <NFormItemGi
        v-for="schema in schemas"
        v-bind="schema.giProps ? schema.giProps : giProps"
        :key="schema.field"
        :label="schema.label"
        :path="schema.field"
      >
        <!-- 标签名右侧温馨提示 -->
        <template v-if="schema.labelMessage" #label>
          {{ schema.label }}
          <NTooltip trigger="hover" :style="schema.labelMessageStyle">
            <template #trigger>
              <i class="i-material-symbols-info-outline relative top--1 text-4 text-amber" />
            </template>
            {{ schema.labelMessage }}
          </NTooltip>
        </template>

        <!-- 判断插槽 -->
        <template v-if="schema.slot">
          <slot :name="schema.slot" :model="formModel" :field="schema.field" :value="formModel[schema.field]" />
        </template>

        <!-- NCheckbox -->
        <template v-else-if="schema.component === 'NCheckbox' && schema.componentProps">
          <NCheckboxGroup
            v-model:value="formModel[schema.field]"
            :disabled="isBoolean(schema.componentProps.disabled) ? schema.componentProps.disabled : disabled"
          >
            <NSpace>
              <NCheckbox
                v-for="item in schema.componentProps.options"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </NSpace>
          </NCheckboxGroup>
        </template>

        <!-- NRadioGroup -->
        <template v-else-if="schema.component === 'NRadioGroup' && schema.componentProps">
          <NRadioGroup v-model:value="formModel[schema.field]" v-bind="getComponentProps(schema, disabled)">
            <NSpace>
              <NRadio v-for="item in schema.componentProps.options" :key="item.value" :value="item.value">
                {{ item.label }}
              </NRadio>
            </NSpace>
          </NRadioGroup>
        </template>

        <!-- NSwitch -->
        <template v-else-if="schema.component === 'NSwitch' && schema.componentProps">
          <NSwitch v-model:value="formModel[schema.field]" v-bind="getComponentProps(schema, disabled)">
            <template #checked>
              {{ schema.componentProps?.checkedText }}
            </template>
            <template #unchecked>
              {{ schema.componentProps?.uncheckedText }}
            </template>
          </NSwitch>
        </template>

        <!-- 动态渲染表单组件 -->
        <component
          v-bind="getComponentProps(schema, disabled)"
          :is="getComponent(schema)"
          v-else
          v-model:value="formModel[schema.field]"
          :is-set-fields-value="isSetFieldsValue"
          :class="{ 'w-full': schema.isFull !== false && isFull }"
        />
        <!-- 组件后面的内容 -->
        <template v-if="schema.suffix">
          <slot :name="schema.suffix" :model="formModel" :field="schema.field" :value="formModel[schema.field]" />
        </template>
      </NFormItemGi>

      <!-- 提交 重置 展开 收起 按钮 -->
      <NGi :span="inline ? '' : 24" :suffix="inline ? true : false">
        <NSpace align="center" justify="end" class="h-full">
          <slot name="action-button" :model="formModel" />
        </NSpace>
      </NGi>
    </NGrid>
  </NForm>
</template>

<style lang="scss" scoped></style>
