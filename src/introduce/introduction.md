# 快速上手

## 环境准备
- Node：`22.14.0`
- 包管理器：`pnpm`
- 系统：macOS

## 安装依赖
```bash
pnpm install
```

## 启动文档站
```bash
pnpm docs:dev
```

## 打包文档站
```bash
pnpm docs:build
pnpm docs:preview
```

## 目录导航
- [文档首页](/)
- [项目说明](/introduce/project)
- [插件总览](/plugins/)
- [Naive UI 增强](/plugins/naive-extra/index)
- [指令库](/plugins/directives/index)
- [Axios 封装](/plugins/axios/index)
- [工具库](/plugins/utils/index)
- [Vite 插件集](/plugins/vite-plugin/index)
- [类型判断](/plugins/is)
- [Box 网格](/plugins/box/index)

## 使用组件库（示例）
```vue
<script setup lang="ts">
import { AcceptType, QuiForm, QuiLayout, QuiUpload, useLayout, useUploadProps } from '@quiteer/naive-extra'

/**
 * 函数：生成上传配置
 * 作用：借助 useUploadProps 与枚举 AcceptType 快速配置上传属性
 */
const uploadProps = useUploadProps({
  accept: AcceptType.Image,
  multiple: true
})

/**
 * 函数：初始化布局折叠状态
 * 作用：通过 useLayout 管理侧边栏折叠与响应式信息
 */
const { collapsed, toggle } = useLayout(false)
</script>

<template>
  <QuiLayout v-model:collapsed="collapsed" type="sider-left">
    <template #sider>
      <NButton size="small" @click="toggle">
        切换折叠
      </NButton>
    </template>
    <div>内容区域</div>
  </QuiLayout>

  <QuiUpload v-bind="uploadProps" />
</template>
```

## 注册指令库（示例）
```ts
import Directives from '@quiteer/directives'
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'

/**
 * 函数：注册指令与全局配置
 * 作用：统一注册所有指令，并设置 v-lazy 的全局默认占位图与错误图
 */
createApp(App)
  .use(Directives, {
    lazy: {
      loading: '/loading.gif',
      error: '/error.jpg'
    }
  })
  .mount('#app')
```

## UnoCSS 使用说明
- 若未在项目集成 UnoCSS，可在入口引入 `@quiteer/naive-extra/style.css`
- 若已集成 UnoCSS，`naive-extra` 内部使用 `virtual:uno.css`，无需额外引入

## 常见问题
- `NLayout` 侧边栏：Naive UI 从 v2.3.0 起，包含 `n-layout-sider` 的 `n-layout` 需要显式设置 `has-sider`
- 组件演示不可见：确保在文档中使用 `<ClientOnly>` 包裹交互性示例组件
