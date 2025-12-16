<script setup lang="ts">
import type { FormSchema, UploadProps } from '@quiteer/naive-extra'
import type { CascaderOption, CascaderProps, DatePickerProps, InputNumberProps, InputProps, SelectProps, TimePickerProps } from 'naive-ui'
import { QuiForm } from '@quiteer/naive-extra'
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

const formRef = ref<InstanceType<typeof QuiForm>>()

const formState = ref({})

function handleSubmit(model: any) {
  console.log('model: ', model)
  formState.value = formRef.value?.getFieldsValue()
}

function handleReset() {
  formRef.value?.resetFields()
  formRef.value?.clearValidate()
}

async function handleValidate() {
  await formRef.value?.validate()
}

const inline = ref(true)
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
    <n-flex>
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
