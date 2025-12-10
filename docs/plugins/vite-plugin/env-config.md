# 环境配置生成（env-config）

## 为什么使用
- 统一管理环境变量：将各环境的配置集中在 `env.config.ts`，免去手改多个 `.env.*` 文件。
- 自动产物：启动/构建时生成 `.env.local` 与 `.env.{mode}.local`（仅在存在有效键时写入），并可生成类型文件，提升 IDE 体验。
- 变更可见：内置文件监听，配置更新后自动再生成，日志清晰可见。
- 风险可控：仅输出符合前缀（默认 `VITE_`）的变量；支持“必填项”校验，缺失时明确提醒并中止构建。
- 混淆支持：提供 Base64 混淆以弱化肉眼读取；支持字段级与全局策略，避免 URL 等“直接使用型”字段受影响。

## 快速开始
```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { envConfigPlugin } from '@quiteer/vite-plugins'

export default defineConfig(() => ({
  plugins: [
    envConfigPlugin({ requiredKeys: ['baseURL', 'apiURL'] })
  ]
}))
```

## 使用方法
```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { envConfigPlugin } from '@quiteer/vite-plugins'

export default defineConfig(() => ({
  plugins: [
    envConfigPlugin({
      // 根目录（默认 vite root）
      // root: process.cwd(),

      // 配置文件路径（默认在 root 下查找 env.config.ts；不再广搜工作区）
      // configFile: 'env.config.ts',

      // 全局混淆开关（Base64），默认 false；可配合字段级 obfuscate 使用
      obfuscate: true,

      // 跳过混淆的键名（原始键名，如 'testUrl'），避免 URL 等直接使用字段受到影响
      obfuscateSkipKeys: ['testUrl'],

      // 必填项校验，缺失时开发模式打印错误，构建阶段中止
      requiredKeys: ['desc', 'baseURL', 'apiURL', 'uploadURL'],

      // 前缀白名单（默认取 Vite 的 envPrefix 或 ['VITE_']）
      includePrefixes: ['VITE_'],

      // 生成文件名（默认 '.env.{mode}.local' 与 '.env.local'）
      envFileTemplate: '.env.{mode}.local',
      // defaultEnvFile: '.env.local',

      // 类型文件（默认生成到 'env.d.ts'，可禁用）
      // disableTypes: false,
      // typesOutput: 'env.d.ts'
    })
  ]
}))
```

## 启动前辅助：bootstrapEnv（推荐）
在 `vite` 启动的最早阶段生成 `.env.*` 与类型文件，保证后续 `loadEnv`、插件与配置可用到最新环境产物。

```ts
// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import { bootstrapEnv, envConfigPlugin } from '@quiteer/vite-plugins'

export default defineConfig(async ({ mode }) => {
  // 仅在当前 root 下存在配置时写入 .env；未找到配置时直接返回
  await bootstrapEnv({ mode, includePrefixes: ['VITE_'] })

  const env = loadEnv(mode, process.cwd(), ['NODE', 'VITE'])
  return {
    plugins: [
      envConfigPlugin({ requiredKeys: ['desc'] })
    ]
  }
})
```

### bootstrapEnv 选项
- `root?: string`：项目根目录，默认 `process.cwd()`
- `mode?: string`：目标环境，默认从 `MODE`/`NODE_ENV` 推断或 `'development'`
- `includePrefixes?: string[]`：变量前缀白名单，默认 `['VITE_']`
- `envFileTemplate?: string`：环境文件名模板，默认 `'.env.{mode}.local'`
- `defaultEnvFile?: string`：默认段文件名，默认 `'.env.local'`
- `typesOutput?: string`：类型输出路径；未传则不生成类型
- `disableTypes?: boolean`：禁用类型生成，默认 `false`

### 行为说明
- 仅当当前 `root` 下存在 `env.config.ts` 时写入 `.env.*`；未找到配置将直接返回，不做写入。
- 类型生成仅在传入 `typesOutput` 且未禁用的情况下进行。

