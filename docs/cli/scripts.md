
# @quiteer/scripts

一个辅助开发与发布的 CLI 工具集，内置以下能力：

- 清理目录：批量清除 `dist`、`node_modules` 等产物
- 依赖升级：调用 `npm-check-updates` 统一升级依赖
- 规范化提交：遵循 Conventional Commits 的交互式提交与校验
- 版本管理：交互选择包、提升版本、创建自定义前缀标签、生成全量 changelog
- 生成配置：在项目根目录生成 `quiteer.config.ts`
- 自更新：启动时检查是否为最新版本，提供一键更新
- 目录结构：生成当前目录树，支持输出为 Markdown

## 安装与运行

- 全局安装（推荐）：
  - `pnpm i -g @quiteer/scripts` 或 `npm i -g @quiteer/scripts`
  - 直接执行 `qui <command>` 或 `quiteer <command>`


> 运行环境：Node.js ≥ 22.14.0，包管理器建议使用 pnpm。

> 提示：CLI 启动时会自动检查 `@quiteer/scripts` 是否有新版本，如有则在终端提示执行 `qui su` 进行更新。

## 命令总览与示例

### generate-config / g

在项目根目录生成 `quiteer.config.ts`。若已存在会询问是否覆盖。

- 示例：`qui g`

### remove / rm

删除单个或多个路径（文件或目录），支持逗号分隔，递归删除。未传入时不执行任何操作。

- 示例：
  - 删除单个：`qui rm "packages/foo/dist"`
  - 删除多个：`qui rm "packages/*/dist,packages/*/node_modules"`

### cleanup / c

清除目录产物。支持传入单个或多个路径（逗号分隔）。未传入时按配置或默认值执行。

- 使用默认配置：`qui c`
- 指定路径：`qui c "packages/*/dist,packages/*/node_modules"`

### update-pkg / u

基于 `npm-check-updates` 升级依赖版本。

- 示例：`qui u`

### self-update / su

检查并将 `@quiteer/scripts` 更新到最新版本。

- 行为：比对当前版本与远端版本，若落后则执行 `pnpm add -g @quiteer/scripts@<latest>`
- 示例：`qui su`

### tree / t

生成当前目录树结构，默认仅在控制台输出；可选生成 Markdown 文件。

- 选项：
  - `--md` 是否生成 Markdown 文件（默认值来源于配置）
- 示例：
  - 控制台输出：`qui t`
  - 生成 Markdown：`qui t --md`

### git-commit / gc

交互式生成符合 Conventional Commits 的提交信息；支持在提交前添加变更文件。

- 选项：
  - `--add` 是否在提交前添加变更（默认开启）。当选择不添加全部文件时，提供多选列表空格选择、回车确认。
  - `-l, --lang` 提示语言（默认读取配置，支持 `zh-cn`/`en-us`）。
- 示例：`qui gc --add`

### git-commit-verify / gv

校验最近一次提交信息是否符合 Conventional Commits 格式。

- 选项：
  - `-l, --lang` 校验提示语言（默认读取配置）。
- 示例：`qui gv`

### git-branches / gb

列出远程仓库所有分支（分支名 + 最新提交时间 + SHA + 主题），按照最新时间倒序显示，并高亮最新分支。

- 行为：
  - 默认使用 `origin`，先执行 `git fetch --prune --tags` 同步远程引用
  - 支持传入仓库 `url`，临时抓取到命名空间并打印后清理引用
  - 终端等宽对齐，英文相对时间转换中文显示
- 示例：
  - 使用默认远程：`qui gb`
  - 使用指定 URL：`qui gb https://github.com/<owner>/<repo>.git`

### release / r

版本管理：交互选择需要更新的包、创建自定义前缀标签并生成全量 changelog。

