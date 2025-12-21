/**
 * [监听 resize 事件并调整 html 根元素的 fontSize 以适配 rem 等比缩放]
 *
 * [详细说明：该函数通过监听窗口的 resize 和 pageshow 事件，根据当前视口宽度与设计稿宽度的比例，
 * 动态计算并设置 html 根元素的 fontSize。这通常用于实现移动端或大屏的 rem 等比缩放适配策略。
 * 默认基准 fontSize 为 100px，方便计算（例如设计稿宽 1920px，元素宽 100px => 1rem）。]
 *
 * @param designWidth - 设计稿宽度，默认为 1920，必须大于 0
 * @param baseFontSize - 基准字体大小，默认为 100，必须大于 0
 * @param bodyFontSize - body 元素的字体大小，默认为 16，必须大于等于 0。如果不重置，body 会继承 html 的 baseFontSize (如 100px)，导致未设置字体的元素文字巨大。
 * @returns 返回一个清理函数，用于移除事件监听器
 * @throws {Error} 当 designWidth 或 baseFontSize 小于等于 0 时抛出异常
 *
 * @example
 * ```ts
 * import { setupRem } from '@quiteer/utils'
 *
 * // 使用默认配置 (设计稿 1920px, 基准 100px, body 16px)
 * const cleanup = setupRem()
 *
 * // 自定义配置 (设计稿 750px, 基准 16px, body 不重置设为 0 或其他)
 * setupRem(750, 16, 14)
 *
 * // 在 Vue 组件卸载时清理
 * onUnmounted(() => {
 *   cleanup()
 * })
 * ```
 *
 * @remarks
 * - 使用 requestAnimationFrame 优化 resize 事件的触发频率，避免高频重排
 * - 监听 pageshow 事件以处理浏览器后退缓存 (bfcache) 的情况
 * - 会自动重置 body 的 fontSize 为 bodyFontSize，防止继承 html 的大号字体
 *
 * @security
 * 无特殊安全隐患，仅操作 DOM 样式
 *
 * @performance
 * - 时间复杂度 O(1)
 * - 空间复杂度 O(1)
 * - Resize 事件触发频繁，使用 RAF 减少计算开销
 */
export function setupRem(
  designWidth: number = 1920,
  baseFontSize: number = 100,
  bodyFontSize: number = 16
): () => void {
  if (designWidth <= 0) {
    throw new Error('designWidth must be greater than 0')
  }
  if (baseFontSize <= 0) {
    throw new Error('baseFontSize must be greater than 0')
  }
  if (bodyFontSize < 0) {
    throw new Error('bodyFontSize must be greater than or equal to 0')
  }

  const docEl = document.documentElement
  let rafId: number | null = null

  function setBodyFontSize() {
    if (document.body) {
      document.body.style.fontSize = `${bodyFontSize}px`
    }
    else {
      document.addEventListener('DOMContentLoaded', setBodyFontSize)
    }
  }

  function setRem() {
    const clientWidth = docEl.clientWidth
    if (!clientWidth)
      return

    // 计算新的 fontSize
    // 当前宽度 / 设计稿宽度 * 基准字体大小
    const fontSize = (clientWidth / designWidth) * baseFontSize

    docEl.style.fontSize = `${fontSize}px`
  }

  function handleResize() {
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
    rafId = requestAnimationFrame(() => {
      setRem()
      rafId = null
    })
  }

  function handlePageShow(e: PageTransitionEvent) {
    if (e.persisted) {
      handleResize()
    }
  }

  // 初始化执行
  setRem()
  setBodyFontSize()

  // 添加监听
  window.addEventListener('resize', handleResize)
  window.addEventListener('pageshow', handlePageShow)

  // 返回清理函数
  return () => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('pageshow', handlePageShow)
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
  }
}