```ts
// env.config.ts（支持 TS / satisfies 写法）
// 若未使用类型约束，示例可包含额外键；当启用严格类型（见下文“严格键约束”）时，
// 非 default 段的额外键（如 title）会触发类型错误
export default {
  default: {
    desc: { value: '通用环境变量', obfuscate: false },
    testUrl: 'https://quiteerjs.github.io/web/'
  },
  development: {
    desc: '开发环境变量',
    baseURL: { value: 'http://localhost:3000', obfuscate: true },
    apiURL: '/api',
    uploadURL: '/files',
    gisJs: '/gis',
    gisCss: '/gis',
    title: 'xxx' // 严格类型启用时，这里将报错
  },
  production: {
    desc: '生产环境变量',
    baseURL: 'https://api.example.com',
    apiURL: '/api',
    uploadURL: '/files',
    title: 'prod' // 严格类型启用时，这里将报错
  }
}
```

## 生成内容
- `.env.local`：仅 `default` 段；全局适用、不会被具体环境覆盖。
- `.env.{mode}.local`：`default + 当前环境` 合并，当前环境同名键覆盖 `default`。
- 类型文件（可选）：默认写入 `env.d.ts`，为 `import.meta.env` 提供类型提示与校验。

## 选项说明
- `root?: string`：项目根目录，默认 `vite` 的 `root`。
- `configFile?: string`：配置文件路径，默认在 `root` 查找 `env.config.ts`（不再广搜工作区）。
- `targetEnv?: string`：目标环境，默认 `vite` 的 `mode`。
- `envFileTemplate?: string`：环境文件名模板，默认 `'.env.{mode}.local'`。
- `defaultEnvFile?: string`：默认段文件名，默认 `'.env.local'`。
- `includePrefixes?: string[]`：变量前缀白名单，默认取 `envPrefix` 或 `['VITE_']`。
- `requiredKeys?: string[]`：必填项校验，缺失时开发模式报错，构建阶段中止。
- `obfuscate?: boolean`：全局混淆开关（Base64），默认 `false`。
- `obfuscateSkipKeys?: string[]`：跳过混淆的原始键名（如 `'testUrl'`）。
- `disableTypes?: boolean`：禁用类型文件生成，默认 `false`。
- `typesOutput?: string`：类型输出文件路径，默认 `'env.d.ts'`。
- `literalUnions?: boolean`：是否为类型生成“联合字面量”精确值，默认 `true`。开启后会从 `default` 与所有环境段聚合每个键的取值并去重，生成如 `'通用环境变量'|'开发环境变量'|'生产环境变量'` 的类型；若某键无可聚合值则回退为 `string`。

## 字段级策略（EnvConfigOption）
- 写法：字符串或对象 `{ value?: string; obfuscate?: boolean }`
- 优先级：
  1. 字段 `obfuscate`（强制）
  2. `obfuscateSkipKeys` 白名单
  3. 全局 `obfuscate`
- 建议：URL/直接使用型字段设置 `obfuscate: false` 或加入 `obfuscateSkipKeys`。

## 严格键约束（推荐）
- 为了在类型层面约束“必填键”，可使用泛型（参数顺序为：`RequiredKeys`，`EnvNames`）：
  - `EnvConfig<RequiredKeys>`：默认五个环境；环境段仅允许 `desc` 与 `RequiredKeys`，其它键将报错；`default` 段可包含任意额外键
  - `EnvConfig<RequiredKeys, EnvNames>`：在默认内置集合基础上加入自定义环境名；同样对环境段进行严格约束
  - 示例：
```ts
// 约束必填键集合（EnvNames 可省略，默认五个环境）；default 段可包含其他键
type Required = 'baseURL' | 'apiURL' | 'uploadURL' | 'gisJs' | 'gisCss'

export default {
  // default 段可为 Partial，仅提供通用键
  default: { desc: '通用环境变量', title: '可选额外键（仅限 default）' },
  development: {
    desc: '开发环境变量',
    baseURL: { value: 'http://localhost:3000', obfuscate: true },
    apiURL: '/api',
    uploadURL: '/files',
    gisJs: '/gis',
    gisCss: '/gis'
  },
  production: {
    desc: '生产环境变量',
    baseURL: 'https://api.example.com',
    apiURL: '/api',
    uploadURL: '/files'
  }
} satisfies EnvConfig<Required>
```

> 说明：在上述严格约束中，非 default 段写入 `title` 将产生类型错误；这有助于保证不同环境的键集合一致与可预期。

## 联合字面量类型（更精确的 IDE 提示）
- 行为：当 `literalUnions: true`（默认）时，类型文件会基于 `env.config.ts` 中 `default` 与各环境段的值生成更精确的“联合字面量类型”。
- 收集规则：
  - 对象形态值取其 `value` 字段；空值与空字符串忽略；重复值去重并排序保证稳定输出。
  - 与混淆无关：类型收集使用原始配置值，不受 `obfuscate` 影响。
