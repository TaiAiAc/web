<script setup lang="ts">
import type { ButtonProps } from 'naive-ui'
import type { Props } from './types'
import { isNullOrUnDef } from '@quiteer/is'
import { computed, nextTick, ref, toRaw, unref, useAttrs } from 'vue'
import { AmForm } from '../form'

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
  submitButtonText: '查询',
  resetButtonText: '重置',
  gridProps: undefined
})

const emit = defineEmits<{
  reset: []
  submit: [data: any]
}>()

const slots = defineSlots()

const attrs = useAttrs()

const formProps = computed(() => {
  return { ...toRaw(props), ...attrs }
})

const formRef = ref<InstanceType<typeof AmForm>>()
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

// 提交
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

function resetFields() {
  formRef.value?.resetFields()
}

const expandedNames = ref<string[]>([])

function expandedBar() {
  expandedNames.value = ['search']
}

function closeBar() {
  expandedNames.value = []
}

defineExpose({
  getFormRef: () => formRef.value,
  getFieldsValue: () => {
    // 这里作为搜索栏时单独处理一遍
    const state = formRef.value?.getFieldsValue() ?? {}
    const formState = {} as typeof state

    for (const key in state) {
      if (!isNullOrUnDef(state[key])) {
        formState[key] = state[key]
      }
    }

    return formState
  },
  expandedBar,
  closeBar,
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
      <template #header-extra>
        <NFlex align="center" :gap="0" class="text-purple-8">
          {{ expandedNames.length ? '关闭' : '展开' }}
          <icon-mdi-arrow-up-down-bold v-if="!expandedNames.length" />
          <icon-mdi-arrow-collapse-vertical v-else />
        </NFlex>
      </template>
      <NCollapseItem :title="title" name="search">
        <AmForm ref="formRef" v-bind="formProps" size="small" @reset="emit('reset')">
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
                <icon-ic-round-search class="text-icon" />
              </template>
              {{ submitButtonText }}
            </NButton>
            <NButton v-if="showResetButton" size="small" secondary v-bind="resetBtnProps" @click="resetFields">
              <template #icon>
                <icon-ic-round-refresh class="text-icon" />
              </template>
              {{ resetButtonText }}
            </NButton>
          </template>
        </AmForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<style lang="scss" scoped></style>
