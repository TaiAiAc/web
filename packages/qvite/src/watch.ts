import type { QviteConfig } from './typings'
import path from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'
import { getPortPromise } from 'portfinder'
import { createServer } from 'vite'
import { getConfig } from './getConfig'
import { store } from './store'
import { normalizeConfig, toViteInlineConfig } from './transform'

/**
 * 启动开发服务器（热更新）
 *
 * 根据规范化配置启动 Vite Dev Server，自动选择可用端口，并打印访问地址
 *
 * @param options - Qvite 配置对象，包含 `vite` 与 `tsdown`
 * @returns Promise<void>
 * @throws {Error} 当端口查找或 Vite 启动失败时抛出异常
 *
 * @example
 * ```ts
 * await watch({ port: 3000, vite: { plugins: [] } })
 * ```
 *
 * @remarks
 * - 若配置的 `port` 被占用，将自动选取下一个可用端口
 * - 启动前执行一次 tsdown 构建，便于开发期产物可用
 * - 监控 `qvite.config.*` 变更并自动重启开发服务器（防抖）
 *
 * @security
 * 不暴露敏感信息，仅打印本地 URL
 *
 * @performance
 * 端口探测为 O(1) 近似成本，服务性能由 Vite 决定
 */
export async function watch(options: QviteConfig): Promise<void> {
  const normalized = await normalizeConfig(options)
  const port = normalized.vite?.server?.port

  const p = await getPortPromise({
    port
  })

  store.set('port', p)

  const inline = await toViteInlineConfig(normalized)

  const viteDevServer = await createServer({
    ...inline,
    server: { ...inline.server, port: p }
  })

  await viteDevServer.listen(p)
  viteDevServer.printUrls()

  if (normalized.tsdown) {
    const { build: tsdownBuild } = await import('tsdown')
    if (!Array.isArray(normalized.tsdown)) {
      await tsdownBuild(normalized.tsdown)
    }
    else {
      await Promise.all(normalized.tsdown.map(tsdownBuild))
    }
  }

  /**
   * 自动重启：监听 qvite 配置文件变更
   *
   * @remarks
   * - 使用 Vite 的内部 `chokidar` watcher，避免额外依赖
   * - 统一监听多种后缀：`.ts`、`.mjs`、`.cjs`、`.js`、`.json`
   * - 采用简单防抖，避免短时间内多次触发
   */
  const root = store.get<string>('root')!
  const configBase = store.get<string>('config') || 'qvite.config.ts'
  const candidates = ['ts', 'mjs', 'cjs', 'js', 'json'].map(s => path.join(root, `qvite.config.${s}`))
  // 兼容自定义传入路径（相对 root）
  const customPath = path.isAbsolute(configBase) ? configBase : path.join(root, configBase)
  const watchList = Array.from(new Set([customPath, ...candidates]))
  viteDevServer.watcher.add(watchList)

  let pending = false
  const restart = async () => {
    if (pending)
      return
    pending = true
    // 简单防抖
    await sleep(150)
    try {
      viteDevServer.config.logger.info(`[qvite] 检测到配置变更，正在重启开发服务器...`)
      await viteDevServer.close()
      const cfgFile = store.get<string>('config') || 'qvite.config.ts'
      const nextConfig = await getConfig(cfgFile)
      await watch(nextConfig)
    }
    catch (e) {
      viteDevServer.config.logger.error(`[qvite] 重启失败：${(e as Error).message}`)
    }
  }

  viteDevServer.watcher.on('change', (changedPath) => {
    if (watchList.includes(changedPath))
      restart()
  })

  viteDevServer.watcher.on('unlink', (unlinkedPath) => {
    if (watchList.includes(unlinkedPath))
      restart()
  })
}