- 示例效果：
```ts
// env.d.ts（片段）
interface ImportMetaEnv {
  readonly VITE_DESC: '通用环境变量' | '开发环境变量' | '生产环境变量'
  readonly VITE_BASE_URL: string // 多环境下 URL 不同，通常保持 string
}
interface ImportMeta { readonly env: ImportMetaEnv }
```
- 关闭方式：如需保持所有键为 `string`，在插件中设置 `literalUnions: false`。
- 适用场景：对枚举型或少量可选值的字段（如 `desc`、`modeName`）提供更强的补全与校验；对高度动态的键（如 URL）建议保持 `string`。

## 应用场景
- 多环境配置集中管理：`default` 提供通用配置，各环境覆盖差异。
- 构建/启动自动生成 `.env.*`，统一团队实践与产物。
- 弱化敏感字段的直观可读性（Base64），在前端使用前可选择性还原或直接跳过混淆。
- 对关键配置强制校验，避免遗漏导致的运行期问题。

## 命名转换规则
- 变量键名会按“驼峰/分词”转换为大写下划线：`baseURL -> BASE_URL`、`testUrl -> TEST_URL`。
- 最终导出到 `import.meta.env` 时拼接前缀：默认 `VITE_`，即 `VITE_BASE_URL`。
- 非字母数字字符会被规范为 `_`，多余下划线会折叠并去除首尾。
- 可通过 `includePrefixes` 显式设置前缀集合；仅使用第一个前缀生成。

## 与 Vite `loadEnv` 配合
```ts
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [envConfigPlugin()],
    server: { proxy: { '/api': env.VITE_API_URL } }
  }
})
```

## 运行机制与细节
- 合并策略：`{ ...default, ...env[mode] }`，后者覆盖同名键。
- 前缀过滤：仅生成符合 `includePrefixes` 的键（默认 `VITE_`）。
- 读取实现：使用 `c12` 加载配置对象（仅限当前 `root` 明确路径）。
- 文件监听：开发模式监听 `env.config.ts`，变更时自动再生成并重启。
- 首次运行（缺失配置）：若当前 `root` 下无 `env.config.ts`，将扫描 `.env*` 合成配置文件并立即停止本轮流程（不写 `.env`）；下一个生命周期调用也会跳过一次，避免“刚生成配置就覆盖本地 `.env`”。
- 写入条件：仅当合并后“存在有效键”时才写 `.env.{mode}.local` 与 `.env.local`；合并结果为空或仅被前缀过滤为空时，跳过写入并输出日志 `skip .env... (0 keys)`。
- 类型文件：在未禁用的情况下会根据配置生成类型文件；即使 `.env` 被跳过，类型仍可生成（用于 IDE 提示）。
- 生命周期：在 `config` 与 `buildStart` 阶段各执行一次；属于预热与构建保证，可能会打印两条日志。

## 示例：应用读取
```ts
// 在组件/应用中读取（推荐不在模板中直接写 import.meta）
const baseURL = import.meta.env.VITE_BASE_URL
const testUrl = import.meta.env.VITE_TEST_URL
```

> 提示：若启用了混淆，URL 类字段建议跳过混淆；如确需还原，可在应用层执行 Base64 解码，但不推荐对链接场景使用混淆。

## 注意事项
- Base64 仅为混淆，非加密；敏感信息不应下发到前端。
- 仅生成到 `import.meta.env` 的变量应以 `VITE_` 前缀命名；键名将自动按驼峰分词转为下划线大写（如 `baseURL -> VITE_BASE_URL`）。
- 模板中避免直接使用 `import.meta.env`，应在脚本中预处理后渲染。

## 行为变更摘要（相较旧版文档）
- 不再在工作区内广搜 `env.config.ts`，仅使用显式 `configFile` 或当前 `root` 下的配置。
- 缺失配置首轮仅生成 `env.config.ts`，不写 `.env`，并附带一次性跳过保护。
- `.env` 写入仅在“有键”时进行；键为空时跳过并打印 `skip` 日志；类型文件可独立生成。

## 性能与安全
- 生成流程轻量：文件读写与类型推断均为 O(n) 操作。
- 安全实践：前缀白名单与必填项校验能减少误注入与缺失风险；避免在前端存放真正机密。

