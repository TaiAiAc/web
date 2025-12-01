# @quiteer/scripts
> 简化多包仓库的版本管理与变更日志生成，提供便捷的 CLI 命令。
> [文档](https://quiteerjs.github.io/web/ci/scripts.html)

## 安装

- 全局安装（推荐）

```bash
pnpm i -g @quiteer/scripts
# 或者
npm i -g @quiteer/scripts
```

- 项目内安装（作为开发依赖）

```bash
pnpm add -D @quiteer/scripts
```

> 运行环境：Node.js ≥ 22.14.0，建议使用 pnpm 管理依赖。

## 快速使用

- 查看版本

```bash
qui -v
```

- 版本管理与打标签（支持多包选择与自定义前缀标签，同时生成全量 changelog）

```bash
# 交互选择需要提升版本的包
qui r --tag-prefix scripts
```

- 生成全量变更日志（中文，生成 CHANGELOG.md 与 CHANGELOG_TIMELINE.md）

```bash
qui cl
```

- 规范化提交（交互式生成符合 Conventional Commits 的提交信息）

```bash
qui gc
```

## 常用工作流示例

```bash
# 1) 更新版本并创建标签（例如为 scripts 包增加前缀）
qui r --tag-prefix scripts

# 2) 生成 changelog（默认生成全部历史）
qui cl

# 3) 提交并推送（如需发布）
git add -A && git commit -m "docs(changelog): update"
# 可选：git push && git push --tags
```

## 说明

- 多包仓库：发布时可交互选择要更新的包，未选中的包不受影响。
- 标签前缀：标签命名为 `<prefix>-vX.Y.Z`，可避免多包仓库中的全局标签冲突。
- changelog：默认基于仓库最初提交到当前 HEAD 的全量历史生成。