- 行为：
  - 交互选择要提升版本的包（多选，未选中则跳过，不会改动）
  - 仅更新选中包的 `package.json` 版本并提交（不包含推送）
  - 标签命名为 `<prefix>-vX.Y.Z`（前缀可交互输入或通过选项传入；已存在则跳过创建）
  - 生成 `CHANGELOG.md` 与 `CHANGELOG_TIMELINE.md`，默认范围为仓库“最初提交 → 当前 HEAD”的全量历史
- 选项：
  - `--tag-prefix <prefix>` 标签前缀。示例：`scripts-v0.0.2`
- 示例：
  - `qui r --tag-prefix scripts`

### changelog / cl

生成变更日志文件，支持“分组样式”“时间轴样式”“同时生成两种样式”。默认读取配置文件中的输出文件名与样式。

- 选项：
  - `-f, --format <format>` 输出样式：`group | timeline | both`（默认取配置 `changelog.formats`）
  - `--group-output <path>` 分组样式输出文件（默认取配置 `changelog.groupOutput`）
  - `--timeline-output <path>` 时间轴样式输出文件（默认取配置 `changelog.timelineOutput`）
  - `-l, --lang <lang>` 输出语言：`zh-cn | en-us`（默认取配置 `lang`）
- 示例：
  - 仅分组样式：`qui cl -f group`
  - 仅时间轴样式：`qui cl -f timeline`
  - 同时生成两种：`qui cl -f both`

> 发布到 npm 前请确保工作区干净（`git status`），否则 `pnpm publish` 会触发 `ERR_PNPM_GIT_UNCLEAN`。必要时手动提交：`git add -A && git commit -m "docs(changelog): update"`。

### quiteer.config.ts 配置

- 配置入口与加载规则：
  - 推荐在项目根目录新建 `quiteer.config.ts`；也支持在 `package.json` 中加入 `quiteer` 字段。
  - CLI 会自动读取并合并默认值与自定义项（基于 `c12`），未定义的字段按默认值生效。
  - 一键生成模板：`qui g` 会在根目录生成带注释的 `quiteer.config.ts`。

- 完整选项与默认值（可自由覆盖）：
  - `cwd`：工作目录，默认 `process.cwd()`；通常无需修改。
  - `cleanupDirs`：清理命令的目录匹配列表，默认 `['**/dist','**/node_modules','!node_modules/**']`；用于 `qui c`。
  - `ncuCommandArgs`：`npm-check-updates` 参数，默认 `['--deep','-u']`；用于 `qui u`。
  - `lang`：CLI 提示与校验语言，`'zh-cn' | 'en-us'`，默认 `'zh-cn'`；影响 `qui gc`、`qui gv`、`qui cl`。
  - `gitCommitVerifyIgnores`：提交信息校验忽略规则（正则数组），默认包含常见 Merge/Revert 等；用于 `qui gv`。
  - `release`：预留的发布相关配置。发布流程会读取 `lang` 与 `changelog.*` 作为生成参数。
  - `changelog`：变更日志生成配置，影响 `qui cl`。
    - `groupOutput`：分组样式输出文件，默认 `'CHANGELOG.md'`。
    - `timelineOutput`：时间轴样式输出文件，默认 `'CHANGELOG_TIMELINE.md'`。
    - `formats`：输出样式，`'group'|'timeline'|'both'`，默认 `'both'`。
  - `gitCommit`：提交相关配置。
    - `add`：是否默认添加全部变更到暂存区，默认 `true`；影响 `qui gc`。
  - `dirTree`：目录树生成配置，影响 `qui t`。
    - `md`：是否生成 Markdown 文件，默认 `false`。
    - `output`：Markdown 输出文件名，默认 `'DIRECTORY_TREE.md'`。
    - `ignore`：忽略目录名数组，默认 `['node_modules','.git','dist','out','logs']`。

- 配置示例（可执行 qui g 生成）：

