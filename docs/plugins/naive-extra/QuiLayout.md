# QuiLayout 布局

`QuiLayout` 是一个基于 Naive UI 的高度可配置的布局组件，提供了多种常见的后台管理系统布局模式，并集成了路由菜单自动生成、面包屑导航、动态路由管理等功能。

## 基础用法

### 1. 定义布局存储

推荐使用 Pinia 来管理布局状态，利用 `useLayout` 组合式函数初始化布局配置。

```ts
// stores/layout.ts
import { defineStore } from 'pinia'
import { useLayout } from '@quiteer/naive-extra'
import { routes } from '@/router' // 您的路由定义

export const useLayoutStore = defineStore('layout', () => {
  const {
    collapsed,
    activeKey,
    menuOptions,
    type,
    baseRoutes,
    addRoute,
    removeRoute,
    // ...其他状态
  } = useLayout({
    baseRoutes: routes, // 传入基础路由
    initialActiveKey: '/',
    type: 'side-menu', // 默认布局类型
    // ...其他配置
  })

  return {
    collapsed,
    activeKey,
    menuOptions,
    type,
    baseRoutes,
    addRoute,
    removeRoute,
    // ...
  }
})
```

### 2. 使用组件

在你的应用主布局文件中引入 `QuiLayout` 并绑定状态。

```vue
<!-- layout/index.vue -->
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { QuiLayout } from '@quiteer/naive-extra'
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()
const {
  collapsed,
  activeKey,
  menuOptions,
  type,
  baseRoutes,
  inverted,
  bordered,
  headerHeight,
  footerHeight,
  siderWidth,
  collapsedWidth
} = storeToRefs(layoutStore)
</script>

<template>
  <QuiLayout
    v-model:is-collapsed="collapsed"
    v-model:active-key="activeKey"
    v-model:inverted="inverted"
    :type="type"
    :base-routes="baseRoutes"
    :menu-options="menuOptions"
    :bordered="bordered"
    :header-height="headerHeight"
    :footer-height="footerHeight"
    :sider-width="siderWidth"
    :collapsed-width="collapsedWidth"
  />
</template>
```

## 布局模式 (Layout Types)

`QuiLayout` 支持多种布局模式，通过 `type` 属性进行切换。

| 类型 | 描述 |
| --- | --- |
| `side-menu` | **左侧菜单模式**：经典的侧边栏菜单布局。 |
| `top-menu` | **顶部菜单模式**：菜单显示在顶部导航栏。 |
| `side-menu/2` | **左侧优先双菜单**：左侧为主导航，顶部可展示辅助菜单（视具体实现而定）。 |
| `top-menu/2` | **顶部优先双菜单**：顶部为主导航，左侧为子菜单。 |
| `side-mixed-menu/2` | **左侧混合双菜单**：左侧混合模式，配合双菜单显示。 |
| `top-mixed-menu/2` | **顶部混合双菜单**：顶部混合模式，配合双菜单显示。 |
| `blank` | **空白模式**：无菜单、无侧边栏，适用于全屏页面或登录页。 |

> 注意：带 `/2` 后缀的混合模式支持双菜单联动（Main Menu & Sub Menu），组件内部会自动处理 `activeKey` 的同步与解析，实现一级菜单与二级菜单的分离展示与联动。

## API 参考

### QuiLayout Props

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `LayoutType` | `'side-menu'` | 布局类型 |
| `baseRoutes` | `RouteRecordRaw[]` | `[]` | 基础路由表，用于生成菜单 |
| `menuOptions` | `MenuOption[]` | `[]` | 菜单选项数据 |
| `activeKey` | `string` | `''` | 当前激活的菜单 Key (v-model) |
| `isCollapsed` | `boolean` | `false` | 侧边栏是否折叠 (v-model) |
| `inverted` | `boolean` | `false` | 是否反色主题 (v-model) |
| `bordered` | `boolean` | `false` | 是否显示边框 |
| `headerHeight` | `number` | `60` | 头部高度 |
| `footerHeight` | `number` | `60` | 底部高度 |
| `siderWidth` | `number` | `220` | 侧边栏宽度 |
| `collapsedWidth` | `number` | `64` | 侧边栏折叠后宽度 |

### useLayout 返回值

`useLayout` 提供了布局所需的状态管理和工具方法。

| 属性/方法 | 类型 | 说明 |
| --- | --- | --- |
| `activeKey` | `Ref<string>` | 当前激活的路由路径 |
| `setActiveKey` | `(key: string) => void` | 设置激活路径 |
| `collapsed` | `Ref<boolean>` | 侧边栏折叠状态 |
| `setCollapsed` | `(v: boolean) => void` | 设置折叠状态 |
| `toggle` | `() => void` | 切换折叠状态 |
| `type` | `Ref<LayoutType>` | 当前布局类型 |
| `menuOptions` | `ComputedRef<MenuOption[]>` | 根据路由生成的菜单选项 |
| `addRoute` | `(route: RouteRecordRaw) => void` | 动态添加路由，并自动更新菜单 |
| `removeRoute` | `(name: string) => void` | 动态移除路由 |
| `addRoutes` | `(routes: RouteRecordRaw[]) => void` | 批量添加路由 |

## 动态路由管理

`QuiLayout` 深度集成了 `vue-router`，通过 `useLayout` 提供的 `addRoute` 和 `removeRoute` 方法，可以轻松实现动态路由的添加与删除，且菜单会自动更新。

### 添加路由示例

```ts
const { addRoute } = useLayoutStore()

function addDynamicPage() {
  addRoute({
    path: '/dynamic-page',
    name: 'DynamicPage',
    meta: {
      title: '动态页面',
      icon: 'mdi:flash'
    },
    component: () => import('@/pages/DynamicPage.vue')
  })
}
```

### 移除路由示例

```ts
const { removeRoute } = useLayoutStore()

function removeDynamicPage() {
  removeRoute('DynamicPage')
}
```

## 功能特性

- **自动菜单生成**：根据传入的 `baseRoutes` 自动生成符合 Naive UI 格式的菜单选项。
- **面包屑导航**：在 `side-menu` 等模式下自动生成面包屑。
- **布局切换联动**：在单栏菜单（如 `side-menu`）与双栏菜单（如 `top-mixed-menu/2`）切换时，自动解析并同步 `activeKey`，保持选中状态一致。
- **响应式适配**：支持配置侧边栏宽度、头部高度等尺寸。
- **Vue Router 同步**：`activeKey` 会自动跟随路由变化，点击菜单也会自动触发路由跳转。
