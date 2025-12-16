# v-click-outside 指令

## 概述
- 监听元素外点击以触发回调，支持配置 `immediate` 与 `attachOnMount`。

## 示例
<script setup lang="ts">
import ClickOutsideDemo from './components/ClickOutsideDemo.vue'
</script>

<ClientOnly>
  <ClickOutsideDemo />
  
</ClientOnly>

<details>
  <summary>查看代码</summary>

<<< @/plugins/directives/components/ClickOutsideDemo.vue

</details>

## 组合示例
| 模式 | 用法示例 | 说明 |
|------|----------|------|
| 函数模式 | `` v-click-outside="fn" `` | 直接传入处理函数，点击外部时调用 `fn` |
| 对象模式 | `` v-click-outside="{ handler: fn, immediate: boolean, attachOnMount: boolean }" `` | 支持高级配置：<br>- `handler`：点击外部时的回调函数<br>- `immediate`：是否立即绑定事件（默认 `true`）<br>- `attachOnMount`：是否在组件挂载时自动附加监听（默认 `true`） |
