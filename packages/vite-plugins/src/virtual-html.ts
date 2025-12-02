import type { Plugin } from 'vite'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { loadConfig } from 'c12'
import { bold, cyan, gray, green, red } from 'kolorist'

/**
 * 接口：HtmlTagDescriptor
 *
 * 描述一个抽象的 HTML 标签对象，用于通过配置在虚拟 HTML 中插入节点。
 * - 支持设置标签名、属性、内容、自闭合与插入位置；
 * - 属性值支持 string/number/boolean，`true` 输出孤立属性，`false|null|undefined` 跳过；
 * - 若 `selfClosing` 未指定，对常见自闭合标签（meta/link/base）自动按自闭合输出。
 *
 * @param tag - 标签名，例如 `meta`、`link`、`script`、`div`
 * @param attrs - 属性字典，值为 `string|number|boolean|null|undefined`
 * @param children - 标签内联文本内容，常用于 `script` 或内联样式
 * @param selfClosing - 是否自闭合，默认为针对少数标签的推断
 * @param position - 插入位置，`head`（默认）、`body-prepend`、`body-append`
 * @returns 该接口仅用于描述数据结构，无返回值
 *
 * @example
 * ```ts
 * const favicon: HtmlTagDescriptor = {
 *   tag: 'link',
 *   attrs: { rel: 'icon', href: '/favicon.svg' },
 *   selfClosing: true,
 *   position: 'head'
 * }
 * ```
 *
 * @remarks
 * - 当 `position` 未指定且 `tag` 为 `script` 时，默认视为 `body-append`
 *
 * @security
 * - 避免将不受信任的文本直接放入 `children`，必要时进行转义或清洗
 *
 * @performance
 * - 渲染时为 O(n) 遍历属性并生成字符串，开销极小
 */
export interface HtmlTagDescriptor {
  tag: string
  attrs?: Record<string, string | boolean | number | null | undefined>
  children?: string
  selfClosing?: boolean
  position?: 'head' | 'body-prepend' | 'body-append'
}

/**
 * 接口：HtmlVirtualConfig
 *
 * 虚拟 HTML 文档的顶层配置，控制 `<html> / <head> / <body>` 属性、标题、入口脚本与自定义标签列表。
 * - 未提供时使用内置默认配置（标题、入口、基础 meta 与 favicon、应用根节点）；
 * - 提供时对默认进行覆盖：`title/entry/tags` 整体覆盖；`attrs/appRoot.attrs` 浅合并。
 *
 * @param htmlAttrs - 应用于 `<html>` 的属性对象
 * @param headAttrs - 应用于 `<head>` 的属性对象
 * @param bodyAttrs - 应用于 `<body>` 的属性对象
 * @param title - 文档标题，输出为 `<title>`
 * @param tags - 额外插入的标签列表，见 `HtmlTagDescriptor`
 * @param entry - 应用入口脚本路径，默认 `'/src/main.ts'`
 * @param appRoot - 应用根节点描述（标签、id 与属性），默认 `div#app`
 * @returns 用于生成完整 HTML 的配置对象，无返回值
 *
 * @example
 * ```ts
 * const cfg: HtmlVirtualConfig = {
 *   title: 'Vue App',
 *   entry: '/src/main.ts',
 *   htmlAttrs: { lang: 'zh-CN' },
 *   bodyAttrs: { class: 'theme-light' },
 *   tags: [
 *     { tag: 'meta', attrs: { charset: 'utf-8' }, selfClosing: true, position: 'head' },
 *     { tag: 'link', attrs: { rel: 'icon', href: '/vite.svg' }, selfClosing: true, position: 'head' }
 *   ],
 *   appRoot: { id: 'app', tag: 'div' }
 * }
 * ```
 *
 * @remarks
 * - 若 `tags` 中已包含 `charset/viewport`，内置默认不会重复注入
 *
 * @security
 * - 属性与文本应来自可信来源；必要时做输入过滤
 *
 * @performance
 * - 最终渲染为一次字符串拼接操作，开销可忽略
 */
