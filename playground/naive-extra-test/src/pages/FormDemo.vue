<script setup lang="ts">
import type { FormSchema, UploadProps } from 'naive-extra'
import type { CascaderOption, CascaderProps, DatePickerProps, InputNumberProps, InputProps, SelectProps, TimePickerProps } from 'naive-ui'
import { QuiForm, useForm } from 'naive-extra'
import { reactive, ref } from 'vue'

function getOptions(depth = 3, iterator = 1, prefix = '') {
  const length = 12
  const options: CascaderOption[] = []
  for (let i = 1; i <= length; ++i) {
    if (iterator === 1) {
      options.push({
        value: `v-${i}`,
        label: `l-${i}`,
        disabled: i % 5 === 0,
        children: getOptions(depth, iterator + 1, `${String(i)}`)
      })
    }
    else if (iterator === depth) {
      options.push({
        value: `v-${prefix}-${i}`,
        label: `l-${prefix}-${i}`,
        disabled: i % 5 === 0
      })
    }
    else {
      options.push({
        value: `v-${prefix}-${i}`,
        label: `l-${prefix}-${i}`,
        disabled: i % 5 === 0,
        children: getOptions(depth, iterator + 1, `${prefix}-${i}`)
      })
    }
  }
  return options
}

const options = [
  {
    label: '选项1',
    value: '1'
  },
  {
    label: '选项2',
    value: '2'
  }
]

const schemas = reactive<FormSchema<any>[]>([
  {
    field: 'input',
    label: '输入框',
    component: 'NInput',
    rules: [{ required: true, trigger: ['blur', 'input'], message: '请输入内容' }],
    componentProps: {} as InputProps
  },
  {
    field: 'custom',
    label: '自定义的插槽',
    slot: 'custom',
    rules: [{ required: true, trigger: ['blur', 'input'], message: '请输入内容' }]
  },
  {
    field: 'number-input',
    label: '数字输入框',
    component: 'NInputNumber',
    rules: [{ required: true, trigger: ['blur', 'input'], message: '请输入数字' }],
    componentProps: {} as InputNumberProps
  },
  {
    field: 'select',
    label: '选择框',
    component: 'NSelect',
    rules: [{ required: true, trigger: ['blur', 'change'], message: '请选择选项' }],
    componentProps: {
      options
    } as SelectProps
  },
  {
    field: 'cascader',
    label: '级联选择',
    component: 'NCascader',
    rules: [{ required: true, trigger: ['blur', 'change'], message: '请选择选项' }],
    componentProps: {
      options: getOptions()
    } as CascaderProps
  },
  {
    field: 'time-picker',
    label: '时间选择器',
    component: 'NTimePicker',
    rules: [{ required: true, trigger: ['blur', 'change'], message: '请选择时间' }],
    componentProps: {
      options: getOptions()
    } as TimePickerProps
  },
  {
    field: 'date-picker',
    label: '日期选择器',
    component: 'NDatePicker',
    rules: [{ required: true, trigger: ['blur', 'change'], message: '请选择日期' }],
    componentProps: {
      options: getOptions()
    } as DatePickerProps
  },
  {
    field: 'date-picker',
    label: '日期范围选择器',
    component: 'NDatePicker',
    rules: [{ required: true, trigger: ['blur', 'change'], message: '请选择日期范围' }],
    componentProps: {
      type: 'daterange'
    } as DatePickerProps
  },
  {
    field: 'checkbox',
    label: '复选框',
    component: 'NCheckbox',
    rules: [{ required: true, trigger: ['blur', 'change'], message: '请选择复选框' }],
    componentProps: {
      options
    }
  },
  {
    field: 'radio',
    label: '单选',
    component: 'NRadioGroup',
    defaultValue: '1',
    componentProps: {
      options
    }
  },
  {
    field: 'switch',
    label: '开关',
    component: 'NSwitch',
    defaultValue: true,
    componentProps: {
      options
    }
  },
  {
    field: 'upload',
    label: '上传',
    component: 'NUpload',
    rules: [{ required: true, trigger: ['blur', 'change'], message: '请上传文件' }],
    componentProps: {
      fileType: 'image-view'
    } as UploadProps
  }
])