## 进阶示例：自定义环境集合（中文环境名）
```ts
export default {
  default: { desc: '通用' },
  环境1: { desc: '环境1', baseURL: 'https://env1', apiURL: '/api', uploadURL: '/files', gisJs: '/gis', gisCss: '/gis', title: 'e1' },
  环境2: { desc: '环境2', baseURL: 'https://env2', apiURL: '/api', uploadURL: '/files', gisJs: '/gis', gisCss: '/gis', title: 'e2' }
} satisfies EnvConfig<'baseURL'|'apiURL','环境1'|'环境2'>
```

## IDE 代码提示与类型用法
```ts
import type { EnvConfig } from '@quiteer/vite-plugins'

// 基本用法：默认内置环境集合，强制每个环境段包含必填键
export default {
  default: { desc: '通用' },
  development: { desc: '开发', baseURL: 'http://localhost:3000', apiURL: '/api' },
  production: { desc: '生产', baseURL: 'https://api.example.com', apiURL: '/api' },
  test: { desc: '测试', baseURL: 'https://api.test', apiURL: '/api' },
  staging: { desc: '预发布', baseURL: 'https://api.staging', apiURL: '/api' },
  release: { desc: '发布', baseURL: 'https://api.release', apiURL: '/api' }
} satisfies EnvConfig<'baseURL'|'apiURL'>

// 自定义环境集合：仅需声明额外环境名，内置集合自动包含
export default {
  default: { desc: '通用' },
  环境1: { desc: '环境1', baseURL: 'https://env1', apiURL: '/api' },
  环境2: { desc: '环境2', baseURL: 'https://env2', apiURL: '/api' }
} satisfies EnvConfig<'baseURL'|'apiURL','环境1'|'环境2'>

// 字段值对象形态：支持按字段控制混淆
export default {
  default: { desc: '通用' },
  development: {
    desc: '开发',
    baseURL: { value: 'http://localhost:3000', obfuscate: true },
    apiURL: '/api'
  }
} satisfies EnvConfig<'baseURL'|'apiURL'>
```

- `EnvConfig<RequiredKeys>`：强制所有环境段包含 `RequiredKeys`；`default` 段仅强制 `desc`，其它键可选
- `EnvConfig<EnvNames, RequiredKeys>`：在默认内置集合基础上加入 `EnvNames`，并强制每个环境段包含 `RequiredKeys`
- `EnvValue` 支持字符串或对象 `{ value: string; obfuscate?: boolean }`，对象形态可按字段控制混淆
- 使用 `satisfies` 能获得更精准的 IDE 提示与错误定位：
  - 缺少必填键会类型报错
  - 写入未声明的环境名会类型报错（仅限传入的 `EnvNames` 与内置集合）

## 常见问题（FAQ）
- 如何还原混淆值？建议不进行还原，URL/直用型字段应跳过混淆；若确需还原，可在 Node 端或浏览器端解码：
```ts
/**
 * 还原 Base64 混淆值
 * 
 * 对受控场景的混淆字符串进行还原；生产环境中不建议对 URL 等直用型字段使用混淆。
 * 
 * @param v - Base64 字符串
 * @returns 还原后的普通字符串
 * @throws {TypeError} 当入参不是字符串或格式非法时抛出
 * 
 * @example
 * ```ts
 * decodeBase64Env('aHR0cHM6Ly9hcGkuZXhhbXBsZS5jb20=') // 'https://api.example.com'
 * ```
 * 
 * @remarks
 * - 浏览器环境可使用 `atob`；Node 环境使用 `Buffer`
 * 
 * @security
 * 混淆非加密，请勿用于机密信息
 * 
 * @performance
 * O(n) 字符处理
 */
export function decodeBase64Env(v: string): string {
  if (typeof v !== 'string')
    throw new TypeError('invalid base64 value')
  if (typeof window !== 'undefined' && typeof window.atob === 'function')
    return decodeURIComponent(escape(window.atob(v)))
  return Buffer.from(v, 'base64').toString('utf8')
}
```
- `requiredKeys` 与 `default` 段：`default` 可包含额外键；必填校验仅针对当前环境段（合并后）。
- 生成的文件位置：默认写入根目录的 `.env.local` 与 `.env.{mode}.local`，类型文件写入 `env.d.ts`（可通过 `typesOutput` 自定义）。
- 多包/工作区：插件会在 `root` 下查找 `env.config.ts`，若未找到将广搜一次；也可通过 `configFile` 显式指定。
