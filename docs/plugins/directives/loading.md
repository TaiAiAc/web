# v-loading 指令

## 概述
- 为容器添加加载遮罩，支持布尔或对象配置；可自定义文本、背景与图标。

## 示例
<script setup lang="ts">
import LoadingDemo from './components/LoadingDemo.vue'
</script>

<ClientOnly>
  <LoadingDemo />
  
</ClientOnly>

<details>
  <summary>查看代码</summary>

<<< @/plugins/directives/components/LoadingDemo.vue

</details>

## 组合示例
| 模式 | 用法示例 | 说明 |
|------|----------|------|
| 布尔模式 | `` v-loading="isLoading" `` | 传入布尔值控制遮罩显隐；默认使用全局配置的加载文案与样式 |
| 对象模式 | `` v-loading="{ show, text, background, spinner }" `` | 支持细粒度配置：<br>- `show: boolean`：是否显示遮罩<br>- `text: string`：加载提示文案<br>- `background: string`：遮罩背景色（支持透明度）<br>- `spinner: string`：自定义加载动画类名或类型 |