/**
 * 通过 useForm 演示如何动态更新 options/props/defaultValue
 */
const formRef = ref<InstanceType<typeof QuiForm>>()
const {
  setOptions,
  setComponentProps,
  setDefaultValue,
  upsertSchema,
  replaceSchema,
  removeSchema,
  listFields,
  toRulesMap,
  validate,
  resetFields,
  clearValidate,
  getFieldsValue
} = useForm(schemas, formRef)

/**
 * 异步拉取选择框选项
 */
async function loadSelectOptions() {
  const opts = await Promise.resolve([
    { label: '选项A', value: 'A' },
    { label: '选项B', value: 'B' },
    { label: '选项C', value: 'C' }
  ])
  setOptions('select', opts)
  setComponentProps('select', { clearable: true, filterable: true })
  setDefaultValue('select', 'B')
}

/**
 * 新增一个动态字段，并设置默认值
 */
// 已改为 addDynamicField，移除旧示例

const formState = ref({})

function handleSubmit(model: any) {
  console.info('model: ', model)
  formState.value = getFieldsValue() || {}
}

function handleReset() {
  resetFields()
  clearValidate()
}

async function handleValidate() {
  await validate()
}

const inline = ref(true)

// 扩展示例：更多 useForm API
const debugFields = ref<string[]>([])
const debugRules = ref<Record<string, any[]>>({})

function showFields() {
  debugFields.value = listFields()
}

function showRules() {
  debugRules.value = toRulesMap()
}

function patchSelectToFilterable() {
  setComponentProps('select', { filterable: true, clearable: true })
}

function setSelectDefaultB() {
  setDefaultValue('select', 'B')
}

function replaceNumberToInput() {
  replaceSchema('number-input', { component: 'NInput' })
}

function addDynamicField() {
  upsertSchema({
    field: 'dynamic-field',
    label: '动态字段',
    component: 'NInput',
    defaultValue: '动态值'
  })
}

function removeDynamicField() {
  removeSchema('dynamic-field')
}

function fillValuesQuickly() {
  formRef.value?.setFieldsValue({
    input: 'Hello UseForm',
    select: '1'
  })
}
</script>

<template>
  <n-card title="适用大部分场景的表单" size="small">
    <n-card title="控制表单">
      <n-space>
        <n-button type="primary" @click="handleValidate">
          校验
        </n-button>
        <n-button type="primary" @click="handleReset">
          重置
        </n-button>
        <n-button type="primary" @click="loadSelectOptions">
          异步加载选择框选项
        </n-button>
        <n-button @click="patchSelectToFilterable">
          选择框支持过滤/清空
        </n-button>
        <n-button @click="setSelectDefaultB">
          选择框默认值设为 B
        </n-button>
        <n-button @click="replaceNumberToInput">
          将数字输入替换为普通输入
        </n-button>
        <n-button @click="addDynamicField">
          新增动态字段
        </n-button>
        <n-button type="error" @click="removeDynamicField">
          移除动态字段
        </n-button>
        <n-button type="warning" @click="fillValuesQuickly">
          批量填充值
        </n-button>
        <n-button @click="showFields">
          列出字段
        </n-button>
        <n-button @click="showRules">
          导出规则映射
        </n-button>
        <n-button type="primary" @click="inline = !inline">
          更换布局
        </n-button>
      </n-space>
    </n-card>
    <n-card>
      <QuiForm
        ref="formRef"
        :schemas="schemas"
        :inline="inline"
        label-width="100"
      >
        <template #custom="{ model, field }">
          <n-input v-model:value="model[field]" />
        </template>
        <template #action-button="{ model }">
          <n-button type="primary" @click="handleSubmit(model)">
            提交
          </n-button>
        </template>
      </QuiForm>
    </n-card>
    <n-flex :wrap="false">
      <n-card>
        <QuiForm
          ref="formRef"
          :schemas="schemas"
          label-width="100"
        >
          <template #action-button="{ model }">
            <n-button type="primary" @click="handleSubmit(model)">
              提交
            </n-button>
          </template>
        </QuiForm>
      </n-card>
      <n-card title="表单数据">
        {{ formState }}
      </n-card>
    </n-flex>
  </n-card>
</template>

<style lang="scss" scoped></style>
