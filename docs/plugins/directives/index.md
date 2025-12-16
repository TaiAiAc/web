# 指令库介绍（@quiteer/directives）

本库提供常用的 Vue 自定义指令集合，开箱即用，支持权限控制、交互效果增强等场景。

## 安装与注册

```bash
pnpm add @quiteer/directives
```

```ts
import Directives, { installPermissions, providePermissions } from '@quiteer/directives'
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

> 文档站点中在 `/.vitepress/theme/index.ts` 已示范注册与注入权限集合。也可在根组件/布局组件的 `setup()` 中使用 `providePermissions([...])` 进行组合式注入，仅对子树生效。

## 主要指令

| 指令 | 说明 | 文档 |
|------|------|------|
| `` `v-permission` `` | 基于角色或权限码的元素显隐控制 | [permission](/plugins/directives/permission) |
| `` `v-copy` `` | 一键复制文本内容，支持回调与提示 | [copy](/plugins/directives/copy) |
| `` `v-debounce` `` | 对绑定事件进行防抖处理（如输入搜索） | [debounce](/plugins/directives/debounce) |
| `` `v-throttle` `` | 对绑定事件进行节流处理（如滚动、点击） | [throttle](/plugins/directives/throttle) |
| `` `v-click-outside` `` | 点击元素外部时触发回调（常用于下拉菜单关闭） | [clickOutside](/plugins/directives/clickOutside) |
| `` `v-ellipsis` `` | 自动对文本应用省略号样式（单行/多行） | [ellipsis](/plugins/directives/ellipsis) |
| `` `v-intersecting` `` | 基于 Intersection Observer 监听元素进入/离开视口 | [intersecting](/plugins/directives/intersecting) |
| `` `v-lazy` `` | 图片懒加载，提升首屏性能 | [lazy](/plugins/directives/lazy) |
| `` `v-loading` `` | 在元素上叠加加载遮罩，支持自定义文案 | [loading](/plugins/directives/loading) |
| `` `v-watermark` `` | 在页面或容器叠加全屏/局部水印 | [watermark](/plugins/directives/watermark) |

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
