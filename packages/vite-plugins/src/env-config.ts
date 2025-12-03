import type { Plugin } from 'vite'
import { Buffer } from 'node:buffer'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { loadConfig } from 'c12'
import fg from 'fast-glob'
import { bold, cyan, gray, green, red, yellow } from 'kolorist'

type EnvValue = string | { value: string, obfuscate?: boolean }
type EnvItem<RequiredKeys extends PropertyKey = never> = { desc: EnvValue } & Record<RequiredKeys, EnvValue> & Record<string, EnvValue>

type EnvName = 'development' | 'production' | 'test' | 'staging' | 'release'
export type EnvConfig<RequiredKeys extends PropertyKey = never, EnvNames extends string = EnvName> = {
  default: { desc: EnvValue } & Partial<Omit<EnvItem<RequiredKeys>, 'desc'>>
} & { [K in EnvNames]: EnvItem<RequiredKeys> }

export interface EnvConfigPluginOptions {
  /** 根目录，默认使用 Vite 的 root */
  root?: string
  /** 配置文件路径，默认在根目录查找 env.config.ts */
  configFile?: string
  /** 目标环境，默认使用 Vite 的 mode（development/production/test/staging/release 等） */
  targetEnv?: string
  /** 生成的 .env 文件名模板，默认 ".env.{mode}.local" */
  envFileTemplate?: string
  /** default 段对应的文件名，默认 ".env.local" */
  defaultEnvFile?: string
  /** 变量前缀白名单，默认 ['VITE_'] */
  includePrefixes?: string[]
  /** 是否推断基础类型（boolean/number/string），默认 true */
  inferTypes?: boolean
  /** 必填项校验，缺失将报错 */
  requiredKeys?: string[]
  /** 是否启用混淆（Base64），默认 false */
  obfuscate?: boolean
  /** 跳过混淆的原始键列表（如 'testUrl'），优先级低于字段 obfuscate */
  obfuscateSkipKeys?: string[]
  /** 类型输出文件路径，默认生成到根目录 "env.d.ts" */
  typesOutput?: string
  /** 是否禁用类型文件生成，默认 false */
  disableTypes?: boolean
}

type EnvConfigShape = Record<string, Record<string, unknown>> & { default?: Record<string, unknown> }

/**
 * 函数：envConfigPlugin
 *
 * 读取根目录下的 env.config.ts，根据当前运行环境合并 default 与对应环境段，
 * 生成符合前缀白名单的 VITE_* 变量写入到 .env 文件，并同步生成 TS 类型定义。
 * 支持文件监听，配置变动时自动重新生成。
 *
 * @param options - 插件配置项，如文件路径、前缀、加密方式等
 * @returns Vite 插件对象
 * @throws {Error} 配置文件缺失或必填项校验失败时抛出错误
 *
 * @example
 * ```ts
 * import { defineConfig } from 'vite'
 * import { envConfigPlugin } from '@quiteer/vite-plugins'
 *
 * export default defineConfig({
 *   plugins: [envConfigPlugin({ requiredKeys: ['baseURL', 'apiURL'] })]
 * })
 * ```
 *
 * @remarks
 * - 配置文件对象需为 `export default { default: {}, development: {}, ... }`
 * - 写入的 .env 文件默认位于项目根目录，文件名遵循模板
 *
 * @security
 * - 若启用 AES 加密，必须提供稳定的 `secretKey`，并避免将其提交到代码仓库
 *
 * @performance
 * - 文件读取/写入及类型生成均为轻量操作；监听模式下按需触发
 */
