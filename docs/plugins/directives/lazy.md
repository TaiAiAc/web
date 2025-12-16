# v-lazy 指令

## 概述
- 图片懒加载，进入视口后再加载原图；支持占位图、错误图与回调。

## 示例
<script setup lang="ts">
import LazyDemo from './components/LazyDemo.vue'
</script>

<ClientOnly>
  <LazyDemo />
  
</ClientOnly>

<details>
  <summary>查看代码</summary>

<<< @/plugins/directives/components/LazyDemo.vue

</details>

## 全局默认配置
```ts
import Directives from '@quiteer/directives'
// main.ts
import { createApp } from 'vue'
import App from './App.vue'

/**
 * 函数：注册指令并配置 v-lazy 全局默认项
 * 作用：统一设置 loading 与 error 占位图，页面内可按需覆盖
 */
const app = createApp(App)
app.use(Directives, {
  lazy: {
    loading: '/loading.gif',
    error: '/error.jpg'
  }
})
app.mount('#app')
```

## 全局与局部的优先级
- 合并顺序：`默认值 < 全局配置 < 指令绑定值`
- 示例：
  - 全局：`loading='/global.gif'`、`error='/global.jpg'`
  - 局部：`v-lazy="{ error: '/override.jpg' }"` 最终 `error='/override.jpg'`

## 组合示例
| 模式 | 用法示例 | 说明 |
|------|----------|------|
| 仅占位图 | `` v-lazy="{ loading: '/loading.gif' }" `` | 加载过程中显示指定占位图片 |
| 占位 + 错误图 | `` v-lazy="{ loading: '/loading.gif', error: '/error.jpg' }" `` | 加载时显示占位图，加载失败时自动切换为错误图 |
| 带回调函数 | `` v-lazy="{ onLoad, onError }" `` | 支持自定义生命周期回调：<br>- `onLoad(img: HTMLImageElement)`：图片加载成功时触发<br>- `onError(error: Event)`：图片加载失败时触发 |
