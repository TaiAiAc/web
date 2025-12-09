import type { Plugin } from 'vite'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'
import fg from 'fast-glob'
import { bold, cyan, gray, green } from 'kolorist'
import { generateEnvDtsFromTypeMap, writeIfChanged } from './shared/env-shared'

export interface EnvTypesOptions {
  /** 项目根目录，默认使用 Vite 的 root */
  root?: string
  /** 扫描的 env 文件模式，默认 ['.env', '.env.*', '.env.*.local', '.env.local'] */
  envFilePatterns?: string[]
  /** 允许导出到 import.meta.env 的前缀，默认取 Vite 配置 envPrefix 或 ['VITE_'] */
  includePrefixes?: string[]
  /** 输出文件路径，默认在根目录生成 env.d.ts */
  outputFile?: string
  /** 是否生成联合字面量类型（跨多个 .env 文件聚合），默认 true */
  literalUnions?: boolean
}

/**
 * 函数：创建环境变量类型生成插件
 * 作用：扫描 .env.* 文件并生成 env.d.ts，提供 import.meta.env 的 TypeScript 类型提示
 */
export function envTypesPlugin(options: EnvTypesOptions = {}): Plugin {
  let resolvedRoot = options.root
  let prefixes: string[] = options.includePrefixes ?? ['VITE_']
  const patterns = options.envFilePatterns ?? ['.env', '.env.*', '.env.*.local', '.env.local']
  let output = options.outputFile
  const literalUnions = options.literalUnions ?? true

  /**
   * 函数：判断是否为允许的前缀
   * 作用：仅保留 import.meta.env 可见的变量，避免注入私密变量
   */
  function allowKey(key: string): boolean {
    return prefixes.length === 0 || prefixes.some(p => key.startsWith(p))
  }

  /**
   * 函数：读取并解析单个 env 文件
   * 作用：返回键值对供后续类型推断
   */
  async function parseEnvFile(file: string): Promise<Record<string, string>> {
    const buf = await fs.readFile(file, 'utf8')
    const parsed = dotenv.parse(buf)
    return parsed
  }

  /**
   * 函数：生成 env.d.ts 内容
   * 作用：将推断的类型映射到 ImportMetaEnv 与 ImportMeta 接口
   */
  function generateDts(typeMap: Map<string, string>): string {
    return generateEnvDtsFromTypeMap(typeMap)
  }

  /**
   * 函数：写文件（内容相同时跳过）
   * 作用：避免不必要的写入导致编辑器抖动
   */
  const writeChanged = writeIfChanged

  /**
   * 函数：执行扫描并生成类型文件
   * 作用：核心流程，供构建与开发阶段调用
   */
  async function runGenerate(): Promise<void> {
    if (!resolvedRoot)
      return
    const cwd = resolvedRoot
    const files = await fg(patterns, { cwd, dot: true, onlyFiles: true, absolute: true })
    const acc = new Map<string, string[]>()
    for (const f of files) {
      const kv = await parseEnvFile(f)
      for (const [k, v] of Object.entries(kv)) {
        if (!allowKey(k))
          continue
        const arr = acc.get(k) ?? []
        arr.push(v)
        acc.set(k, arr)
      }
    }
    const typeMap = new Map<string, string>()
    for (const [k, values] of acc.entries()) {
      if (literalUnions) {
        const uniq = Array.from(new Set(values.filter(v => v.length > 0).map(v => JSON.stringify(String(v)))))
        const union = uniq.length > 0 ? uniq.sort().join(' | ') : 'string'
        typeMap.set(k, union)
      }
      else {
        typeMap.set(k, 'string')
      }
    }
    const outFile = output ?? path.join(cwd, 'env.d.ts')
    const dts = generateDts(typeMap)
    await writeChanged(outFile, dts)
    // 美化输出：提示已生成类型文件
    // eslint-disable-next-line no-console
    console.log(`${bold(cyan('[env]'))} 生成类型 ${green(path.relative(cwd, outFile))} ${gray(`(${typeMap.size} keys)`)}`)
  }

  return {
    name: 'quiteer-env-types',
    /**
     * 函数：控制插件应用阶段
     * 作用：开发与构建阶段均启用类型生成
     */
    apply: () => true,

    /**
     * 函数：解析最终配置
     * 作用：拿到 root 与 envPrefix 用于筛选变量
     */
    configResolved(config) {
      resolvedRoot = options.root ?? config.root
      const pfx = config.envPrefix
      prefixes = options.includePrefixes ?? (Array.isArray(pfx) ? pfx : typeof pfx === 'string' ? [pfx] : ['VITE_'])
      output = options.outputFile ?? path.join(resolvedRoot!, 'env.d.ts')
    },

    /**
     * 函数：构建启动钩子
     * 作用：在构建开始时生成类型
     */
    async buildStart() {
      await runGenerate()
    },

    /**
     * 函数：开发服务器钩子
     * 作用：监听 env 文件变化并重新生成类型
     */
    configureServer(server) {
      server.watcher.add(patterns.map(p => path.join(resolvedRoot!, p)))
      const handler = async () => {
        await runGenerate()
      }
      server.watcher.on('add', handler)
      server.watcher.on('change', handler)
      server.watcher.on('unlink', handler)
    }
  }
}
