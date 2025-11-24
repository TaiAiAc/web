interface HistoryEntry<T> {
  value: T
  timestamp: number // Date.now()
}

export class HistoryManager<T> {
  private history: HistoryEntry<T>[] = []
  private currentIndex = -1 // 指向当前状态（最新值）
  private readonly maxHistorySize: number

  /**
   * 构造历史管理器
   *
   * 初始化一个具有固定最大历史长度的管理器，用于记录值变化并支持撤回（undo）。
   *
   * @param maxSize - 历史最大条目数，必须大于 0；超过时将从头部移除旧记录
   * @returns 无返回值
   * @throws {Error} 当 `maxSize <= 0` 时抛出异常
   *
   * @example
   * ```ts
   * const hm = new HistoryManager<string>(20)
   * ```
   *
   * @remarks
   * - 较大的 `maxSize` 会增加内存占用
   *
   * @security
   * - 存储的是值本身或其引用，请避免将敏感可变对象直接写入历史
   *
   * @performance
   * - 构造成本 O(1)
   */
  constructor(maxSize = 10) {
    if (maxSize <= 0)
      throw new Error('maxSize must be > 0')
    this.maxHistorySize = maxSize
  }

  /**
   * 记录一个新的值（入栈）
   *
   * 将新值记录到历史末尾；若当前处于历史中间（刚执行过 `undo`），会截断后续“未来”记录。
   * 当历史长度超过 `maxSize` 时，自动从头部移除旧记录以控制内存。
   *
   * @param value - 需要记录的值
   *
   * @example
   * ```ts
   * hm.record('v1'); hm.record('v2')
   * hm.getCurrentValue() // 'v2'
   * ```
   *
   * @remarks
   * - 记录行为不可逆；被丢弃的“未来”记录无法恢复
   *
   * @performance
   * - 平均 O(1)，当需要剪裁历史时会发生 O(n) 的切片
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
   * 撤回 n 步
   *
   * 将当前指针向前移动 `steps` 步（默认 1），返回撤回后的当前值；若无法撤回则返回 `undefined`。
   *
   * @param steps - 撤回步数，必须为非负整数；`steps<=0` 时返回当前值
   * @returns 撤回后的当前值或 `undefined`
   *
   * @example
   * ```ts
   * hm.undo() // 撤回一步
   * hm.undo(2) // 撤回两步
   * ```
   *
   * @remarks
   * - 撤回不会删除历史，只调整当前指针
   *
   * @performance
   * - O(1)
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
   * 获取当前值
   *
   * 返回当前指针所指的值；若没有历史或指针为初始态，则返回 `undefined`。
   *
   * @returns 当前值或 `undefined`
   *
   * @performance
   * - O(1)
   */
  getCurrentValue(): T | undefined {
    if (this.currentIndex === -1 || this.history.length === 0) {
      return undefined
    }
    return this.history[this.currentIndex].value
  }

  /**
   * 获取当前时间戳
   *
   * 返回当前值对应的记录时间戳；若没有历史或指针为初始态，则返回 `undefined`。
   *
   * @returns 当前时间戳或 `undefined`
   *
   * @performance
   * - O(1)
   */
  getCurrentTimestamp(): number | undefined {
    if (this.currentIndex === -1 || this.history.length === 0) {
      return undefined
    }
    return this.history[this.currentIndex].timestamp
  }

  /**
   * 是否还能撤回
   *
   * 判断是否存在可撤回的历史（当前指针是否大于 0）。
   *
   * @returns 可撤回返回 `true`，否则 `false`
   */
  canUndo(): boolean {
    return this.currentIndex > 0
  }

  /**
   * 历史记录总条数
   *
   * 返回真实历史长度（不包括被丢弃的“未来”部分）。
   *
   * @returns 历史条数（非负整数）
   */
  historySize(): number {
    return this.currentIndex + 1
  }

  /**
   * 获取完整历史
   *
   * 返回从头到当前指针的历史副本，用于调试或导出。
   *
   * @returns 历史条目数组的副本
   *
   * @performance
   * - O(n)
   */
  getFullHistory(): HistoryEntry<T>[] {
    return this.history.slice(0, this.currentIndex + 1)
  }

  /**
   * 清空历史
   *
   * 清空所有历史记录并重置当前指针。
   *
   *
   * @performance
   * - O(n)（清空数组引用重建，与旧数组大小相关）
   */
  clear(): void {
    this.history = []
    this.currentIndex = -1
  }
}
