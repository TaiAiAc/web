/**
 * [复制文本到剪贴板]
 *
 * [优先使用 navigator.clipboard API，如果不可用（如非安全上下文）则降级使用 document.execCommand。
 * 这种双重策略确保了在大多数浏览器环境下的兼容性。]
 *
 * @param text - 要复制的文本内容
 * @returns Promise<boolean> - 是否复制成功
 *
 * @example
 * ```ts
 * const success = await copyText('Hello World')
 * if (success) {
 *   console.log('Copied!')
 * }
 * ```
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    // 尝试使用 Modern API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
    throw new Error('Clipboard API unavailable')
  }
  catch (_error) {
    // 降级方案
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text

      // 确保元素不可见但可选中
      // 使用 fixed 定位移出可视区域，而不是 display: none (无法选中)
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      textarea.style.top = '0'
      textarea.setAttribute('readonly', '')

      document.body.appendChild(textarea)

      textarea.select()
      textarea.setSelectionRange(0, textarea.value.length) // 兼容 iOS

      const successful = document.execCommand('copy')
      document.body.removeChild(textarea)

      return successful
    }
    catch (e) {
      console.error('[Clipboard] Copy failed:', e)
      return false
    }
  }
}

/**
 * [从剪贴板读取文本]
 *
 * [使用 navigator.clipboard.readText 读取剪贴板内容。
 * 注意：通常需要用户显式授权（浏览器弹窗），并且仅在安全上下文（HTTPS/localhost）中可用。
 * Firefox 可能默认不支持通过 API 读取剪贴板。]
 *
 * @returns Promise<string | null> - 读取到的文本，失败或被拒绝返回 null
 *
 * @example
 * ```ts
 * const text = await readText()
 * if (text) {
 *   console.log('Paste:', text)
 * }
 * ```
 */
export async function readText(): Promise<string | null> {
  try {
    if (navigator.clipboard && navigator.clipboard.readText) {
      return await navigator.clipboard.readText()
    }
    console.warn('[Clipboard] Clipboard API unavailable for reading')
    return null
  }
  catch (error) {
    console.error('[Clipboard] Read failed:', error)
    return null
  }
}
