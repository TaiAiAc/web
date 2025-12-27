# @quiteer/naive-extra

基于 Naive UI 的业务组件库封装，旨在让开发者更多关注数据逻辑，减少 UI 实现的繁琐细节。

## 特性

- 🚀 **数据驱动**：通过配置对象生成表单、表格等组件，简化模板代码。
- 🧩 **高度封装**：内置常见业务逻辑（如搜索栏、确认按钮、带提示的按钮等）。
- 🎨 **响应式设计**：目标一切皆是响应式，配置极其灵活。
- 📦 **类型友好**：提供完整的 TypeScript 类型定义，支持类型推断。
- 🔌 **UnoCSS 集成**：推荐结合 UnoCSS 使用，样式更灵活。

## 安装

```bash
pnpm add @quiteer/naive-extra
```

## 核心组件

- **QuiForm**: 配置化表单组件。
- **QuiTable**: 增强型表格组件，支持自定义列配置 hook。
- **QuiSearchBar**: 基于表单配置的搜索栏组件。
- **QuiUpload**: 封装了常见文件类型限制和上传逻辑的上传组件。
- **QuiLayout**: 灵活的布局组件，支持多种布局模式。
- **QuiProvider**: 全局配置注入组件，简化 `NConfigProvider` 等的使用。
- **QuiButton**: 包含 `QuiPopconfirmButton` (二次确认) 和 `QuiTooltipButton` (带提示) 等。

## 使用示例

```vue
<script setup lang="ts">
import { 
  QuiForm, 
  QuiTable, 
  QuiSearchBar, 
  useUploadProps, 
  AcceptType 
} from '@quiteer/naive-extra'
import type { FormSchema, TableProps } from '@quiteer/naive-extra'

// 1. 表单配置
const schemas: FormSchema[] = [
  { field: 'name', label: '姓名', component: 'NInput', rules: [{ required: true }] },
  { field: 'age', label: '年龄', component: 'NInputNumber' }
]

// 2. 表格配置
const tableProps: TableProps = {
  columns: [
    { title: '姓名', key: 'name' },
    { title: '年龄', key: 'age' }
  ],
  data: [
    { name: 'John', age: 30 }
  ]
}

// 3. 上传配置
const uploadProps = useUploadProps({
  accept: AcceptType.Image
})

function handleSubmit(values: any) {
  console.log('Search:', values)
}
</script>

<template>
  <!-- 搜索栏 -->
  <QuiSearchBar :schemas="schemas" @submit="handleSubmit" />

  <!-- 表单 -->
  <QuiForm :schemas="schemas" />

  <!-- 表格 -->
  <QuiTable v-bind="tableProps" />
</template>
```

## License

MIT
