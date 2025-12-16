# v-ellipsis 指令

## 概述
- 控制文本的多行省略，值为显示行数。

## 示例
<script setup lang="ts">
import EllipsisDemo from './components/EllipsisDemo.vue'
</script>

<ClientOnly>
  <EllipsisDemo />
  
</ClientOnly>

<details>
  <summary>查看代码</summary>

<<< @/plugins/directives/components/EllipsisDemo.vue

</details>

## 组合示例
| 模式 | 用法示例 | 说明 |
|------|----------|------|
| 单行省略 | `` v-ellipsis="1" `` | 限制文本显示为单行，超出部分省略号表示 |
| 多行省略 | `` v-ellipsis="n" `` | 限制文本显示为 `n` 行，超出部分省略号表示 |
