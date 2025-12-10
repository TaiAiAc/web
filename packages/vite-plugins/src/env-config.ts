import type { Plugin } from 'vite'
import type { EnvConfigShape } from './shared/env-shared'
import { Buffer } from 'node:buffer'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import dotenv from 'dotenv'
import fg from 'fast-glob'
import { bold, cyan, gray, green, red, yellow } from 'kolorist'
import { fromEnvKey, generateEnvDtsFromTypeMap, mergeByMode, parseConfigModule, resolveEnvConfigPath, toEnvKey, writeIfChanged } from './shared/env-shared'

type EnvValue = string | { value: string, obfuscate?: boolean }

type EnvName = 'development' | 'production' | 'test' | 'staging' | 'release'

/**
 * 严格环境段类型：仅允许 `desc` 与声明的 `Keys`，多余键会在字面量赋值时报错
 */
type StrictEnvSection<Keys extends string> = {
  desc: EnvValue
} & { [K in Keys]-?: EnvValue }

export type EnvConfig<Keys extends string = never, EnvNames extends string = EnvName> = {
  /** default 段允许任意扩展键，且 Keys 为可选 */
  default: { desc: EnvValue } & Partial<Record<Keys, EnvValue>> & Record<string, EnvValue>
} & {
  /** 具体环境段严格限制：只能包含 desc 与 Keys，不允许多余键 */
  [K in EnvNames]: StrictEnvSection<Keys>
}

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
  /** 必填项校验，缺失将报错，默认 ['desc'] */
  requiredKeys?: string[]
  /** 是否启用混淆（Base64），默认 false */
  obfuscate?: boolean
  /** 跳过混淆的原始键列表（如 'testUrl'），优先级低于字段 obfuscate */
  obfuscateSkipKeys?: string[]
  /** 类型输出文件路径，默认生成到根目录 "env.d.ts" */
  typesOutput?: string
  /** 是否禁用类型文件生成，默认 false */
  disableTypes?: boolean
  /** 是否生成联合字面量类型（从所有环境收集），默认 true */
  literalUnions?: boolean
}

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
 * @performance
 * - 文件读取/写入及类型生成均为轻量操作；监听模式下按需触发
 */
