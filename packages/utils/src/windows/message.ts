/**
 * [父子窗口通信类]
 *
 * [基于 window.postMessage 的封装，实现了简单的发布订阅模式，
 * 支持父子窗口（iframe 或 window.open）之间的双向通信。
 * 提供了类型安全的消息发送和监听机制。]
 *
 * @example
 * ```ts
 * // 父窗口
 * const messenger = new WindowMessenger({
 *   target: iframe.contentWindow,
 *   origin: 'http://child-domain.com' // 可选，为了安全建议指定
 * })
 *
 * messenger.on('child-ready', (data) => {
 *   console.log('Child said:', data)
 *   messenger.send('parent-reply', { msg: 'Hello Child' })
 * })
 *
 * // 子窗口
 * const messenger = new WindowMessenger({
 *   target: window.parent
 * })
 *
 * messenger.send('child-ready', { status: 'ok' })
 * ```
 */
export class WindowMessenger {
  private target: Window
  private origin: string
  private handlers: Map<string, Set<(payload: any) => void>>
  private handleMessageBound: (event: MessageEvent) => void

  /**
   * @param options - 配置项
   * @param options.target - 目标窗口，默认为 window.parent
   * @param options.origin - 目标源，默认为 '*' (允许任何源)，建议指定具体源以增强安全性
   */
  constructor(options: { target?: Window, origin?: string } = {}) {
    this.target = options.target || window.parent
    this.origin = options.origin || '*'
    this.handlers = new Map()

    this.handleMessageBound = this.handleMessage.bind(this)
    window.addEventListener('message', this.handleMessageBound)
  }

  /**
   * 发送消息
   * @param type - 消息类型
   * @param payload - 消息数据
   */
  send<T = any>(type: string, payload?: T): void {
    if (!this.target)
      return

    const message = {
      type,
      payload
    }

    this.target.postMessage(message, this.origin)
  }

  /**
   * 监听消息
   * @param type - 消息类型
   * @param handler - 处理函数
   * @returns 返回移除监听的函数
   */
  on<T = any>(type: string, handler: (payload: T) => void): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set())
    }

    const handlers = this.handlers.get(type)!
    handlers.add(handler)

    return () => this.off(type, handler)
  }

  /**
   * 移除消息监听
   * @param type - 消息类型
   * @param handler - 处理函数。如果不传，则移除该类型的所有监听
   */
  off(type: string, handler?: (payload: any) => void): void {
    const handlers = this.handlers.get(type)
    if (!handlers)
      return

    if (handler) {
      handlers.delete(handler)
    }
    else {
      handlers.clear()
    }
  }

  /**
   * 销毁实例，移除所有事件监听
   */
  destroy(): void {
    window.removeEventListener('message', this.handleMessageBound)
    this.handlers.clear()
  }

  private handleMessage(event: MessageEvent): void {
    // 安全检查：如果指定了 origin 且不匹配，则忽略
    if (this.origin !== '*' && event.origin !== this.origin) {
      return
    }

    const data = event.data
    // 简单的格式校验
    if (!data || typeof data !== 'object' || !data.type) {
      return
    }

    const handlers = this.handlers.get(data.type)
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data.payload)
        }
        catch (error) {
          console.error(`[WindowMessenger] Error in handler for type "${data.type}":`, error)
        }
      })
    }
  }
}
