import { isString } from './type'

function tryParseUrl(str: string): URL | null {
  try {
    return new URL(str)
  }
  catch {
    return null
  }
}

function getPathname(input: string): string {
  const u = tryParseUrl(input)
  const p = u ? u.pathname : input
  return p.split(/[?#]/)[0]
}

/**
 * 判断是否是 URL 字符串
 * - 使用 `new URL` 安全解析，支持 http/https/ws/wss/file 等协议
 */
export function isUrlString(val: unknown): val is string {
  if (!isString(val))
    return false
  return tryParseUrl(val) !== null
}

/**
 * 判断是否是 http 链接
 * - 协议为 `http:`
 */
export function isHttpUrl(val: unknown): val is string {
  if (!isString(val))
    return false
  const u = tryParseUrl(val)
  return !!u && u.protocol === 'http:'
}

/**
 * 判断是否是 https 链接
 * - 协议为 `https:`
 */
export function isHttpsUrl(val: unknown): val is string {
  if (!isString(val))
    return false
  const u = tryParseUrl(val)
  return !!u && u.protocol === 'https:'
}

/**
 * 判断是否是 websocket 链接
 * - 支持 `ws:` 与 `wss:`
 */
export function isWebsocketUrl(val: unknown): val is string {
  if (!isString(val))
    return false
  const u = tryParseUrl(val)
  return !!u && (u.protocol === 'ws:' || u.protocol === 'wss:')
}

/**
 * 判断是否是图片链接
 * - 根据路径后缀判断：png、jpg、jpeg、gif、webp、bmp、svg
 * - 支持带查询参数或哈希的地址
 */
export function isImageUrl(val: unknown): boolean {
  if (!isString(val))
    return false
  const path = getPathname(val).toLowerCase()
  return /\.(?:png|jpg|jpeg|gif|webp|bmp|svg)$/.test(path)
}

/**
 * 判断是否是视频链接
 * - 常见后缀：mp4、webm、ogg、mov、m3u8
 */
export function isVideoUrl(val: unknown): boolean {
  if (!isString(val))
    return false
  const path = getPathname(val).toLowerCase()
  return /\.(?:mp4|webm|ogg|mov|m3u8)$/.test(path)
}

/**
 * 判断是否是文件链接
 * - file 协议或常见可下载文件后缀（pdf、docx、xlsx、csv、txt、zip 等）
 */
export function isFileUrl(val: unknown): boolean {
  if (!isString(val))
    return false
  const u = tryParseUrl(val)
  if (u && u.protocol === 'file:')
    return true
  const path = getPathname(val).toLowerCase()
  return /\.(?:pdf|doc|docx|xls|xlsx|ppt|pptx|csv|txt|zip|rar|7z|tar|gz|bz2|apk|dmg|exe)$/.test(path)
}
