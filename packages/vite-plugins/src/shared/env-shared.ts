import { promises as fs } from 'node:fs'
import path from 'node:path'
import { loadConfig } from 'c12'

export type EnvConfigShape = Record<string, Record<string, unknown>> & { default?: Record<string, unknown> }

export function toEnvKey(prefixes: string[], key: string): string {
  const norm = key
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase()
  return `${prefixes[0] ?? 'VITE_'}${norm}`
}

/**
 * 从环境变量名反推原始键名
 *
 * 将如 `VITE_BASE_URL` 转换为 `baseUrl`；若不匹配任何前缀则返回 `null`。
 *
 * @param prefixes - 允许的环境变量前缀集合（如 `['VITE_']`）
 * @param envKey - 环境变量名（如 `VITE_BASE_URL`）
 * @returns 去前缀并按下划线转为驼峰的原始键名
 *
 * @example
 * ```ts
 * fromEnvKey(['VITE_'],'VITE_API_URL') // 'apiUrl'
 * ```
 *
 * @remarks
 * - 仅处理大写下划线形式；其他形式将按拆分并小写后组合
 *
 * @security
 * 无安全风险
 *
 * @performance
 * 字符串处理，成本极低
 */
export function fromEnvKey(prefixes: string[], envKey: string): string | null {
  const pfx = prefixes.find(p => envKey.startsWith(p))
  if (!pfx)
    return null
  const rest = envKey.slice(pfx.length).replace(/^_+|_+$/g, '')
  if (!rest)
    return null
  const parts = rest.split('_').filter(Boolean).map(s => s.toLowerCase())
  const head = parts[0]
  const tail = parts.slice(1).map(s => s.charAt(0).toUpperCase() + s.slice(1))
  return head + tail.join('')
}

export async function writeIfChanged(file: string, content: string): Promise<void> {
  try {
    const prev = await fs.readFile(file, 'utf8')
    if (prev === content)
      return
  }
  catch {}
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, content, 'utf8')
}

export async function resolveEnvConfigPath(root: string, explicit?: string): Promise<string | null> {
  if (explicit) {
    const abs = path.isAbsolute(explicit) ? explicit : path.join(root, explicit)
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
  return null
}

export async function parseConfigModule(file: string): Promise<EnvConfigShape> {
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

export function mergeByMode(cfg: EnvConfigShape, mode: string): Record<string, unknown> {
  const base = { ...cfg.default }
  const specific = { ...cfg[mode] }
  return { ...base, ...specific }
}

export type EnvPrimitiveType = 'boolean' | 'number' | 'string'

/**
 * 推断基础类型（boolean/number/string）
 *
 * 根据所有出现的字符串值集合进行判断，若全部为 `true|false` 推断为 boolean；
 * 若全部符合数字正则推断为 number；否则为 string。
 *
 * @param values - 字符串值集合，来自 .env 或配置对象的值序列
 * @returns 推断出的基础类型
 * @throws {Error} 不会抛错，始终返回三类之一
 *
 * @example
 * ```ts
 * inferPrimitiveType(['true','false']) // 'boolean'
 * inferPrimitiveType(['123','0']) // 'number'
 * inferPrimitiveType(['abc','123x']) // 'string'
 * ```
 *
 * @remarks
 * - 空集合或空字符串将被视为 string
 *
 * @security
 * 无安全风险，纯类型推断
 *
 * @performance
 * O(n) 遍历判断
 */
export function inferPrimitiveType(values: string[]): EnvPrimitiveType {
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
 * 生成 ImportMetaEnv 的 d.ts 文本
 *
 * 接收已准备好的类型映射并输出标准的 `ImportMetaEnv` 与 `ImportMeta` 接口声明。
 *
 * @param typeMap - 键到类型的映射，键应为最终导出的环境变量名（如 `VITE_BASE_URL`）
 * @returns d.ts 文本内容
 * @throws {Error} 不会抛错
 *
 * @example
 * ```ts
 * const tm = new Map<string, EnvPrimitiveType>([["VITE_BASE_URL","string"]])
 * const dts = generateEnvDtsFromTypeMap(tm)
 * ```
 *
 * @remarks
 * - 会按键名排序输出，便于稳定 diff
 *
 * @security
 * 无安全风险
 *
 * @performance
 * O(n) 拼接字符串
 */
export function generateEnvDtsFromTypeMap(typeMap: Map<string, string>): string {
  const lines: string[] = []
  lines.push('interface ImportMetaEnv {')
  for (const [key, t] of Array.from(typeMap.entries()).sort(([a], [b]) => a.localeCompare(b)))
    lines.push(`  readonly ${key}: ${t}`)
  lines.push('}')
  lines.push('interface ImportMeta {')
  lines.push('  readonly env: ImportMetaEnv')
  lines.push('}')
  return `${lines.join('\n')}\n`
}
