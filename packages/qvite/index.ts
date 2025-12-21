import type { UserConfig as TsdownUserConfig } from 'tsdown'
import type { UserConfig as ViteUserConfig } from 'vite'
import type { QviteConfig, QviteConfigExport, QviteConfigFnObject } from './src/typings'
import { defineConfig as tsdownDefineConfig } from 'tsdown'
import { defineConfig as viteDefineConfig } from 'vite'

export type * from './src/typings'

/**
 * `@quiteer/vite` 配置声明函数（类型辅助）
 *
 * 为 `qvite.config.ts` 提供强类型提示，支持对象、Promise 与函数多种导出形式
 *
 * @param config - 可为对象、Promise 或按环境返回配置的函数
 * @returns 与入参同构的配置对象/函数，用于类型推断，无运行时副作用
 * @throws {TypeError} 不抛出异常（纯类型辅助），运行时直接返回
 *
 * @example
 * ```ts
 * import { defineConfig } from 'qvite'
 * export default defineConfig({ mode: 'development', vite: { plugins: [] } })
 * ```
 *
 * @remarks
 * - 函数重载覆盖对象、Promise、函数等场景
 * - 仅用于 TS 类型推断，运行时原样返回
 *
 * @security
 * 不读取文件、不处理敏感信息
 *
 * @performance
 * 常量时间返回，无额外开销
 */
export function defineConfig(config: QviteConfig): QviteConfig

export function defineConfig(config: Promise<QviteConfig>): Promise<QviteConfig>

export function defineConfig(config: QviteConfigFnObject): QviteConfigFnObject

export function defineConfig(config: QviteConfigExport): QviteConfigExport

export function defineConfig(config: QviteConfigExport): QviteConfigExport {
  return config
}

// 类型导出通过 dts 文件与 typesVersions 提供，避免在 JS 解析阶段出现命名导出未定义的问题

/**
 * 暴露 Vite 的 `defineConfig`（类型辅助包装）
 *
 * 为 Vite 配置文件提供强类型提示；内部委托给 `vite.defineConfig`
 *
 * @param config - Vite 配置对象或按环境返回配置的函数
 * @returns 与入参同构的配置对象/函数，用于类型推断
 *
 * @example
 * ```ts
 * import { defineViteConfig } from 'qvite'
 * export default defineViteConfig({ plugins: [] })
 * ```
 *
 * @remarks
 * - 纯类型辅助，运行时直接委托给 Vite 的 `defineConfig`
 *
 * @security
 * 无敏感信息处理
 *
 * @performance
 * 常量时间委托，无额外开销
 */
export function defineViteConfig(
  config: Parameters<typeof viteDefineConfig>[0]
): ReturnType<typeof viteDefineConfig> {
  return viteDefineConfig(config as ViteUserConfig)
}

/**
 * 暴露 tsdown 的 `defineConfig`（类型辅助包装）
 *
 * 为 tsdown 配置文件提供强类型提示；内部委托给 `tsdown.defineConfig`
 *
 * @param config - tsdown 配置对象或配置数组
 * @returns 与入参同构的配置对象/数组，用于类型推断
 *
 * @example
 * ```ts
 * import { defineTsdownConfig } from 'qvite'
 * export default defineTsdownConfig([
 *   { name: 'client', entry: ['src/index.ts'], outDir: 'dist/client', platform: 'node' }
 * ])
 * ```
 *
 * @remarks
 * - 纯类型辅助，运行时直接委托给 tsdown 的 `defineConfig`
 *
 * @security
 * 无敏感信息处理
 *
 * @performance
 * 常量时间委托，无额外开销
 */
export function defineTsdownConfig(
  config: Parameters<typeof tsdownDefineConfig>[0]
): ReturnType<typeof tsdownDefineConfig> {
  return tsdownDefineConfig(config as TsdownUserConfig | TsdownUserConfig[])
}

export { FileSystemIconLoader, IconsResolver, NaiveUiResolver, UnFileSystemIconLoader } from '@quiteer/vite-plugins'