export function envConfigPlugin(options: EnvConfigPluginOptions = {}): Plugin {
  let resolvedRoot = options.root
  let resolvedMode = options.targetEnv
  const resolvedConfigPath = options.configFile
  let includePrefixes = options.includePrefixes ?? ['VITE_']
  const required = options.requiredKeys ?? ['desc']
  const obfuscate = options.obfuscate ?? false
  const obfuscateSkipKeys = options.obfuscateSkipKeys ?? []
  let typesOut = options.typesOutput
  let envFileTemplate = options.envFileTemplate ?? '.env.{mode}.local'
  let defaultEnvFile = options.defaultEnvFile ?? '.env.local'
  const disableTypes = options.disableTypes ?? false
  const literalUnions = options.literalUnions ?? true
  const envPatterns = ['.env', '.env.*', '.env.*.local', '.env.local']

  /**
   * 函数：resolveEnvConfigPath
   *
   * 寻找 env.config.ts 文件路径：优先使用配置的路径，其次在 root 下查找，
   * 若未找到则在工作区内进行一次广搜以兼容多包结构。
   *
   * @param root - 项目根目录
   * @returns 解析到的绝对路径
   */
  async function findConfig(root: string): Promise<string | null> {
    const fromShared = await resolveEnvConfigPath(root, resolvedConfigPath)
    if (fromShared)
      return fromShared
    return null
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
   * 将普通键转换为符合前缀的环境变量名，如 baseURL -> VITE_BASE_URL。
   * 非字母数字以 _ 连接并转大写。
   *
   * @param key - 配置键名
   * @returns 环境变量名
   */
  const toKey = (key: string) => toEnvKey(includePrefixes, key)

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
   * 函数：resolveSectionFromFile
   *
   * 从 env 文件名推断所属段：`.env`/`.env.local` -> 'default'；
   * `.env.{mode}`/`.env.{mode}.local` -> '{mode}'。
   *
   * @param file - 文件路径
   * @returns 段名（default 或具体环境）
   */
  function resolveSectionFromFile(file: string): string {
    const name = path.basename(file)
    if (name === '.env' || name === '.env.local')
      return 'default'
    const m = name.match(/^\.env\.([^.]+)(?:\.local)?$/)
    return m ? m[1] : 'default'
  }

  /**
   * 函数：expandInterpolations
   *
   * 对 `VAL="${OTHER}/x"` 形式进行展开，支持多轮替换直至稳定，最大 5 轮。
   *
   * @param map - 同一段内的环境变量映射（键为 env 变量名，如 `VITE_API_URL`）
   * @returns 展开后的映射
   */
  function expandInterpolations(map: Record<string, string>): Record<string, string> {
    const out: Record<string, string> = { ...map }
    const re = /\$\{([A-Z0-9_]+)\}/g
    for (let i = 0; i < 5; i++) {
      let changed = false
      for (const [k, v] of Object.entries(out)) {
        const nv = v.replace(re, (_, varName) => (out[varName] ?? ''))
        if (nv !== v) {
          out[k] = nv
          changed = true
        }
      }
      if (!changed)
        break
    }
    return out
  }

  /**
   * 函数：readEnvFilesToShape
   *
   * 扫描根目录下 `.env*` 文件，按段合并并展开嵌套引用，
   * 将前缀变量转换为原始键（驼峰），生成 `EnvConfigShape`。
   *
   * @param root - 根目录
   * @returns 依据 .env* 构建的配置形状
   */
  async function readEnvFilesToShape(root: string): Promise<EnvConfigShape | null> {
    const files = await fg(envPatterns, { cwd: root, dot: true, absolute: true, onlyFiles: true })
    if (!files.length)
      return null
    const bySectionRaw: Record<string, Record<string, string>> = {}
    for (const f of files) {
      const sec = resolveSectionFromFile(f)
      const buf = await fs.readFile(f, 'utf8')
      const parsed = dotenv.parse(buf)
      const filtered: Record<string, string> = {}
      for (const [k, v] of Object.entries(parsed)) {
        if (includePrefixes.length === 0 || includePrefixes.some(p => k.startsWith(p)))
          filtered[k] = v
      }
      bySectionRaw[sec] = { ...(bySectionRaw[sec] || {}), ...filtered }
    }
    const shape: EnvConfigShape = { default: {} }
    for (const [sec, raw] of Object.entries(bySectionRaw)) {
      const expanded = expandInterpolations(raw)
      const out: Record<string, unknown> = {}
      for (const [envKey, v] of Object.entries(expanded)) {
        const orig = fromEnvKey(includePrefixes, envKey)
        if (orig)
          out[orig] = v
      }
      if (sec === 'default')
        shape.default = out
      else (shape as any)[sec] = out
    }
    shape.default = { desc: '来自 .env 默认段', ...(shape.default || {}) }
    for (const k of Object.keys(shape)) {
      if (k !== 'default') {
        const obj = (shape as any)[k] as Record<string, unknown>
        if (!('desc' in obj))
          obj.desc = `来自 .env.${k} 段`
      }
    }
    return shape
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
      const key = toKey(k)
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
  function generateUnionTypesFromFullConfig(full: EnvConfigShape): string {
    const typeMap = new Map<string, string>()
    const collect: Record<string, Set<string>> = {}
    const sections = Object.keys(full)
    for (const sec of sections) {
      const obj = (full as Record<string, Record<string, unknown>>)[sec]
      if (!obj)
        continue
      for (const [k, v] of Object.entries(obj)) {
        const set = collect[k] ?? new Set<string>()
        let raw = ''
        if (v == null) {
          raw = ''
        }
        else if (typeof v === 'object') {
          raw = String((v as any).value ?? '')
        }
        else {
          raw = String(v)
        }
        if (raw !== '')
          set.add(JSON.stringify(raw))
        collect[k] = set
      }
    }
    for (const [k, set] of Object.entries(collect)) {
      const key = toKey(k)
      const union = set.size > 0 ? Array.from(set).sort().join(' | ') : 'string'
      typeMap.set(key, union)
    }
    return generateEnvDtsFromTypeMap(typeMap)
  }

  /**
   * 函数：writeIfChanged
   *
   * 写入文件（内容无变化则跳过）。
   *
   * @param file - 目标文件
   * @param content - 文本内容
   */
  const writeOut = writeIfChanged

  /**
   * 函数：runGenerate
   *
   * 核心流程：解析配置、校验、生成 .env 与类型声明。
   */
  async function runGenerate(): Promise<{ missing: string[] }> {
    if (!resolvedRoot || !resolvedMode)
      return { missing: [] }

    let cfgPath = await findConfig(resolvedRoot)
    if (!cfgPath) {
      const shapeFromEnv = await readEnvFilesToShape(resolvedRoot)
      if (shapeFromEnv) {
        const target = path.join(resolvedRoot, 'env.config.ts')
        const sections = Object.keys(shapeFromEnv)
        const keySet = new Set<string>()
        for (const sec of sections) {
          if (sec === 'default')
            continue
          for (const k of Object.keys((shapeFromEnv as any)[sec] || {})) {
            if (k !== 'desc')
              keySet.add(k)
          }
        }
        const keys = Array.from(keySet).sort()
        const typeLine = `type MyConfig = EnvConfig<${keys.map(k => `'${k}'`).join(' | ') || 'never'}>`
        const lines: string[] = []
        lines.push(`import type { EnvConfig } from '@quiteer/vite-plugins'`)
        lines.push(typeLine)
        lines.push('')
        lines.push('export default {')
        for (const sec of sections) {
          const obj = (shapeFromEnv as any)[sec] as Record<string, unknown>
          const entries = Object.entries(obj).sort(([a], [b]) => a.localeCompare(b))
          lines.push(`  ${sec}: {`)
          for (const [k, v] of entries) {
            const vv = typeof v === 'string' ? JSON.stringify(v) : JSON.stringify(String(v))
            lines.push(`    ${k}: ${vv},`)
          }
          lines.push('  },')
        }
        lines.push(`} satisfies MyConfig`)
        lines.push('')
        await writeOut(target, lines.join('\n'))
        cfgPath = target
        // 继续往下走：解析刚写入的配置并生成 .env 与类型
      }
      else {
        throw new Error('未找到 env.config.ts 或 .env* 文件，请提供配置或 .env')
      }
    }
    if (!cfgPath)
      throw new Error('未找到 env.config.ts，请在根目录或子包中提供')
    const full = await parseConfigModule(cfgPath)
    const baseOnly = { ...full.default }
    const merged = mergeByMode(full, resolvedMode)
    const hasKeys = Object.keys(merged).length > 0
    const missing = hasKeys ? getMissingRequired(merged) : []
    let envFileMergedPath: string | null = null
    if (hasKeys) {
      const envTextMerged = generateEnvFileContent(merged)
      envFileMergedPath = path.join(resolvedRoot, envFileTemplate.replace('{mode}', resolvedMode))
      await writeOut(envFileMergedPath, envTextMerged)
    }

    const baseHasKeys = Object.keys(baseOnly).length > 0
    let envFileDefaultPath: string | null = null
    if (baseHasKeys) {
      const envTextDefault = generateEnvFileContent(baseOnly)
      envFileDefaultPath = path.join(resolvedRoot, defaultEnvFile)
      await writeOut(envFileDefaultPath, envTextDefault)
    }

    if (!disableTypes) {
      const dtsText = literalUnions
        ? generateUnionTypesFromFullConfig(full)
        : generateEnvDtsFromTypeMap(new Map(Object.keys(merged).map(k => [toKey(k), 'string'])))
      const dtsFile = typesOut ?? path.join(resolvedRoot, 'env.d.ts')
      await writeOut(dtsFile, dtsText)

      const dRel = envFileDefaultPath ? green(path.relative(resolvedRoot, envFileDefaultPath)) : gray('(skip .env.local)')
      const mRel = envFileMergedPath ? green(path.relative(resolvedRoot, envFileMergedPath)) : gray(`(skip ${envFileTemplate.replace('{mode}', resolvedMode)})`)
      console.log(`${bold(cyan('[env-config]'))} 生成 ${dRel} 与 ${mRel}，类型 ${green(path.relative(resolvedRoot, dtsFile))} ${gray(`(${Object.keys(merged).length} keys, obfuscate=${obfuscate})`)}`)
    }
    else {
      const dRel = envFileDefaultPath ? green(path.relative(resolvedRoot, envFileDefaultPath)) : gray('(skip .env.local)')
      const mRel = envFileMergedPath ? green(path.relative(resolvedRoot, envFileMergedPath)) : gray(`(skip ${envFileTemplate.replace('{mode}', resolvedMode)})`)
      console.log(`${bold(cyan('[env-config]'))} 生成 ${dRel} 与 ${mRel} ${gray(`(${Object.keys(merged).length} keys, obfuscate=${obfuscate}, types disabled)`)}`)
    }
    if (missing.length > 0) {
      console.error(`${bold(red('[env-config] 必填项缺失'))} 环境 ${yellow(resolvedMode)} 缺少：${red(missing.join(', '))}  请补齐 ${cyan('env.config.ts')} 对应段或调整 ${cyan('requiredKeys')}`)
    }
    return { missing }
  }

  return {
    name: 'quiteer-env-config',
    enforce: 'pre',
    /**
     * 函数：apply
     *
     * 插件在开发与构建阶段均生效。
     */
    apply: () => true,
    /**
     * 函数：config
     *
     * 在配置解析前执行一次生成，确保首次运行时 `.env` 与类型已就绪，
     * 便于用户在 `vite.config.ts` 中使用 `loadEnv` 或依赖环境变量的配置。
     */
    async config(userConfig, env) {
      // 预解析 root/mode 与前缀
      resolvedRoot = options.root ?? (userConfig.root || process.cwd())
      resolvedMode = options.targetEnv ?? env.mode
      includePrefixes = options.includePrefixes ?? (Array.isArray(userConfig.envPrefix)
        ? userConfig.envPrefix
        : typeof userConfig.envPrefix === 'string'
          ? [userConfig.envPrefix]
          : ['VITE_']
      )
      typesOut = options.disableTypes ? undefined : (options.typesOutput ?? path.join(resolvedRoot!, 'env.d.ts'))
      envFileTemplate = options.envFileTemplate ?? '.env.{mode}.local'
      defaultEnvFile = options.defaultEnvFile ?? '.env.local'

      // 首次运行提前生成，避免用户配置读取不到环境变量
      await runGenerate()
    },

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
