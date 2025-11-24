interface TimedArrayOptions<T> {
  /** 固定间隔 push 的值（可为函数，每次调用生成新值） */
  fixedPushValue?: T | undefined
  /** 固定间隔 pop（true 表示启用） */
  enableFixedPop?: boolean
  /** 固定操作的时间间隔（毫秒） */
  fixedInterval?: number
  /** 随机添加的时间范围 [min, max]（毫秒） */
  randomIntervalRange?: [number, number]
  /** 随机添加的值（必须为函数） */
  randomPushValue: () => T
}

export class TimedArray<T> {
  private array: T[] = []
  private fixedTimer: ReturnType<typeof setInterval> | null = null
  private randomTimer: ReturnType<typeof setTimeout> | null = null
  private readonly options: Required<TimedArrayOptions<T>>

  constructor(options: TimedArrayOptions<T>) {
    // 设置默认值
    this.options = {
      fixedPushValue: undefined as unknown as T,
      enableFixedPop: false,
      fixedInterval: 1000,
      randomIntervalRange: [500, 2000],
      ...options
    }

    if (typeof this.options.randomPushValue !== 'function') {
      throw new TypeError('randomPushValue must be a function')
    }
  }

  /**
   * 启动定时任务
   */
  start(): void {
    this.stop() // 确保不会重复启动

    // 启动固定间隔任务（push 或 pop）
    if (this.options.fixedPushValue !== undefined || this.options.enableFixedPop) {
      this.fixedTimer = setInterval(() => {
        if (this.options.enableFixedPop && this.array.length > 0) {
          this.array.pop()
          this.onPop?.()
        }
        else if (this.options.fixedPushValue !== undefined) {
          const value = typeof this.options.fixedPushValue === 'function'
            ? this.options.fixedPushValue()
            : this.options.fixedPushValue
          this.array.push(value)
          this.onPush?.(value)
        }
      }, this.options.fixedInterval)
    }

    // 启动随机间隔任务
    this.scheduleRandomPush()
  }

  /**
   * 安排下一次随机 push
   */
  private scheduleRandomPush(): void {
    if (!this.randomTimer) {
      const [min, max] = this.options.randomIntervalRange
      const delay = Math.floor(Math.random() * (max - min + 1)) + min
      this.randomTimer = setTimeout(() => {
        const value = this.options.randomPushValue()
        this.array.push(value)
        this.onRandomPush?.(value)
        this.randomTimer = null
        this.scheduleRandomPush() // 递归安排下一次
      }, delay)
    }
  }

  /**
   * 停止所有定时任务
   */
  stop(): void {
    if (this.fixedTimer) {
      clearInterval(this.fixedTimer)
      this.fixedTimer = null
    }
    if (this.randomTimer) {
      clearTimeout(this.randomTimer)
      this.randomTimer = null
    }
  }

  /**
   * 获取当前数组（返回副本，防止外部修改）
   */
  getArray(): T[] {
    return [...this.array]
  }

  /**
   * 清空数组
   */
  clear(): void {
    this.array = []
  }

  /**
   * 手动 push 元素（不影响定时任务）
   */
  push(value: T): void {
    this.array.push(value)
  }

  /**
   * 手动 pop 元素
   */
  pop(): T | undefined {
    return this.array.pop()
  }

  /**
   * 回调：可在外部设置
   */
  onPush?: (value: T) => void
  onPop?: () => void
  onRandomPush?: (value: T) => void

  /**
   * 销毁实例（推荐在组件卸载时调用）
   */
  destroy(): void {
    this.stop()
    this.array = []
  }
}
