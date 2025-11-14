# 指令库介绍（@quiteer/directives）

本库提供常用的 Vue 自定义指令集合，开箱即用，支持权限控制、交互效果增强等场景。

## 安装与注册

```bash
pnpm add @quiteer/directives
```

```ts
import Directives, { installPermissions } from '@quiteer/directives'
// main.ts
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.use(Directives)

/**
 * 函数：注入权限集合
 * 作用：为 v-permission 指令提供当前用户拥有的权限码集合
 */
function setupPermissions() {
  installPermissions(app, [
    'sys:user:list',
    'sys:user:add',
    'sys:user:edit',
    'sys:user:delete'
  ])
}

setupPermissions()
app.mount('#app')
```

> 文档站点中在 `/.vitepress/theme/index.ts` 已示范注册与注入权限集合。

## 主要指令

- 权限控制：[v-permission](/plugins/directives/permission)
- 复制文本：[v-copy](/plugins/directives/copy)
- 防抖事件：[v-debounce](/plugins/directives/debounce)
- 节流事件：[v-throttle](/plugins/directives/throttle)
- 点击外部：[v-click-outside](/plugins/directives/clickOutside)
- 文本省略：[v-ellipsis](/plugins/directives/ellipsis)
- 交叉观察：[v-intersecting](/plugins/directives/intersecting)
- 图片懒载：[v-lazy](/plugins/directives/lazy)
- 加载遮罩：[v-loading](/plugins/directives/loading)
- 水印叠加：[v-watermark](/plugins/directives/watermark)

## 参数与修饰符说明

- 权限模式：`v-permission` 支持 `.any`（任意命中）与 `.all`（全部命中）
- 未授权行为：可使用修饰符控制未授权时的表现
  - `:remove` 移除元素
  - `:disable` 置灰并禁用交互
- 传参形态：支持字符串（单个权限）与数组（多个权限）
- 全局配置：在 `app.use(Directives, { lazy: { loading, error } })` 中设置懒载默认图

## v-permission 快速示例

```vue
<template>
  <!-- 命中则显示，未命中默认隐藏 -->
  <button v-permission="'sys:user:add'">
    新增用户
  </button>

  <!-- 任意命中 -->
  <button v-permission.any="['sys:user:add', 'sys:user:edit']">
    新增或编辑
  </button>

  <!-- 全部命中且未授权时禁用 -->
  <button v-permission.all:disable="['sys:user:add', 'sys:user:edit']">
    新增并编辑
  </button>

  <!-- 未授权时移除 -->
  <button v-permission:remove="'sys:user:admin'">
    管理员操作
  </button>
</template>
```

更多详细说明与演示请查看对应页面链接。
