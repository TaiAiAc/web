# @quiteer/naive-extra

**概述**
- 提供表单、搜索栏、表格、上传、提示按钮与图标等增强封装。
- 统一导出组件与类型，便于按需组合与类型推断。
- 推荐结合 UnoCSS 使用。

**导入与使用示例**

```vue
<script setup lang="ts">
import type { FormSchema, TableProps } from '@quiteer/naive-extra'
import { AcceptType, QuiForm, QuiPopconfirmButton, QuiSearchBar, QuiTable, QuiTooltipButton, QuiUpload, useUploadProps } from '@quiteer/naive-extra'

/**
 * 表单字段定义：
 * 使用 FormSchema 描述字段、组件与校验规则。
 */
const schemas: FormSchema[] = [
  { field: 'name', label: '姓名', component: 'NInput', rules: [{ required: true, message: '请输入姓名' }] },
  { field: 'age', label: '年龄', component: 'NInputNumber' }
]

/**
 * 表格配置：
 * 定义列与数据获取函数；结合 TableProps 类型保证配置完整性。
 */
const tableProps: TableProps = {
  size: 'small',
  columns: [
    { title: '姓名', key: 'name' },
    { title: '年龄', key: 'age' }
  ]
}

/**
 * 上传组件属性：
 * 通过 useUploadProps 生成常用上传配置，结合 AcceptType 控制文件类型。
 */
const uploadProps = useUploadProps({
  accept: AcceptType.Images,
  multiple: true
})

/**
 * 提交事件：
 * 调用表单实例方法 validate/getFieldsValue 完成校验与取值。
 */
function handleSubmit(values: Record<string, any>) {
  // 这里处理表单提交结果
  console.log('submit values:', values)
}
</script>

<template>
  <QuiSearchBar
    :schemas="schemas"
    @submit="handleSubmit"
  />

  <QuiForm :schemas="schemas">
    <template #action-button>
      <QuiTooltipButton type="primary">
        提示按钮
      </QuiTooltipButton>
      <QuiPopconfirmButton>二次确认</QuiPopconfirmButton>
    </template>
  </QuiForm>

  <QuiTable v-bind="tableProps" />

  <QuiUpload v-bind="uploadProps" />
</template>
```

**组件概览**
- `form/`：动态表单，暴露 `validate`、`resetFields`、`clearValidate`、`getFieldsValue`、`setFieldsValue` 等实例方法。
- `search-bar/`：搜索栏封装，内聚表单与提交/重置按钮，暴露 `expandedBar`、`closeBar`、`setSearchData`。
- `table/`：表格增强，支持列设置、导出、列拖拽（需 `vuedraggable`）。
- `upload/`：上传封装，提供 `AcceptType`、`useUploadProps`、`UploadView`（视图）与 `QuiUpload`（组件）。
- `tooltip-button/` 与 `popconfirm-button/`：便捷交互按钮。
- `icon/`：统一图标入口 `QuiIcon`。

**类型与工具**
- 表单：`FormProps`、`FormSchema`、`CustomSwitchProps`
- 表格：`TableProps`、`TableColumn`、`TableColumns`、`TableSettings`、`TableFetchFn`、`TableExportType`、`TableSize`
- 上传：`UploadProps`、`AcceptType`、`useUploadProps`

## 使用说明

- 不强制依赖 UnoCSS：
  - 未集成 UnoCSS：请在项目入口引入 `@quiteer/naive-extra/style.css`，即可获得组件默认样式。
  - 已集成 UnoCSS：库内部包含 `virtual:uno.css` 使用，无需额外引入 `style.css`。
- 已导出 `uno.config.ts`：可直接参考或在项目中集成该配置。
- 必备依赖：`vue@3.3+` 与 `naive-ui`。

### 安装依赖
```bash
pnpm add vue@^3.3.0 naive-ui @quiteer/naive-extra
```

### 未集成 UnoCSS 的项目
在应用入口文件引入样式：
```ts
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'

// 引入 naive-extra 的内置样式（未使用 UnoCSS 场景）
import '@quiteer/naive-extra/style.css'

createApp(App).mount('#app')
```

### 已集成 UnoCSS 的项目
你可以直接参考并集成库提供的 Uno 配置：
```ts
// 直接引用 naive-extra 的 uno 配置（如需扩展，建议拷贝后按需调整）
import naiveExtraUnoConfig from '@quiteer/naive-extra/uno.config'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss'
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(naiveExtraUnoConfig)
  ]
})
```

### 快速示例（表单 + 上传）
```vue
<script setup lang="ts">
import type { FormSchema } from '@quiteer/naive-extra'
import { AcceptType, QuiForm, QuiUpload, useUploadProps } from '@quiteer/naive-extra'

const schemas: FormSchema[] = [
  { field: 'name', label: '姓名', component: 'NInput', rules: [{ required: true, message: '请输入姓名' }] },
  { field: 'age', label: '年龄', component: 'NInputNumber' }
]

const uploadProps = useUploadProps({
  accept: AcceptType.Images,
  multiple: true
})

/**
 * 表单提交回调：
 * 接收表单值对象，进行后续处理（如发起请求）。
 */
function handleSubmit(values: Record<string, any>) {
  console.log('submit values:', values)
}
</script>

<template>
  <QuiForm :schemas="schemas">
    <template #action-button>
      <NButton type="primary" @click="handleSubmit">
        提交
      </NButton>
    </template>
  </QuiForm>

  <QuiUpload v-bind="uploadProps" />
</template>
```

## 组件与类型导出
- 组件：`QuiForm`、`QuiSearchBar`、`QuiTable`、`QuiUpload`、`QuiTooltipButton`、`QuiPopconfirmButton`、`QuiIcon`
- Upload 工具：`AcceptType`、`useUploadProps`
- 类型：
  - Form：`FormProps`、`FormSchema`、`CustomSwitchProps`
  - SearchBar：`SearchBarProps`
  - Table：`TableProps`、`TableColumn`、`TableColumns`、`TableSettings`、`TableFetchFn`、`TableExportType`、`TableSize`
  - TooltipButton：`TooltipButtonProps`
  - Upload：`UploadProps`
