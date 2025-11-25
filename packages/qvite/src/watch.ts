import type { QviteConfig } from './typings'
import { getPortPromise } from 'portfinder'
import { build } from 'tsdown'
import { createServer } from 'vite'
import { store } from './store'

export async function watch(options: QviteConfig) {
  const p = await getPortPromise({
    port: Number(options.port)
  })

  store.set('port', p)

  const viteDevServer = await createServer({ configFile: false, ...options.vite })

  viteDevServer.listen(p).then(viteDevServer.printUrls)

  build(options.tsdown)
}
