# @quiteer/unocss

UnoCSS 集成插件与统一配置集合，面向 Vite 项目提供即插即用的预设组合、主题、规则与快捷类。

## 特性
- 统一预设：默认启用 `presetWind4`、`presetIcons`、`presetWebFonts`
- 可复用配置：内置 `theme`、`shortcuts` 与常用 `rules`
- 即插即用：导出 Vite 插件函数 `UnoPreset()`，一行集成
- 生产友好：构建外部化原生依赖，避免跨平台 `.node` 模块问题

## 安装
```bash
pnpm add -D @quiteer/unocss @unocss/vite
```

## 使用
```ts
// vite.config.ts
import UnoPreset from '@quiteer/unocss'
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [vue(), UnoPreset()]
}
```

## 与 qvite 配合
```ts
// qvite.config.ts
import { defineConfig } from '@quiteer/vite'

export default defineConfig({ UnoCSS: true })
```
启用后，qvite 会自动注入 `import 'uno.css'` 到虚拟 HTML，确保样式生效。

## 参考
- 插件入口：`src/index.ts`
- Uno 配置：`src/uno.config.ts`
- 主题/快捷/规则：`src/theme.ts`、`src/shortcuts.ts`、`src/rule.ts`