export function envConfigPlugin(options: EnvConfigPluginOptions = {}): Plugin {
  let resolvedRoot = options.root
  let resolvedMode = options.targetEnv
  const resolvedConfigPath = options.configFile
  let includePrefixes = options.includePrefixes ?? ['VITE_']
  const infer = options.inferTypes ?? true
  const required = options.requiredKeys ?? []
  const obfuscate = options.obfuscate ?? false
  const obfuscateSkipKeys = options.obfuscateSkipKeys ?? []
  let typesOut = options.typesOutput
  let envFileTemplate = options.envFileTemplate ?? '.env.{mode}.local'
  let defaultEnvFile = options.defaultEnvFile ?? '.env.local'
  const disableTypes = options.disableTypes ?? false

  /**
   * 函数：resolveEnvConfigPath
   *
   * 寻找 env.config.ts 文件路径：优先使用配置的路径，其次在 root 下查找，
   * 若未找到则在工作区内进行一次广搜以兼容多包结构。
   *
   * @param root - 项目根目录
   * @returns 解析到的绝对路径
   */
  async function resolveEnvConfigPath(root: string): Promise<string | null> {
    if (resolvedConfigPath) {
      const abs = path.isAbsolute(resolvedConfigPath) ? resolvedConfigPath : path.join(root, resolvedConfigPath)
      try {
        await fs.access(abs)
        return abs
      }
      catch {}
    }
    const direct = path.join(root, 'env.config.ts')
    try {
      await fs.access(direct)
      return direct
    }
    catch {}
    const matches = await fg('**/env.config.ts', { cwd: root, dot: true, absolute: true, onlyFiles: true })
    return matches[0] ?? null
  }

  /**
   * 函数：parseConfigModule
   *
   * 读取并解析 env.config.ts 的默认导出对象（不依赖额外编译器）。
   * 实现：移除 `export default` 语句，利用 `vm` 等价方式安全求值。
   *
   * @param file - 配置文件绝对路径
   * @returns 配置对象，形如 { default: {...}, development: {...}, ... }
   */
  async function parseConfigModule(file: string): Promise<EnvConfigShape> {
    const { config } = await loadConfig<EnvConfigShape>({
      name: 'env',
      cwd: path.dirname(file),
      configFile: file,
      rcFile: false,
      dotenv: false,
      packageJson: false,
      globalRc: false
    })
    if (!config || typeof config !== 'object')
      throw new Error('env.config.ts 格式错误：默认导出必须为对象')
    return config
  }

  /**
   * 函数：mergeByMode
   *
   * 合并 default 与当前环境段，环境段覆盖 default。
   *
   * @param cfg - 完整配置对象
   * @param mode - 当前环境名
   * @returns 合并后的键值对象
   */
  function mergeByMode(cfg: EnvConfigShape, mode: string): Record<string, unknown> {
    const base = { ...cfg.default }
    const specific = { ...cfg[mode] }
    return { ...base, ...specific }
  }

  /**
   * 函数：validateRequired
   *
   * 校验必填项是否存在，缺失即抛错。
   *
   * @param obj - 合并后的配置对象
   */
  function getMissingRequired(obj: Record<string, unknown>): string[] {
    return required.filter((k) => {
      const v = obj[k]
      if (v === undefined)
        return true
      if (typeof v === 'object' && v !== null) {
        const vv = (v as any).value
        return vv === undefined || vv === null || vv === ''
      }
      return false
    })
  }

  /**
   * 函数：toEnvKey
   *
   * 将普通键转换为符合前缀的环境变量名，如 baseURL -> VITE_BASEURL。
   * 非字母数字以 _ 连接并转大写。
   *
   * @param key - 配置键名
   * @returns 环境变量名
   */
  function toEnvKey(key: string): string {
    const norm = key.replace(/[^a-z0-9]+/gi, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '')
    return `${includePrefixes[0] ?? 'VITE_'}${norm.toUpperCase()}`
  }

  /**
   * 函数：inferType
   *
   * 推断值的基础类型：boolean/number/string。
   *
   * @param values - 值集合
   * @returns 推断类型
   */
  function inferType(values: string[]): 'boolean' | 'number' | 'string' {
    const trimmed = values.map(v => String(v).trim()).filter(v => v.length > 0)
    if (trimmed.length === 0)
      return 'string'
    const isBool = trimmed.every(v => v === 'true' || v === 'false')
    if (isBool)
      return 'boolean'
    const isNum = trimmed.every(v => /^-?\d+(?:\.\d+)?$/.test(v))
    if (isNum)
      return 'number'
    return 'string'
  }

  /**
   * 函数：obfuscateValue
   *
   * 混淆字符串（Base64）。
   *
   * @param value - 原始字符串值
   * @returns 处理后的字符串
   */
  function obfuscateValue(value: string): string {
    return Buffer.from(value, 'utf8').toString('base64')
  }

  /**
   * 函数：generateEnvFileContent
   *
   * 生成 .env 文件内容，按行 `KEY=VALUE`。
   *
   * @param obj - 合并后的配置对象
   * @returns 文本内容
   */
  function generateEnvFileContent(obj: Record<string, unknown>): string {
    const lines: string[] = []
    for (const [k, v] of Object.entries(obj)) {
      const key = toEnvKey(k)
      let raw = ''
      let shouldTransform: boolean | undefined
      if (v == null) {
        raw = ''
      }
      else if (typeof v === 'object') {
        const vv = (v as any).value
        const obfRaw = (v as any).obfuscate
        const obf = typeof obfRaw === 'string' ? obfRaw === 'true' ? true : obfRaw === 'false' ? false : undefined : (typeof obfRaw === 'boolean' ? obfRaw : undefined)
        raw = vv == null ? '' : String(vv)
        shouldTransform = obf !== undefined ? obf : undefined
      }
      else {
        raw = String(v)
      }
      const skip = obfuscateSkipKeys.includes(k)
      let finalObf: boolean
      if (shouldTransform === true)
        finalObf = true
      else if (shouldTransform === false || skip)
        finalObf = false
      else
        finalObf = obfuscate
      const out = finalObf ? obfuscateValue(raw) : raw
      lines.push(`${key}=${out}`)
    }
    return `${lines.join('\n')}\n`
  }

  /**
   * 函数：generateTypes
   *
   * 生成 ImportMetaEnv 类型声明，便于 IDE 提示与编译时检查。
   *
   * @param obj - 合并后的配置对象
   * @returns d.ts 文本
   */
  function generateTypes(obj: Record<string, unknown>): string {
    const lines: string[] = []
    lines.push('interface ImportMetaEnv {')
    const entries = Object.entries(obj)
    for (const [k, v] of entries.sort(([a], [b]) => a.localeCompare(b))) {
      const key = toEnvKey(k)
      let raw = ''
      if (v == null)
        raw = ''
      else if (typeof v === 'object' && v !== null)
        raw = String((v as any).value ?? '')
      else raw = String(v)
      const t = infer ? inferType([raw]) : 'string'
      lines.push(`  readonly ${key}: ${t}`)
    }
    lines.push('}')
    lines.push('interface ImportMeta {')
    lines.push('  readonly env: ImportMetaEnv')
    lines.push('}')
    return `${lines.join('\n')}\n`
  }

  /**
   * 函数：writeIfChanged
   *
   * 写入文件（内容无变化则跳过）。
   *
   * @param file - 目标文件
   * @param content - 文本内容
   */
  async function writeIfChanged(file: string, content: string): Promise<void> {
    try {
      const prev = await fs.readFile(file, 'utf8')
      if (prev === content)
        return
    }
    catch {}
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, content, 'utf8')
  }

  /**
   * 函数：runGenerate
   *
   * 核心流程：解析配置、校验、生成 .env 与类型声明。
   */
  async function runGenerate(): Promise<{ missing: string[] }> {
    if (!resolvedRoot || !resolvedMode)
      return { missing: [] }
    const cfgPath = await resolveEnvConfigPath(resolvedRoot)
    if (!cfgPath)
      throw new Error('未找到 env.config.ts，请在根目录或子包中提供')
    const full = await parseConfigModule(cfgPath)
    const baseOnly = { ...full.default }
    const merged = mergeByMode(full, resolvedMode)
    const missing = getMissingRequired(merged)
    const envTextMerged = generateEnvFileContent(merged)
    const envFileMerged = path.join(resolvedRoot, envFileTemplate.replace('{mode}', resolvedMode))
    await writeIfChanged(envFileMerged, envTextMerged)

    const envTextDefault = generateEnvFileContent(baseOnly)
    const envFileDefault = path.join(resolvedRoot, defaultEnvFile)
    await writeIfChanged(envFileDefault, envTextDefault)

    if (!disableTypes) {
      const dtsText = generateTypes(merged)
      const dtsFile = typesOut ?? path.join(resolvedRoot, 'env.quiteer.d.ts')
      await writeIfChanged(dtsFile, dtsText)
      // eslint-disable-next-line no-console
      console.log(`${bold(cyan('[env-config]'))} 生成 ${green(path.relative(resolvedRoot, envFileDefault))} 与 ${green(path.relative(resolvedRoot, envFileMerged))}，类型 ${green(path.relative(resolvedRoot, dtsFile))} ${gray(`(${Object.keys(merged).length} keys, obfuscate=${obfuscate})`)}`)
    }
    else {
      // eslint-disable-next-line no-console
      console.log(`${bold(cyan('[env-config]'))} 生成 ${green(path.relative(resolvedRoot, envFileDefault))} 与 ${green(path.relative(resolvedRoot, envFileMerged))} ${gray(`(${Object.keys(merged).length} keys, obfuscate=${obfuscate}, types disabled)`)}`)
    }
    if (missing.length > 0) {
      console.error(`${bold(red('[env-config] 必填项缺失'))} 环境 ${yellow(resolvedMode)} 缺少：${red(missing.join(', '))}  请补齐 ${cyan('env.config.ts')} 对应段或调整 ${cyan('requiredKeys')}`)
    }
    return { missing }
  }

  return {
    name: 'quiteer-env-config',
    /**
     * 函数：apply
     *
     * 插件在开发与构建阶段均生效。
     */
    apply: () => true,

    /**
     * 函数：configResolved
     *
     * 解析 Vite 上下文，确定 root/mode 及输出位置。
     */
    async configResolved(config) {
      resolvedRoot = options.root ?? config.root
      resolvedMode = options.targetEnv ?? config.mode
      includePrefixes = options.includePrefixes ?? (Array.isArray(config.envPrefix) ? config.envPrefix : typeof config.envPrefix === 'string' ? [config.envPrefix] : ['VITE_'])
      typesOut = options.disableTypes ? undefined : (options.typesOutput ?? path.join(resolvedRoot!, 'env.d.ts'))
      envFileTemplate = options.envFileTemplate ?? '.env.{mode}.local'
      defaultEnvFile = options.defaultEnvFile ?? '.env.local'
    },

    /**
     * 函数：buildStart
     *
     * 构建启动时执行生成流程。
     */
    async buildStart() {
      const { missing } = await runGenerate()
      if (missing.length > 0) {
        const msg = `必填项缺失：${missing.join(', ')}（环境 ${resolvedMode}）。请补齐 env.config.ts 或调整 requiredKeys。`

        console.error(red(`[env-config] 构建中止：${msg}`))
        this.error(msg)
      }
    },

    /**
     * 函数：configureServer
     *
     * 开发服务器挂载文件监听，配置变更时重新生成。
     */
    async configureServer(server) {
      const root = resolvedRoot!
      const cfgPath = await resolveEnvConfigPath(root)
      if (!cfgPath)
        return
      server.watcher.add(cfgPath)
      const handler = async () => {
        try {
          const { missing } = await runGenerate()
          if (missing.length > 0) {
            const msg = `必填项缺失：${missing.join(', ')}（环境 ${resolvedMode}）。请补齐 env.config.ts 或调整 requiredKeys。`
            server.config.logger.error(red(`[env-config] ${msg}`))
            // 避免向 HMR 客户端发送非标准错误包导致解析异常，仅日志提示
          }
        }
        catch (e) {
          server.config.logger.error(red(`[env-config] ${(e as Error).message}`))
        }
      }
      server.watcher.on('add', handler)
      server.watcher.on('change', handler)
      server.watcher.on('unlink', handler)
    }
  }
}
