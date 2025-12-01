# @quiteer/directives
> 一个基于 Vue 3 的自定义指令集合，提供了一系列实用的指令来增强您的 Vue 应用程序。
> [文档](https://quiteerjs.github.io/web/plugins/directives/)



## API 文档

### v-copy

点击复制文本内容的指令。

#### 参数

```ts
interface CopyOptions {
  // 要复制的文本内容，如果不提供则复制元素的 textContent
  text?: string
  // 复制成功时的回调函数
  onSuccess?: () => void
  // 复制失败时的回调函数
  onError?: (error: Error) => void
  // 复制成功时的提示文本
  successText?: string
  // 复制失败时的提示文本
  errorText?: string
}
```

#### 示例

```vue
<!-- 复制元素内容 -->
<div v-copy>
点击复制这段文本
</div>

<!-- 复制指定文本 -->
<button v-copy="'要复制的文本'">
点击复制
</button>

<!-- 自定义配置 -->
<button v-copy="{
  text: '要复制的文本',
  successText: '已复制到剪贴板',
  errorText: '复制失败，请重试',
  onSuccess: () => console.log('复制成功'),
  onError: (error) => console.error('复制失败', error)
}"
>
复制
</button>
```

## API 文档

### v-loading

加载状态指示器，为元素添加加载中状态的遮罩层。

#### 参数

```ts
interface LoadingOptions {
  // 是否显示加载状态
  show: boolean
  // 加载状态的提示文本
  text?: string
  // 遮罩层的背景色，默认为 'rgba(255, 255, 255, 0.9)'
  background?: string
  // 自定义加载图标的 HTML 字符串
  spinner?: string
}
```

### v-intersecting

元素可见性监听，当元素进入或离开视口时触发回调。

#### 修饰符

- `show`: 仅在元素进入视口时触发回调
- `hide`: 仅在元素离开视口时触发回调

#### 参数

```ts
type Fn = (isIntersecting: boolean) => void

interface Params {
  show?: Fn
  hide?: Fn
}
```

### v-click-outside

点击元素外部区域时触发回调的指令。

#### 参数

```ts
interface ClickOutsideOptions {
  // 点击外部区域时的回调函数
  handler: () => void
  // 是否在点击外部时立即触发回调，默认为 true
  immediate?: boolean
  // 是否在指令绑定时添加事件监听，默认为 true
  attachOnMount?: boolean
}
```

#### 使用注意事项

1. **重要：** 在触发按钮上必须添加 `@click.stop` 修饰符，防止事件冒泡导致指令误触发：
```vue
<button @click.stop="toggleDropdown">
触发按钮
</button>

<div v-if="visible" v-click-outside="() => visible = false">
下拉内容
</div>
```

2. 常见使用场景：
   - 下拉菜单：点击外部自动关闭
   - 模态框：点击遮罩层关闭
   - 自定义面板：支持延迟关闭等配置

#### 示例

```vue
<!-- 基础用法 - 下拉菜单 -->
<div class="dropdown">
  <button @click.stop="toggleDropdown">显示下拉菜单</button>
  <div v-if="visible"
       v-click-outside="() => visible = false"
       class="dropdown-menu">
    下拉内容
  </div>
</div>

<!-- 自定义配置 - 延迟关闭 -->
<div v-if="visible"
     v-click-outside="{
       handler: () => {
         visible = false
         console.log('点击了外部区域')
       },
       immediate: false
     }"
>
  内容面板
</div>
```

### v-debounce

防抖指令，用于限制事件的触发频率，避免频繁触发。

#### 参数

```ts
interface DebounceOptions {
  // 防抖延迟时间（毫秒），默认为 300
  wait?: number
  // 是否在开始时立即执行，默认为 false
  immediate?: boolean
}
```

### v-throttle

节流指令，用于限制事件在一定时间内只能触发一次。

#### 参数

```ts
interface ThrottleOptions {
  // 节流延迟时间（毫秒），默认为 300
  wait?: number
  // 是否在开始时执行，默认为 true
  leading?: boolean
  // 是否在结束时执行，默认为 true
  trailing?: boolean
}
```

### v-ellipsis

文本省略指令，用于多行文本的省略显示。

#### 参数

- `number`: 显示的行数，默认为 1

## 特性

- 🚀 基于 Vue 3
- 📦 支持按需引入
- 🎨 使用 TypeScript 编写，提供完整的类型定义
- 🔧 简单易用，即插即用

## 安装

```bash
npm install @quiteer/directives
# 或者
pnpm add @quiteer/directives
# 或者
yarn add @quiteer/directives
```

## 使用

### 全局注册

```typescript
import QuiteerDirectives from '@quiteer/directives'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.use(QuiteerDirectives)
app.mount('#app')
```

## 指令列表

### v-loading

为元素添加加载状态指示器。

#### 基础用法

```vue
<template>
  <div v-loading="isLoading">
    内容
  </div>
</template>
```

#### 自定义配置

```vue
<script setup lang="ts">
const loadingConfig = {
  show: true,
  text: '加载中...',
  background: 'rgba(0, 0, 0, 0.7)',
  spinner: '<div class="custom-spinner"></div>'
}
</script>

<template>
  <div v-loading="loadingConfig">
    内容
  </div>
</template>
```

#### 配置项

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| show | 是否显示加载状态 | boolean | false |
| text | 加载提示文本 | string | - |
| background | 遮罩层背景色 | string | 'rgba(255, 255, 255, 0.9)' |
| spinner | 自定义加载图标的 HTML | string | - |

### v-intersecting

监听元素是否进入视口的指令。

#### 基础用法

```vue
<script setup lang="ts">
function handleShow(isIntersecting: boolean) {
  console.log('元素进入视口')
}

function handleHide(isIntersecting: boolean) {
  console.log('元素离开视口')
}
</script>

<template>
  <!-- 元素进入视口时触发 -->
  <div v-intersecting:show="handleShow">
    内容
  </div>

  <!-- 元素离开视口时触发 -->
  <div v-intersecting:hide="handleHide">
    内容
  </div>

  <!-- 同时监听进入和离开 -->
  <div v-intersecting="{ show: handleShow, hide: handleHide }">
    内容
  </div>
</template>
```

## License

[MIT](LICENSE)
