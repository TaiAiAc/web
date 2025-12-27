# QuiIcon 图标组件

基于 Iconify 的图标封装组件，支持动态加载海量图标。

## 基础用法

```vue
<template>
  <QuiIcon icon="carbon:user" />
  <QuiIcon icon="mdi:home" size="24" color="red" />
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| icon | Iconify 图标名称，格式为 `collection:name`，如 `carbon:add` | `string` | - |
| size | 图标大小，支持数字或带单位的字符串 | `string \| number` | - |
| color | 图标颜色 | `string` | - |

## IconPicker 图标选择器

基于 Iconify 的图标选择组件，支持搜索、集合筛选和无限滚动加载。

### 基础用法

```vue
<template>
  <QuiIconPicker v-model="icon" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const icon = ref('carbon:user')
</script>
```

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model | 选中的图标名称，格式为 `collection:name` | `string` | - |
| pageSize | 每次滚动加载的图标数量 | `number` | `100` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 选中图标时触发 | `(value: string) => void` |
| select | 选中图标时触发 | `(value: string) => void` |

## 图标查询

推荐使用 [Icones](https://icones.js.org/) 查找图标名称。
