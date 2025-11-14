# 项目介绍

## 概述
- 本仓库聚合 Web 相关的可复用封装与指令，提供统一文档与演示
- 主要包：
  - `@quiteer/naive-extra`：Naive UI 增强组件（表单、搜索栏、表格、上传、布局、按钮等）
  - `@quiteer/directives`：常用 Vue 指令集合（权限、复制、防抖、节流、点击外部、懒载、加载、水印、文本省略、交叉观察）
  - `@quiteer/axios`：网络层封装（插件链、撤回、重试、缓存、日志、契约返回）
  - `@quiteer/utils`：零依赖工具与类型工具（字符串/数字/数组/对象/函数/Promise/类型）
  - `@quiteer/vite-plugins`：Vite 插件集合（文件改动日志、Mock 路由、env 类型、移除 console、进度）
  - `@quiteer/box`：可拖拽与调整尺寸的网格组件，适合仪表盘布局
- 文档站基于 `VitePress`，语言中文，支持示例组件直接运行

## 技术栈与环境
- Node：`v22.14.0`
- 包管理器：`pnpm`
- 运行环境：macOS
- 依赖核心：`vue@3`、`naive-ui`、`vitepress`、`unocss`

## 仓库结构
```
packages/
  naive-extra/          # Naive UI 相关增强组件库
  directives/           # Vue 自定义指令集合
  ...
src/
  plugins/              # 文档中的插件说明与演示
  introduce/            # 项目介绍与快速上手
  about/                # 文档配置说明
.vitepress/             # 文档站点配置与主题
```

## 组件与指令一览
- `naive-extra`
  - 组件：`QuiForm`、`QuiSearchBar`、`QuiTable`、`QuiUpload`、`QuiLayout`、`QuiTooltipButton`、`QuiPopconfirmButton`、`QuiIcon`
  - Upload 辅助：`AcceptType`、`useUploadProps`
  - Layout 辅助：`useLayout`、`useSiderProps`
- `directives`
  - 指令：`v-permission`、`v-copy`、`v-debounce`、`v-throttle`、`v-click-outside`、`v-ellipsis`、`v-intersecting`、`v-lazy`、`v-loading`、`v-watermark`

## 风格与约定
- 保持小颗粒度组件与简单调度，避免过度耦合
- 默认样式与交互对齐 Naive UI；可结合 UnoCSS 强化主题与工具类
- 文档示例代码包含函数级注释，便于理解使用场景与意图

## 相关链接
- Naive UI：`https://www.naiveui.com/zh-CN/os-theme`
- Vue：`https://cn.vuejs.org/`
- Vite：`https://cn.vitejs.dev/`
- TypeScript：`https://www.typescriptlang.org/`

## 文档链接索引
- [插件总览](/plugins/)
- [Naive Extra](/plugins/naive-extra/index)
- [指令库](/plugins/directives/index)
- [Axios 封装](/plugins/axios/index)
- [工具库](/plugins/utils/index)
- [Vite 插件集](/plugins/vite-plugin/index)
- [类型判断](/plugins/is)
- [Box 网格](/plugins/box/index)
