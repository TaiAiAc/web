/**
 * 启动 CLI：优先加载已构建的 dist 产物，若不存在则回退到 tsx 运行源码
 * @returns {Promise<void>} 异步启动任务
 */
export async function run() {
  try {
    await import(new URL('../dist/index.mjs', import.meta.url).href)
  }
  catch {
    const { require } = await import('tsx/cjs/api')
    require('./index.ts', import.meta.url)
  }
}

run()
