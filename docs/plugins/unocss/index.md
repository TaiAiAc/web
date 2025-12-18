# @quiteer/unocss

> 面向 Vite 的 UnoCSS 集成插件与可复用配置集合。提供统一的预设组合、主题、规则与快捷类，并以插件形式一键启用。

## 特性
- 集成即用：导出 Vite 插件函数，开箱加载统一的 `uno.config` 配置
- 预设组合：默认启用 `presetWind4`、`presetIcons`、`presetWebFonts`
- 主题与快捷：提供可复用的 `theme` 与 `shortcuts` 集合
- 自定义规则：支持组件层规则与通用规则扩展
- 生产友好：构建外部化原生依赖，避免跨平台 `.node` 模块打包问题

## 安装
- 主项目（使用者）需安装：
  - `pnpm add -D @quiteer/unocss`
  - 使用 Vite 5+（`vite@>=5`）

## 快速开始
```ts
// vite.config.ts
import UnoPreset from '@quiteer/unocss'
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue(),
    UnoPreset() // 加载统一的 UnoCSS 配置
  ]
}
```

## 在 Qvite 中使用
- 若使用 `@quiteer/vite`（qvite），只需开启 `UnoCSS`：
```ts
// qvite.config.ts
import { defineConfig } from '@quiteer/vite'

export default defineConfig({
  UnoCSS: true
})
```
- 启用后，qvite 会自动注入 `import 'uno.css'` 到虚拟 HTML，确保样式生效（实现位置：`packages/qvite/src/transform.ts:40-64`）。

## 配置结构
- 插件入口：`packages/unocss/src/index.ts:1-11`
  - 默认导出 `UnoPreset()`，内部调用 `@unocss/vite` 并传入统一配置
- UnoCSS 配置：`packages/unocss/src/uno.config.ts:1-21`
  - `presets`：`presetWind4()`、`presetIcons()`、`presetWebFonts()`
  - `transformers`：`transformerDirectives()`、`transformerVariantGroup()`
  - `rules`、`theme`、`shortcuts`：统一从本包导入
- 主题与快捷：
  - 主题：`packages/unocss/src/theme.ts:1-106`
  - 快捷类：`packages/unocss/src/shortcuts.ts:1-42`
- 自定义规则：
  - 规则：`packages/unocss/src/rule.ts:1-36`

## API 概览
- `default export`: `UnoPreset(): PluginOption`
  - 返回 UnoCSS 的 Vite 插件实例，内置统一配置
- `named export`: `unoConfig`
  - 直接复用本包的 `UserConfig`，用于自定义组合或二次包装

## 主题与快捷（示例）
```ts
// theme 片段
export const theme = {
  colors: { primary: '#3b82f6', secondary: '#6366f1' },
  fontFamily: { sans: 'Inter, system-ui, ...', mono: 'Fira Code, ...' },
  breakpoints: { sm: '640px', md: '768px', lg: '1024px' }
}

// shortcuts 片段
export const shortcuts = {
  'flex-center': 'flex justify-center items-center',
  'absolute-center': 'absolute left-0 top-0 flex-center size-full',
  'ellipsis-text': 'overflow-hidden whitespace-nowrap text-ellipsis'
}
```

## 规则扩展示例
```ts
// 组件规则：按钮风格
export const buttonRules = [
  [/^btn-(primary|secondary)$/, ([, variant]) => ({
    'background-color': variant === 'primary' ? '#3b82f6' : '#6366f1',
    'color': 'white',
    'padding': '0.5rem 1rem',
    'border-radius': '0.25rem',
    'font-weight': '500'
  }), { layer: 'components' }]
]
```

## 兼容性与要求（作者环境）
- Node `>= 22.14.0`
- Vite `>= 5`
- `@unocss/vite@^66.5.10`

## 推荐用法
- 在 Vite 插件中直接使用 `UnoPreset()`，简单稳定
- 若需扩展，基于 `unoConfig` 自行合并：
```ts
import UnoPreset, { unoConfig } from '@quiteer/unocss'
import { defineConfig } from 'unocss'

const myConfig = defineConfig({
  ...unoConfig,
  rules: [...(unoConfig.rules ?? []), [/^wh-(\d+)$/, ([, d]) => ({ width: `${Number(d)/4}rem`, height: `${Number(d)/4}rem` })]]
})
```