export interface HtmlVirtualConfig {
  htmlAttrs?: Record<string, string | boolean | number | null | undefined>
  headAttrs?: Record<string, string | boolean | number | null | undefined>
  bodyAttrs?: Record<string, string | boolean | number | null | undefined>
  title?: string
  script?: {
    src: string
    type?: string
    async?: boolean
    defer?: boolean
    crossorigin?: 'anonymous' | 'use-credentials'
    integrity?: string
    referrerpolicy?: string
    nonce?: string
    fetchpriority?: 'high' | 'low' | 'auto'
    attrs?: Record<string, string | boolean | number | null | undefined>
    position?: 'head' | 'body-prepend' | 'body-append'
  }
  style?: {
    src: string
    rel?: 'stylesheet'
    media?: string
    crossorigin?: 'anonymous' | 'use-credentials'
    integrity?: string
    referrerpolicy?: string
    attrs?: Record<string, string | boolean | number | null | undefined>
    position?: 'head' | 'body-prepend' | 'body-append'
  }
  tags?: HtmlTagDescriptor[]
  entry?: string
  appRoot?: { tag?: string, id?: string, attrs?: Record<string, string | boolean | number | null | undefined> }
}

/**
 * 接口：HtmlVirtualPluginOptions
 *
 * 虚拟 HTML 插件的运行选项，控制根目录解析、配置来源与在存在真实 `index.html` 时的回退策略。
 *
 * @param root - 项目根目录，默认使用 Vite `root`
 * @param configFile - 配置文件路径，默认 `'html.config.ts'`
 * @param config - 直接传入内联配置对象，优先于文件读取
 * @param fallbackWhenIndexExists - 当根下存在 `index.html` 时是否仍启用虚拟 HTML，默认 false
 * @returns 插件初始化所需的选项对象，无返回值
 *
 * @example
 * ```ts
 * virtualHtmlPlugin({
 *   config: { title: 'My App', entry: '/src/main.ts' },
 *   fallbackWhenIndexExists: true
 * })
 * ```
 *
 * @remarks
 * - 若同时提供 `config` 与 `configFile`，以 `config` 为准
 *
 * @security
 * - 请勿将敏感数据放入生成的静态标签或内联脚本中
 */
export interface HtmlVirtualPluginOptions {
  root?: string
  configFile?: string
  config?: HtmlVirtualConfig
  fallbackWhenIndexExists?: boolean
}

const DEFAULT_VIRTUAL_HTML_CONFIG: HtmlVirtualConfig = {
  title: 'Vue App',
  entry: '/src/main.ts',
  htmlAttrs: { lang: 'zh-CN' },
  bodyAttrs: { class: 'theme-light' },
  tags: [
    { tag: 'meta', attrs: { charset: 'utf-8' }, selfClosing: true, position: 'head' },
    { tag: 'meta', attrs: { name: 'viewport', content: 'width=device-width, initial-scale=1' }, selfClosing: true, position: 'head' },
    { tag: 'link', attrs: { rel: 'icon', href: '/vite.svg' }, selfClosing: true, position: 'head' }
  ],
  appRoot: { id: 'app', tag: 'div' }
}

/**
 * 函数：mergeVirtualConfig
 *
 * 合并虚拟 HTML 配置，允许对默认值进行覆盖；
 * tags 字段若提供则整体替换，否则沿用默认；attrs 进行浅合并。
 *
 * @param base - 默认配置
 * @param override - 用户覆盖配置
 * @returns 合并后的配置
 */
function mergeVirtualConfig(base: HtmlVirtualConfig, override: HtmlVirtualConfig = {}): HtmlVirtualConfig {
  const htmlAttrs = { ...base.htmlAttrs, ...override.htmlAttrs }
  const headAttrs = { ...base.headAttrs, ...override.headAttrs }
  const bodyAttrs = { ...base.bodyAttrs, ...override.bodyAttrs }
  const appRoot = {
    tag: override.appRoot?.tag ?? base.appRoot?.tag,
    id: override.appRoot?.id ?? base.appRoot?.id,
    attrs: { ...base.appRoot?.attrs, ...override.appRoot?.attrs }
  }
  return {
    title: override.title ?? base.title,
    entry: override.entry ?? base.entry,
    htmlAttrs,
    headAttrs,
    bodyAttrs,
    tags: override.tags ?? base.tags,
    script: override.script ?? base.script,
    style: override.style ?? base.style,
    appRoot
  }
}

