# v-copy 指令

## 概述
- 点击元素后将文本写入剪贴板，支持传入字符串或配置对象。
- 可自定义成功/失败提示、回调函数。

## 基本用法
<script setup lang="ts">
import CopyDemo from './components/CopyDemo.vue'
</script>

<ClientOnly>
  <CopyDemo />
</ClientOnly>


<details>
  <summary>查看代码</summary>

<<< @/plugins/directives/components/CopyDemo.vue

</details>

## 组合示例
| 模式 | 用法示例 | 说明 |
|------|----------|------|
| 复制元素文本 | `` v-copy `` | 自动复制绑定元素的 `innerText`（或 `textContent`） |
| 复制指定字符串 | `` v-copy="'内容'" `` | 直接传入要复制的字符串字面量 |
| 配置对象（基础） | `` v-copy="{ text: '内容', successText: '已复制' }" `` | 通过对象指定复制内容和成功提示文案（如用于 Toast） |
| 配置对象（带回调） | `` v-copy="{ text: '内容', onSuccess, onError }" `` | 支持自定义成功/失败回调函数：<br>- `onSuccess(text: string)`：复制成功时触发<br>- `onError(error: Error)`：复制失败时触发（如浏览器权限拒绝） |
