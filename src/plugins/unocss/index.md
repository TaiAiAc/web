# UnoCSS 预设（@quiteer/unocss）

为 UnoCSS 提供项目化的预设与快捷集成，统一常用规则、主题变量与工具类，适合与 `@quiteer/naive-extra` 搭配使用。

## 安装
```bash
pnpm add @quiteer/unocss unocss -D
```

## 集成方式一：独立 `uno.config.ts`
```ts
// uno.config.ts
import { defineConfig, presetUno } from 'unocss'
import { presetQuiteer } from '@quiteer/unocss'

/**
 * 函数：定义 UnoCSS 配置
 * 作用：加载通用预设与 Quiteer 预设，获得统一的变量与工具类
 */
export default defineConfig({
  presets: [presetUno(), presetQuiteer()],
})
```

## 集成方式二：在 `vite.config.ts` 内启用
```ts
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import { presetQuiteer } from '@quiteer/unocss'

/**
 * 函数：Vite 配置
 * 作用：直接在 Vite 中启用 UnoCSS，加载 Quiteer 预设
 */
export default defineConfig({
  plugins: [
    UnoCSS({
      presets: [presetQuiteer()],
    })
  ]
})
```

## 与 `naive-extra` 的协同
- 若未使用 UnoCSS，可在入口引入 `@quiteer/naive-extra/style.css`
- 若已使用 UnoCSS，`naive-extra` 内置 `virtual:uno.css`，无需额外引入，样式与预设可无缝协作

## 代码参考
- 预设入口：`packages/unocss/uno-preset/index.ts`
- 包入口：`packages/unocss/index.ts`