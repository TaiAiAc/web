# QuiProvider 全局配置组件

`QuiProvider` 是一个整合了 Naive UI 所有全局配置提供者（ConfigProvider, MessageProvider, DialogProvider, NotificationProvider, LoadingBarProvider）的包装组件。

它不仅简化了应用根节点的嵌套结构，还自动将 `$message`、`$dialog` 等 API 挂载到 `window` 对象上，方便在非 Vue 组件环境（如 axios 拦截器、Router 守卫）中直接调用。

## 基础用法

在 `App.vue` 或应用的根组件中使用 `QuiProvider` 包裹你的应用内容。

```vue
<script setup lang="ts">
import { QuiProvider } from '@quiteer/naive-extra'
import { zhCN, dateZhCN } from 'naive-ui'

const configProps = {
  locale: zhCN,
  dateLocale: dateZhCN,
  themeOverrides: {
    common: {
      primaryColor: '#18a058'
    }
  }
}
</script>

<template>
  <QuiProvider :config-provider-props="configProps">
    <RouterView />
  </QuiProvider>
</template>
```

## 响应式主题配置

`naive-extra` 提供了一系列组合式函数（Composables），用于轻松管理主题、配色、语言等全局配置，并保持响应式更新。

### 核心 Hooks

- `useTheme`: 管理明亮/暗黑/跟随系统主题。
- `useColorScheme`: 管理主题色（Primary Color）及派生色。
- `useLocale`: 管理国际化语言（zh/en）。

### 综合示例

推荐使用 `computed` 将各个 Hook 的状态合并为一个配置对象，传给 `QuiProvider`。

```vue
<script setup lang="ts">
import { computed } from 'vue'
import {
  QuiProvider,
  useTheme,
  useColorScheme,
  useLocale
} from '@quiteer/naive-extra'

// 1. 初始化各配置 Hook
const { themeRef, toggle: toggleTheme } = useTheme('light')
const { localeRef, dateLocaleRef, toggle: toggleLocale } = useLocale('zh')
const { overridesRef, setPrimary } = useColorScheme()

// 2. 合并配置 (使用 computed 保持响应式)
const configProps = computed(() => ({
  theme: themeRef.value,
  locale: localeRef.value,
  dateLocale: dateLocaleRef.value,
  themeOverrides: overridesRef.value
}))
</script>

<template>
  <QuiProvider :config-provider-props="configProps">
    <!-- 你的应用内容 -->
    <RouterView />
  </QuiProvider>
</template>
```

## 全局 API 挂载

`QuiProvider` 内部会自动挂载以下 Naive UI 的组合式 API 到 `window` 对象，无需额外配置：

- `window.$loadingBar`
- `window.$message`
- `window.$dialog`
- `window.$notification`

### 类型声明

为了获得 TypeScript 智能提示，你可以在 `src/env.d.ts` 或 `global.d.ts` 中添加如下声明（`naive-extra` 包中已包含此声明，通常无需手动添加）：

```ts
import type { MessageApi, DialogApi, NotificationApi, LoadingBarApi } from 'naive-ui'

declare global {
  interface Window {
    $message: MessageApi
    $dialog: DialogApi
    $notification: NotificationApi
    $loadingBar: LoadingBarApi
  }
}
```

### 使用示例（非组件环境）

```ts
// src/utils/request.ts
import axios from 'axios'

axios.interceptors.response.use(
  response => response,
  error => {
    // 直接调用挂载在 window 上的 message
    window.$message?.error('请求失败：' + error.message)
    return Promise.reject(error)
  }
)
```

## API 参考

### Props

| 属性名 | 类型 | 说明 |
| --- | --- | --- |
| `configProviderProps` | `ConfigProviderProps` | 透传给 `NConfigProvider` 的属性，用于配置主题、语言、日期语言等 |
| `messageProviderProps` | `MessageProviderProps` | 透传给 `NMessageProvider` 的属性 |
| `dialogProviderProps` | `DialogProviderProps` | 透传给 `NDialogProvider` 的属性 |
| `notificationProviderProps` | `NotificationProviderProps` | 透传给 `NNotificationProvider` 的属性 |
| `loadingBarProviderProps` | `LoadingBarProviderProps` | 透传给 `NLoadingBarProvider` 的属性 |

### 默认行为

- **Locale**: 如果 `configProviderProps` 中未指定 `locale` 和 `dateLocale`，组件会默认使用 `zhCN` 和 `dateZhCN`（中文环境）。
- **ContextHolder**: 组件内部渲染了一个无形的 `ContextHolder` 子组件，用于在 Setup 阶段捕获并注册全局 API。