/**
 * 函数：renderAttrs
 *
 * 将属性对象渲染为 HTML 属性字符串，布尔值 true 输出孤立属性，false/undefined/null 跳过。
 *
 * @param attrs - 属性字典，值允许 string/number/boolean
 * @returns 拼接后的属性字符串，前置空格，若为空返回空字符串
 *
 * @example
 * ```ts
 * renderAttrs({ lang: 'zh-CN', defer: true }) // ' lang="zh-CN" defer'
 * ```
 *
 * @remarks
 * - 会对引号进行最小转义，避免打断 HTML
 *
 * @security
 * 请勿将不受信任的文本直接放入属性值，必要时在上游做清洗
 *
 * @performance
 * O(n) 线性遍历属性键
 */
function renderAttrs(attrs?: Record<string, string | boolean | number | null | undefined>): string {
  if (!attrs)
    return ''
  const parts: string[] = []
  for (const [k, v] of Object.entries(attrs)) {
    if (v === false || v === null || v === undefined)
      continue
    if (v === true) {
      parts.push(k)
      continue
    }
    const val = String(v).replace(/"/g, '&quot;')
    parts.push(`${k}="${val}"`)
  }
  return parts.length ? ` ${parts.join(' ')}` : ''
}

/**
 * 函数：renderTag
 *
 * 渲染单个标签描述为 HTML 片段，支持自闭合与内联内容。
 *
 * @param d - 标签描述对象
 * @returns HTML 字符串
 *
 * @example
 * ```ts
 * renderTag({ tag: 'meta', attrs: { charset: 'utf-8' }, selfClosing: true })
 * ```
 */
function renderTag(d: HtmlTagDescriptor): string {
  const attrs = renderAttrs(d.attrs)
  const t = d.tag
  if (d.selfClosing ?? ['meta', 'link', 'base'].includes(t))
    return `<${t}${attrs}>`
  const children = d.children ?? ''
  return `<${t}${attrs}>${children}</${t}>`
}

/**
 * 将脚本配置转换为 HtmlTagDescriptor
 *
 * 基于 `HtmlVirtualConfig.script` 生成 `<script>` 标签描述，支持 `type/async/defer/crossorigin/integrity/referrerpolicy/nonce/fetchpriority` 等属性，
 * 并允许通过 `attrs` 进行自定义属性扩展。未显式指定 `position` 时默认注入到 `body-append`。
 *
 * @param script - 脚本配置对象，包含 `src` 与可选属性
 * @returns 返回可用于渲染的标签描述对象
 * @throws {TypeError} 当 `src` 为空字符串时可能导致资源加载失败
 *
 * @example
 * ```ts
 * toScriptTag({ src: '/vendor/analytics.js', async: true })
 * ```
 *
 * @remarks
 * - 若需 `type="module"`，可通过 `type: 'module'` 指定
 * - 通过 `attrs` 可添加任意自定义属性（例如 `data-*`）
 *
 * @security
 * 请确保外部脚本来源可信，必要时使用 `integrity` 与 `crossorigin`
 *
 * @performance
 * 仅进行属性对象拼接，时间复杂度 O(1)
 */
function toScriptTag(script: NonNullable<HtmlVirtualConfig['script']>): HtmlTagDescriptor {
  const baseAttrs: Record<string, string | boolean | number> = { src: script.src }
  if (script.type)
    baseAttrs.type = script.type
  if (script.async)
    baseAttrs.async = true
  if (script.defer)
    baseAttrs.defer = true
  if (script.crossorigin)
    baseAttrs.crossorigin = script.crossorigin
  if (script.integrity)
    baseAttrs.integrity = script.integrity
  if (script.referrerpolicy)
    baseAttrs.referrerpolicy = script.referrerpolicy
  if (script.nonce)
    baseAttrs.nonce = script.nonce
  if (script.fetchpriority)
    baseAttrs.fetchpriority = script.fetchpriority
  return {
    tag: 'script',
    attrs: { ...baseAttrs, ...script.attrs },
    position: script.position ?? 'body-append'
  }
}

/**
 * 将样式配置转换为 HtmlTagDescriptor
 *
 * 基于 `HtmlVirtualConfig.style` 生成外链样式描述，采用 `<link rel="stylesheet" href="...">` 形式；
 * 支持 `media/crossorigin/integrity/referrerpolicy` 等常见属性，并允许通过 `attrs` 扩展。未显式指定 `position` 时默认注入到 `head`。
 *
 * @param style - 样式配置对象，包含 `src` 与可选属性
 * @returns 返回可用于渲染的标签描述对象
 * @throws {TypeError} 当 `src` 为空字符串时可能导致资源加载失败
 *
 * @example
 * ```ts
 * toStyleTag({ src: '/styles/main.css', media: 'screen' })
 * ```
 *
 * @remarks
 * - 采用 `<link rel="stylesheet">` 更符合 HTML 规范与浏览器加载行为
 * - 若需内联样式，可直接通过 `tags` 传入 `{ tag: 'style', children: '...' }`
 *
 * @security
 * 请确保外部样式来源可信，必要时使用 `integrity` 与 `crossorigin`
 *
 * @performance
 * 仅进行属性对象拼接，时间复杂度 O(1)
 */
function toStyleTag(style: NonNullable<HtmlVirtualConfig['style']>): HtmlTagDescriptor {
  const baseAttrs: Record<string, string | boolean | number> = { rel: style.rel ?? 'stylesheet', href: style.src }
  if (style.media)
    baseAttrs.media = style.media
  if (style.crossorigin)
    baseAttrs.crossorigin = style.crossorigin
  if (style.integrity)
    baseAttrs.integrity = style.integrity
  if (style.referrerpolicy)
    baseAttrs.referrerpolicy = style.referrerpolicy
  return {
    tag: 'link',
    attrs: { ...baseAttrs, ...style.attrs },
    selfClosing: true,
    position: style.position ?? 'head'
  }
}

/**
 * 函数：renderHtmlDocument
 *
 * 根据配置对象生成完整的 HTML 文档字符串，包含 head/body 结构与入口脚本。
 *
 * @param cfg - HTML 配置对象
 * @returns 完整 HTML 文本
 *
 * @example
 * ```ts
 * const html = renderHtmlDocument({ title: 'App', entry: '/src/main.ts' })
 * ```
 *
 * @remarks
 * - 默认注入 viewport 与 charset 元信息，可通过 tags 覆盖
 * - 开发与构建阶段均依赖 `<script type="module" src="...">` 作为入口
 */
function renderHtmlDocument(cfg: HtmlVirtualConfig): string {
  const htmlAttrs = renderAttrs(cfg.htmlAttrs)
  const headAttrs = renderAttrs(cfg.headAttrs)
  const bodyAttrs = renderAttrs(cfg.bodyAttrs)

  const title = cfg.title ? `<title>${cfg.title}</title>` : ''
  const hasCharset = (cfg.tags ?? []).some(t => t.tag === 'meta' && (t.attrs as any)?.charset != null)
  const hasViewport = (cfg.tags ?? []).some(t => t.tag === 'meta' && (t.attrs as any)?.name === 'viewport')
  const headPreset = [
    !hasCharset ? renderTag({ tag: 'meta', attrs: { charset: 'utf-8' } }) : '',
    !hasViewport ? renderTag({ tag: 'meta', attrs: { name: 'viewport', content: 'width=device-width, initial-scale=1' } }) : ''
  ].join('')

  const extraHead: HtmlTagDescriptor[] = []
  const extraBodyPrepend: HtmlTagDescriptor[] = []
  const extraBodyAppend: HtmlTagDescriptor[] = []
  if (cfg.style) {
    const s = toStyleTag(cfg.style)
    const pos = s.position ?? 'head'
    if (pos === 'head')
      extraHead.push(s)
    else if (pos === 'body-prepend')
      extraBodyPrepend.push(s)
    else extraBodyAppend.push(s)
  }
  if (cfg.script) {
    const s = toScriptTag(cfg.script)
    const pos = s.position ?? 'body-append'
    if (pos === 'head')
      extraHead.push(s)
    else if (pos === 'body-prepend')
      extraBodyPrepend.push(s)
    else extraBodyAppend.push(s)
  }

  const headTags = [
    ...(cfg.tags ?? []).filter(t => (t.position ?? 'head') === 'head').map(renderTag),
    ...extraHead.map(renderTag)
  ].join('')

  const bodyPrepend = [
    ...(cfg.tags ?? []).filter(t => t.position === 'body-prepend').map(renderTag),
    ...extraBodyPrepend.map(renderTag)
  ].join('')

  const appRootTag = cfg.appRoot?.tag ?? 'div'
  const appRootId = cfg.appRoot?.id ?? 'app'
  const appRoot = `<${appRootTag}${renderAttrs({ id: appRootId, ...cfg.appRoot?.attrs })}></${appRootTag}>`

  const entrySrc = cfg.entry ?? '/src/main.ts'
  const entry = renderTag({ tag: 'script', attrs: { type: 'module', src: entrySrc } })

  const bodyAppend = [
    ...(cfg.tags ?? [])
      // eslint-disable-next-line style/no-mixed-operators
      .filter(t => (t.position === 'body-append') || t.position === undefined && ['script'].includes(t.tag))
      .map(renderTag),
    ...extraBodyAppend.map(renderTag)
  ].join('')

  return `<!DOCTYPE html><html${htmlAttrs}><head${headAttrs}>${title}${headPreset}${headTags}</head><body${bodyAttrs}>${bodyPrepend}${appRoot}${entry}${bodyAppend}</body></html>`
}

/**
 * 函数：resolveHtmlConfig
 *
 * 解析配置文件或内联配置对象，返回 HtmlVirtualConfig。
 *
 * @param root - 项目根目录
 * @param options - 插件选项，包含 config 或 configFile
 * @returns 解析后的配置
 *
 * @throws {Error} 当配置文件格式错误或加载失败时抛出
 */
async function resolveHtmlConfig(root: string, options: HtmlVirtualPluginOptions): Promise<HtmlVirtualConfig> {
  if (options.config)
    return mergeVirtualConfig(DEFAULT_VIRTUAL_HTML_CONFIG, options.config)
  const cfgFile = options.configFile ?? 'html.config.ts'
  const abs = path.isAbsolute(cfgFile) ? cfgFile : path.join(root, cfgFile)
  try {
    await fs.access(abs)
  }
  catch {
    return DEFAULT_VIRTUAL_HTML_CONFIG
  }
  const { config } = await loadConfig<HtmlVirtualConfig>({
    name: 'html',
    cwd: path.dirname(abs),
    configFile: abs,
    rcFile: false,
    dotenv: false,
    packageJson: false,
    globalRc: false
  })
  if (!config || typeof config !== 'object')
    return DEFAULT_VIRTUAL_HTML_CONFIG
  return mergeVirtualConfig(DEFAULT_VIRTUAL_HTML_CONFIG, config)
}

/**
 * 函数：virtualHtmlPlugin
 *
 * 通过配置对象生成根 HTML，实现无需在仓库中维护 index.html；
 * 开发阶段通过中间件返回虚拟 HTML，并调用 Vite 内部 transformIndexHtml；
 * 构建阶段在 .quiteer 目录生成临时 index.html 并设置为 Rollup 输入。
 *
 * @param options - 插件选项，支持内联或文件配置
 * @returns Vite 插件实例
 * @throws {Error} 当配置缺失入口脚本且无法推断时抛出
 *
 * @example
 * ```ts
 * // html.config.ts
 * export default {
 *   title: 'Quiteer App',
 *   entry: '/src/main.ts',
 *   htmlAttrs: { lang: 'zh-CN' },
 *   tags: [
 *     { tag: 'meta', attrs: { name: 'theme-color', content: '#222' } },
 *     { tag: 'link', attrs: { rel: 'icon', href: '/favicon.svg' } }
 *   ],
 *   appRoot: { id: 'app' }
 * }
 * ```
 *
 * @remarks
 * - 若根目录存在 index.html，默认不拦截，可通过 fallbackWhenIndexExists 覆盖
 * - 入口脚本默认 `/src/main.ts`
 *
 * @security
 * - 避免将不受信任的文本直接注入 `children`，必要时进行转义
 */
export function virtualHtmlPlugin(options: HtmlVirtualPluginOptions = {}): Plugin {
  let rootDir: string
  let hasRealIndex = false
  let outDir: string = 'dist'
  let lastHtml: string | null = null
  let activeForBuild = false

  return {
    name: 'quiteer-virtual-html',
    apply: () => true,

    async configResolved(config) {
      rootDir = options.root ?? config.root
      outDir = (config.build?.outDir as string) ?? 'dist'

      try {
        await fs.access(path.join(rootDir, 'index.html'))
        hasRealIndex = true
      }
      catch {
        hasRealIndex = false
      }
    },

    async config(userConfig, env) {
      const localRoot = options.root ?? userConfig?.root ?? process.cwd()
      let realIndexExists = false
      try {
        await fs.access(path.join(localRoot, 'index.html'))
        realIndexExists = true
      }
      catch {}
      if (env?.command !== 'build')
        return
      if (realIndexExists && !options.fallbackWhenIndexExists)
        return
      const cfg = await resolveHtmlConfig(localRoot, options)
      const localTmpIndex = path.join(localRoot, 'node_modules', '.quiteer', 'index.html')
      const html = renderHtmlDocument(cfg)
      await fs.mkdir(path.dirname(localTmpIndex), { recursive: true })
      await fs.writeFile(localTmpIndex, html, 'utf8')
      lastHtml = html
      activeForBuild = true
      return {
        build: {
          rollupOptions: {
            input: { index: localTmpIndex }
          }
        }
      }
    },

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? '/'
        const u = new URL(url, 'http://localhost')
        if (u.pathname !== '/' && u.pathname !== '/index.html')
          return next()
        if (hasRealIndex && !options.fallbackWhenIndexExists)
          return next()
        try {
          const cfg = await resolveHtmlConfig(rootDir, options)
          const html = renderHtmlDocument(cfg)
          const transformed = await server.transformIndexHtml(u.pathname, html)
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(transformed)
          // eslint-disable-next-line no-console
          console.log(`${bold(cyan('[html]'))} 使用虚拟 index.html ${gray(u.pathname)} ${green('OK')}`)
        }
        catch (e) {
          server.config.logger.error(red(`[virtual-html] ${(e as Error).message}`))
          next()
        }
      })
    },
    async closeBundle() {
      if (!activeForBuild)
        return
      const target = path.join(rootDir, outDir, 'index.html')
      await fs.mkdir(path.dirname(target), { recursive: true })
      const nestedTmp = path.join(rootDir, outDir, 'node_modules', '.quiteer')
      const nestedHtml = path.join(nestedTmp, 'index.html')
      try {
        const built = await fs.readFile(nestedHtml, 'utf8')
        await fs.writeFile(target, built, 'utf8')
      }
      catch {
        if (lastHtml)
          await fs.writeFile(target, lastHtml, 'utf8')
      }
      // 清理嵌套临时目录
      try {
        await fs.rm(nestedTmp, { recursive: true, force: true })
      }
      catch {}
      const nestedNM = path.join(rootDir, outDir, 'node_modules')
      try {
        await fs.rm(nestedNM, { recursive: true, force: true })
      }
      catch {}
    }
  }
}

export type { HtmlVirtualPluginOptions as VirtualHtmlOptions }
export type { HtmlVirtualConfig as VirtualHtmlConfig, HtmlTagDescriptor as VirtualHtmlTag }
