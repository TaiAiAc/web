// decoder.browser.ts (运行于浏览器)

const PREFIX = '__ENC__'
const SUFFIX = '__END__'

/**
 * 安全地从 Base64 解码回 UTF-8 字符串（浏览器环境）
 */
function base64ToUtf8(base64: string): string {
  // 使用 TextDecoder 更可靠（现代浏览器支持）
  if (typeof TextDecoder !== 'undefined') {
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
    return new TextDecoder('utf-8').decode(bytes)
  }

  // 回退方案（兼容旧浏览器）
  return decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
      .join('')
  )
}

/**
 * 解码函数：仅当字符串被正确包裹时才解码，否则抛出错误
 */
export function decode(encodedStr: string): string {
  if (!encodedStr.startsWith(PREFIX) || !encodedStr.endsWith(SUFFIX)) {
    throw new Error('Invalid encoded string: missing prefix or suffix')
  }

  const base64 = encodedStr.slice(PREFIX.length, -SUFFIX.length)
  return base64ToUtf8(base64)
}

/**
 * （可选）安全解码：非编码字符串原样返回
 */
export function safeDecode(str: string): string {
  if (str.startsWith(PREFIX) && str.endsWith(SUFFIX)) {
    const base64 = str.slice(PREFIX.length, -SUFFIX.length)
    return base64ToUtf8(base64)
  }
  return str
}
