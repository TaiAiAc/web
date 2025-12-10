/**
 * 还原 Base64 混淆值
 *
 * 还原由环境变量混淆（Base64）产生的字符串，默认按 UTF-8 解码。
 *
 * @param v - Base64 字符串（由 `obfuscate` 或字段级 `obfuscate: true` 产生）
 * @returns 还原后的普通字符串（UTF-8）
 * @throws {TypeError} 当入参不是字符串或格式非法时抛出
 *
 * @example
 * ```ts
 * import { decodeBase64Env } from '@quiteer/vite-plugins'
 * decodeBase64Env('aHR0cHM6Ly9hcGkuZXhhbXBsZS5jb20=') // 'https://api.example.com'
 * ```
 *
 * @remarks
 * - 浏览器环境优先使用 `atob`，并尝试通过 `TextDecoder('utf-8')`进行字节到字符串的解码
 * - 若浏览器缺失 `TextDecoder`，将回退为直接使用 `atob` 的结果（可能不适配非 ASCII 字符）
 *
 * @security
 * - 混淆仅用于弱化直观可读性，非加密；请勿用于机密信息
 *
 * @performance
 * - O(n) 字节处理；适用于前端运行态的轻量解码
 */
export function decodeBase64Env(v: string): string {
  if (typeof v !== 'string')
    throw new TypeError('invalid base64 value')

  // 浏览器环境优先使用 atob + TextDecoder
  if (typeof globalThis !== 'undefined' && typeof (globalThis as any).atob === 'function') {
    const bin: string = (globalThis as any).atob(v)
    try {
      const bytes = new Uint8Array(bin.length)
      for (let i = 0; i < bin.length; i++)
        bytes[i] = bin.charCodeAt(i)
      if (typeof (globalThis as any).TextDecoder === 'function')
        return new (globalThis as any).TextDecoder('utf-8').decode(bytes)
      return bin
    }
    catch {
      return bin
    }
  }

  return ''
}
