/**
 * WebSocket 客户端配置接口
 */
export interface WebSocketOptions {
  /** 子协议 */
  protocols?: string | string[]
  /** 自动连接，默认为 true */
  autoConnect?: boolean
  /** 心跳配置 */
  heartbeat?: {
    /** 心跳间隔 (ms)，默认 30000 */
    interval?: number
    /** 心跳消息内容，默认 'ping' */
    message?: string | object
    /** 响应超时时间 (ms)，默认 10000。如果在此时间内未收到任何消息，视为连接断开 */
    timeout?: number
  }
  /** 重连配置 */
  reconnect?: {
    /** 重连间隔 (ms)，默认 3000 */
    interval?: number
    /** 最大重连次数，默认 5。-1 表示无限重连 */
    maxAttempts?: number
  }
}

/**
 * WebSocket 事件类型
 */
export type WebSocketEventType = 'open' | 'message' | 'close' | 'error' | 'reconnect'

/**
 * [WebSocket 客户端封装]
 *
 * [基于原生 WebSocket 封装，增加了自动重连、心跳检测、事件订阅等功能。
 * 旨在解决网络波动导致的连接中断问题，保持长连接的稳定性。]
 *
 * @example
 * ```ts
 * const ws = new WebSocketClient('ws://echo.websocket.org', {
 *   heartbeat: {
 *     interval: 5000,
 *     message: 'ping'
 *   }
 * })
 *
 * ws.on('open', () => console.log('Connected'))
 * ws.on('message', (msg) => console.log('Received:', msg))
 * ws.connect()
 * ```
 *
 * @remarks
 * - 实现了指数退避重连策略（可选，当前为固定间隔）
 * - 心跳检测机制：定时发送心跳，并监测响应超时
 * - 自动处理序列化，支持发送 JSON 对象
 *
 * @security
 * - 仅在浏览器环境中使用
 * - 建议使用 wss:// 协议以确保传输安全
 */
export class WebSocketClient {
  private url: string
  private options: WebSocketOptions
  private ws: WebSocket | null = null
  private handlers: Map<WebSocketEventType, Set<(...args: any[]) => void>> = new Map()

  private shouldReconnect = true
  private reconnectAttempts = 0
  private reconnectTimer: number | null = null

  private heartbeatTimer: number | null = null
  private heartbeatTimeoutTimer: number | null = null

  constructor(url: string, options: WebSocketOptions = {}) {
    this.url = url
    this.options = {
      protocols: [],
      autoConnect: true,
      ...options,
      heartbeat: {
        interval: 30000,
        message: 'ping',
        timeout: 10000,
        ...options.heartbeat
      },
      reconnect: {
        interval: 3000,
        maxAttempts: 5,
        ...options.reconnect
      }
    }

    if (this.options.autoConnect) {
      this.connect()
    }
  }

  /**
   * 建立连接
   */
  connect(): void {
    if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
      return
    }

    this.shouldReconnect = true
    try {
      this.ws = new WebSocket(this.url, this.options.protocols)
      this.initEvents()
    }
    catch (error) {
      this.handleError(error as Event)
      this.handleReconnect()
    }
  }

  /**
   * 发送消息
   * @param data - 消息内容，支持字符串或对象
   */
  send(data: any): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('[WebSocketClient] Cannot send message, socket is not open.')
      return
    }

    const message = typeof data === 'string' ? data : JSON.stringify(data)
    this.ws.send(message)
  }

  /**
   * 关闭连接
   */
  close(): void {
    this.shouldReconnect = false
    this.stopHeartbeat()
    this.stopReconnect()

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  /**
   * 订阅事件
   */
  on(event: WebSocketEventType, handler: (...args: any[]) => void): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set())
    }
    this.handlers.get(event)!.add(handler)

    return () => this.off(event, handler)
  }

  /**
   * 取消订阅
   */
  off(event: WebSocketEventType, handler?: (...args: any[]) => void): void {
    if (!handler) {
      this.handlers.delete(event)
    }
    else {
      this.handlers.get(event)?.delete(handler)
    }
  }

  private initEvents() {
    if (!this.ws)
      return

    this.ws.onopen = (event) => {
      this.reconnectAttempts = 0
      this.startHeartbeat()
      this.emit('open', event)
    }

    this.ws.onmessage = (event) => {
      // 收到任何消息都视为心跳响应，重置超时检测
      this.resetHeartbeatTimeout()

      let data = event.data
      try {
        data = JSON.parse(data)
      }
      catch {
        // Ignore parse error, return raw string
      }
      this.emit('message', data, event)
    }

    this.ws.onclose = (event) => {
      this.stopHeartbeat()
      this.emit('close', event)
      this.handleReconnect()
    }

    this.ws.onerror = (event) => {
      this.emit('error', event)
    }
  }

  private emit(event: WebSocketEventType, ...args: any[]) {
    this.handlers.get(event)?.forEach((handler) => {
      try {
        handler(...args)
      }
      catch (error) {
        console.error(`[WebSocketClient] Error in ${event} handler:`, error)
      }
    })
  }

  // --- 心跳机制 ---

  private startHeartbeat() {
    this.stopHeartbeat()
    const { interval } = this.options.heartbeat!

    this.heartbeatTimer = window.setInterval(() => {
      this.sendPing()
    }, interval)
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer)
      this.heartbeatTimeoutTimer = null
    }
  }

  private sendPing() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.send(this.options.heartbeat!.message)

      // 发送 ping 后，如果在 timeout 时间内没收到任何消息，认为连接假死
      this.heartbeatTimeoutTimer = window.setTimeout(() => {
        console.warn('[WebSocketClient] Heartbeat timeout, reconnecting...')
        this.ws?.close() // 触发 onclose 从而重连
      }, this.options.heartbeat!.timeout)
    }
  }

  private resetHeartbeatTimeout() {
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer)
      this.heartbeatTimeoutTimer = null
    }
  }

  // --- 重连机制 ---

  private handleReconnect() {
    if (!this.shouldReconnect)
      return

    const { maxAttempts, interval } = this.options.reconnect!

    if (maxAttempts !== -1 && this.reconnectAttempts >= maxAttempts!) {
      console.warn('[WebSocketClient] Max reconnect attempts reached.')
      this.emit('reconnect', { status: 'failed' })
      return
    }

    this.reconnectAttempts++
    this.emit('reconnect', { status: 'attempting', attempt: this.reconnectAttempts })

    this.stopReconnect()
    this.reconnectTimer = window.setTimeout(() => {
      this.connect()
    }, interval)
  }

  private handleError(_error: Event) {
    // 错误处理通常由 onerror 触发，这里主要用于辅助逻辑
  }

  private stopReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }
}
