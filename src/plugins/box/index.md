# @quiteer/box

提供可自定义行列、支持拖拽排序与尺寸调整的网格组件。每个格子可编辑，右上角提供设置入口，适合仪表盘与卡片布局场景。

## 安装
```bash
pnpm add @quiteer/box
```

<script setup lang="ts">
import BaseDemo from './components/BaseDemo.vue'
</script>


## 基本用法

<ClientOnly>
  <BaseDemo />
</ClientOnly>

## 属性与事件
- `rows`/`cols`：行/列数量（默认 `12` 列）
- `items`：格子集合（每项包含 `id/x/y/w/h` 等）
- `draggable`：是否可拖拽排序
- `resizable`：是否可拉伸尺寸
- `gap`：网格间距（px）
- 事件：`update:items`（拖拽/调整后返回最新布局）

## 代码示例
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { QBox, type BoxItem } from '@quiteer/box'

/**
 * 函数：初始化布局
 * 作用：提供基础的三列布局，每个卡片可拖拽与缩放
 */
const items = ref<BoxItem[]>([
  { id: 'a', x: 0, y: 0, w: 4, h: 6 },
  { id: 'b', x: 4, y: 0, w: 4, h: 6 },
  { id: 'c', x: 8, y: 0, w: 4, h: 6 }
])

/**
 * 函数：保存布局
 * 作用：监听 `update:items` 并持久化到本地或服务端
 */
function onUpdate(next: BoxItem[]) {
  items.value = next
  localStorage.setItem('dashboard', JSON.stringify(next))
}
</script>

<template>
  <QBox :cols="12" :items="items" draggable resizable gap="8" @update:items="onUpdate">
    <template #item="{ item }">
      <div class="card">{{ item.id }}</div>
    </template>
  </QBox>
</template>
```