```ts
export default {
  // 清理目录（glob 支持）
  cleanupDirs: ['**/dist','**/node_modules','!node_modules/**'],

  // CLI 语言
  lang: 'zh-cn',

  // 依赖升级参数
  ncuCommandArgs: ['--deep', '-u'],

  // 提交信息校验忽略
  gitCommitVerifyIgnores: [
    /^((Merge pull request)|(Merge (.*?) into (.*)|(Merge branch (.*)))(?:\r?\n)*$)/m,
    /^(Merge tag (.*))(?:\r?\n)*$/m,
    /^(R|r)evert (.*)/,
    /^(amend|fixup|squash)!/,
    /^(Merged (.*?)(in|into) (.*)|Merged PR (.*): (.*))/, 
    /^Merge remote-tracking branch(\s*)(.*)/,
    /^Automatic merge(.*)/,
    /^Auto-merged (.*?) into (.*)/
  ],

  // 变更日志输出
  changelog: {
    groupOutput: 'CHANGELOG.md',
    timelineOutput: 'CHANGELOG_TIMELINE.md',
    formats: 'both'
  },

  // 提交默认行为
  gitCommit: { add: true },

  // 目录树
  dirTree: {
    md: false,
    output: 'DIRECTORY_TREE.md',
    ignore: ['node_modules', '.git', 'dist', 'out', 'logs']
  }
}
```

- 典型选配场景：
  - 仅生成时间轴样式：设置 `changelog.formats: 'timeline'`。
  - 严格提交信息：删除或收紧 `gitCommitVerifyIgnores` 的规则。
  - 自定义清理范围：添加更多目录到 `cleanupDirs`，如 `apps/*/build`。
  - 生成目录树 Markdown：设置 `dirTree.md: true` 并自定义 `output` 名称。

> 说明：changelog 当前默认生成“全量历史”；如需改为“上一标签 → 最新标签”的增量输出，可后续开启增量模式或调整生成脚本。

## 说明与建议

- 多包仓库：发布时可交互选择要更新的包，未选中的包不受影响。
- 标签前缀：用于避免不同包的标签冲突，建议与包名一致，如 `scripts`、`utils`。
- changelog：默认输出全量历史；若希望改为按“上一标签 → 最新标签”的增量方式，可告知作者切换逻辑或提供可选开关。
- 文件链接：变更日志中的文件会链接到对应提交版本的仓库页面（新增/修改指向 `blob/<commit>/<path>`，删除指向提交页）。

## 与 lint-staged + simple-git-hooks 集成

使用 `simple-git-hooks` 管理 Git 钩子，配合 `lint-staged` 在提交前仅校验暂存的文件，并通过 `@quiteer/scripts` 校验提交信息规范。

### 安装依赖

```bash
pnpm add -D simple-git-hooks lint-staged eslint
```

### 配置示例（参考当前项目）

在 `package.json` 中：

```json
{
  "scripts": {
    "prepare": "simple-git-hooks",
    "commit": "qui gc"
  },
  "simple-git-hooks": {
    "commit-msg": "pnpm qui gv",
    "pre-commit": "pnpm lint-staged"
  },
  "lint-staged": {
    "*": "eslint --fix"
  }
}
```

- `prepare`：在安装依赖后自动写入 Git 钩子到 `.git/hooks`
- `pre-commit`：仅对暂存文件执行 `eslint --fix`，速度快、影响面小
- `commit-msg`：执行 `qui gv` 校验最近一次提交信息是否符合 Conventional Commits

初始化钩子：

```bash
pnpm prepare
```

### 优点

- 只校验暂存变更，性能更好，避免全仓库 lint
- 自动修复 ESLint 问题，减少手工返工
- 强制提交信息规范，保持变更历史一致性，可直接用于自动生成 changelog
- 配置简单、跨平台，无需手写 `.git/hooks` 脚本，工作区内统一管理
- 与 `pnpm` 工作空间兼容，命令均使用 `pnpm` 触发

### 可选增强（按需）

如需更细粒度的匹配，可将 `lint-staged` 配置拆分：

```json
{
  "lint-staged": {
    "*.{js,ts,tsx,vue}": "eslint --fix",
    "*.{json,md,yml}": "eslint --fix"
  }
}
```
