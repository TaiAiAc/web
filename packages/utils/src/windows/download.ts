/**
 * 下载配置项
 */
export interface DownloadOptions {
  /** 指定下载后的文件名 */
  fileName?: string
  /**
   * 下载目标类型
   * - 'href': 默认方式，创建 a 标签下载。适用于同源文件或后端已配置 Content-Disposition 的文件。
   * - 'blob': 通过 fetch 请求获取 blob 后下载。适用于需要前端强制重命名或处理跨域图片/PDF 预览而非下载的情况。
   */
  target?: 'href' | 'blob'
}

/**
 * [通过 Blob 对象下载文件]
 *
 * [利用 URL.createObjectURL 生成临时链接并触发下载，
 * 下载完成后自动释放 URL 对象以防内存泄漏。]
 *
 * @param blob - Blob 对象
 * @param fileName - 文件名
 */
export function downloadByBlob(blob: Blob, fileName: string): void {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', fileName)

  if (typeof link.download === 'undefined') {
    link.setAttribute('target', '_blank')
  }

  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * [通过 Base64 字符串下载文件]
 *
 * [将 Base64 转换为 Blob 后下载]
 *
 * @param buf - Base64 字符串 (包含或不包含 data:image/png;base64, 前缀均可)
 * @param fileName - 文件名
 * @param mimeType - MIME 类型 (如果 base64 中不包含，则需指定)
 */
export function downloadByBase64(buf: string, fileName: string, mimeType?: string): void {
  const base64Buf = buf.split(',').pop() ?? ''

  // 如果未提供 mimeType，尝试从 base64 前缀获取
  if (!mimeType && buf.includes('data:')) {
    mimeType = buf.split(',')[0].split(':')[1].split(';')[0]
  }

  const bstr = window.atob(base64Buf)
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  const blob = new Blob([u8arr], { type: mimeType || 'application/octet-stream' })
  downloadByBlob(blob, fileName)
}

/**
 * [通过链接下载文件]
 *
 * [支持普通链接下载和 Blob 下载两种模式。
 * 普通链接下载依赖浏览器原生行为，可能受跨域策略影响导致重命名失效或直接在浏览器预览。
 * Blob 下载通过 fetch 请求资源，可以完美支持重命名和强制下载，但受限于 CORS 策略。]
 *
 * @param url - 文件链接
 * @param options - 配置项，可传入文件名字符串或配置对象
 * @returns Promise<boolean> 下载是否成功 (仅 blob 模式返回 true/false，href 模式始终返回 true)
 *
 * @example
 * ```ts
 * // 1. 简单下载 (尝试使用浏览器默认行为)
 * downloadByUrl('https://example.com/file.pdf')
 *
 * // 2. 指定文件名 (同源下生效)
 * downloadByUrl('https://example.com/file.pdf', 'report.pdf')
 *
 * // 3. 强制下载并重命名 (推荐跨域图片或 PDF 使用)
 * await downloadByUrl('https://example.com/image.png', {
 *   fileName: 'avatar.png',
 *   target: 'blob'
 * })
 * ```
 */
export async function downloadByUrl(
  url: string,
  options?: string | DownloadOptions
): Promise<boolean> {
  const opts: DownloadOptions = typeof options === 'string'
    ? { fileName: options }
    : (options || {})

  const { fileName, target = 'href' } = opts

  if (target === 'blob') {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      downloadByBlob(blob, fileName || url.substring(url.lastIndexOf('/') + 1))
      return true
    }
    catch (error) {
      console.error('[Download] Failed to download by blob:', error)
      return false
    }
  }
  else {
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url

    // 如果有文件名，尝试设置 download 属性
    // 注意：跨域资源如果不设置 CORS headers，download 属性可能会被浏览器忽略
    if (fileName) {
      link.setAttribute('download', fileName)
    }
    else {
      link.setAttribute('download', '')
    }

    link.target = '_blank'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    return true
  }
}
