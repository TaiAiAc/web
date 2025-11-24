interface HistoryEntry<T> {
  value: T
  timestamp: number // Date.now()
}

export class HistoryManager<T> {
  private history: HistoryEntry<T>[] = []
  private currentIndex = -1 // 指向当前状态（最新值）
  private readonly maxHistorySize: number

  constructor(maxSize = 10) {
    if (maxSize <= 0)
      throw new Error('maxSize must be > 0')
    this.maxHistorySize = maxSize
  }

  /**
   * 记录一个新的值（入栈）
   * 如果当前不在历史末尾（比如刚 undo 过），则截断后续历史
   */
  record(value: T): void {
    const now = Date.now()

    // 如果有未来历史（undo 后再操作），丢弃它
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1)
    }

    // 添加新记录
    this.history.push({ value, timestamp: now })
    this.currentIndex++

    // 控制内存：超出最大长度时，从头部移除旧记录
    if (this.history.length > this.maxHistorySize) {
      const removeCount = this.history.length - this.maxHistorySize
      this.history = this.history.slice(removeCount)
      this.currentIndex -= removeCount
    }
  }

  /**
   * 撤回 n 步（默认 1 步）
   * @returns 撤回后的值，若无法撤回则返回 undefined
   */
  undo(steps = 1): T | undefined {
    if (steps <= 0)
      return this.getCurrentValue()
    if (this.currentIndex < 0)
      return undefined

    const targetIndex = Math.max(this.currentIndex - steps, -1)
    this.currentIndex = targetIndex

    return this.getCurrentValue()
  }

  /**
   * 获取当前值（考虑 undo 后的状态）
   */
  getCurrentValue(): T | undefined {
    if (this.currentIndex === -1 || this.history.length === 0) {
      return undefined
    }
    return this.history[this.currentIndex].value
  }

  /**
   * 获取当前时间戳
   */
  getCurrentTimestamp(): number | undefined {
    if (this.currentIndex === -1 || this.history.length === 0) {
      return undefined
    }
    return this.history[this.currentIndex].timestamp
  }

  /**
   * 是否还能撤回
   */
  canUndo(): boolean {
    return this.currentIndex > 0
  }

  /**
   * 历史记录总条数（不包括“未来”）
   */
  historySize(): number {
    return this.currentIndex + 1
  }

  /**
   * 获取完整历史（用于调试或导出）
   */
  getFullHistory(): HistoryEntry<T>[] {
    return this.history.slice(0, this.currentIndex + 1)
  }

  /**
   * 清空历史
   */
  clear(): void {
    this.history = []
    this.currentIndex = -1
  }
}
