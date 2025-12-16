# QuiForm 组件

## 基本用法

<script setup lang="ts">
import FormDemo from './components/FormDemo.vue'
</script>

<ClientOnly>
  <Demo />
  <FormDemo />
</ClientOnly>

## 属性（Props）

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `` `schemas` `` | `{ field: string; label: string; component: string; rules?: any[]; }[]` | — | 表单字段定义数组，每个项包含字段名、标签、组件类型及校验规则等 |
| `` `model` `` | `Record<string, any>` | — | 初始表单数据对象（可选） |
| `` `size` `` | `` 'small' \| 'medium' \| 'large' `` | — | 表单控件尺寸 |
| `` `layout` `` | `object` | — | 布局配置，透传给 `naive-ui` 的 `NForm` 属性（如 `labelPlacement`、`labelWidth` 等） |

## 插槽（Slots）

| 插槽名 | 说明 | 作用 |
|--------|------|------|
| `` `action-button` `` | 操作区按钮插槽 | 自定义提交、重置、导出等操作按钮区域 |
| `` `{field}` `` | 动态字段插槽（`field` 为字段名） | 替换指定字段的默认渲染内容，实现高度自定义表单项 |

## 实例方法（Ref）

| 方法名 | 参数 | 说明 |
|--------|------|------|
| `` `validate` `` | — | 触发表单校验，返回 `Promise<boolean>`（校验通过为 `true`） |
| `` `resetFields` `` | — | 将表单字段重置为初始值（即 `model` 的原始状态） |
| `` `clearValidate` `` | — | 清除所有字段的校验状态（错误提示等） |
| `` `getFieldsValue` `` | — | 获取当前所有字段的值，返回 `Record<string, any>` |
| `` `setFieldsValue` `` | `values: Record<string, any>` | 批量更新表单字段值，支持部分字段更新 |

## 示例：定义与提交

```vue
<script setup lang="ts">
import type { FormSchema } from '@quiteer/naive-extra'
import { QuiForm } from '@quiteer/naive-extra'
import { ref } from 'vue'

const schemas: FormSchema[] = [
  { field: 'name', label: '姓名', component: 'NInput', rules: [{ required: true, message: '请输入姓名' }] },
  { field: 'age', label: '年龄', component: 'NInputNumber' }
]

const formRef = ref<any>()

/**
 * 函数：提交表单
 * 作用：触发校验并获取表单值，用于后续请求或处理
 */
async function handleSubmit() {
  await formRef.value?.validate()
  const values = formRef.value?.getFieldsValue()
  console.log('submit values:', values)
}

/**
 * 函数：设置演示初始值
 * 作用：批量设置字段，演示 setFieldsValue 用法
 */
function setInitialValues() {
  formRef.value?.setFieldsValue({ name: '张三', age: 20 })
}

/**
 * 函数：清空表单
 * 作用：重置字段到初始值并清除校验状态
 */
function resetForm() {
  formRef.value?.resetFields()
  formRef.value?.clearValidate()
}
</script>

<template>
  <QuiForm ref="formRef" :schemas="schemas">
    <template #action-button>
      <NButton type="primary" @click="handleSubmit">
        提交
      </NButton>
      <NButton @click="setInitialValues">
        设为示例初始值
      </NButton>
      <NButton @click="resetForm">
        重置
      </NButton>
    </template>
  </QuiForm>
</template>
```

## 与上传组件集成

```vue
<script setup lang="ts">
import type { FormSchema } from '@quiteer/naive-extra'
import { AcceptType, QuiForm, QuiUpload, useUploadProps } from '@quiteer/naive-extra'

const schemas: FormSchema[] = [
  { field: 'name', label: '姓名', component: 'NInput' },
  { field: 'avatar', label: '头像', component: 'QuiUpload' }
]

const uploadProps = useUploadProps({
  accept: AcceptType.Image,
  multiple: true,
  fileType: 'image-view'
})

/**
 * 函数：表单提交
 * 作用：处理包含上传字段的表单值（可能是字符串或文件列表）
 */
function handleSubmit(values: Record<string, any>) {
  console.log('values:', values)
}
</script>

<template>
  <QuiForm :schemas="schemas" @submit="handleSubmit">
    <template #avatar>
      <QuiUpload v-bind="uploadProps" />
    </template>
  </QuiForm>
</template>
```

## 提示

- 复杂字段建议使用自定义插槽以获得更高的灵活性
- 表单值获取与设置均通过实例方法完成，避免手动维护本地状态
