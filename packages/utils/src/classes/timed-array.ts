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

  /**
   * 构造定时数组
   *
   * 创建一个支持固定间隔 push/pop 与随机间隔 push 的数组管理器。
   *
   * @param options - 配置项；`randomPushValue` 必须为函数
   * @returns 无返回值
   * @throws {TypeError} 当 `randomPushValue` 不是函数时抛出异常
   *
   * @example
   * ```ts
   * const ta = new TimedArray<number>({
   *   fixedPushValue: 0,
   *   enableFixedPop: true,
   *   randomPushValue: () => Math.random(),
   * })
   * ```
   *
   * @remarks
   * - `fixedInterval` 默认 1000ms；`randomIntervalRange` 默认 [500, 2000]
   *
   * @security
   * - 随机任务可能在后台持续运行，请在组件卸载时调用 `destroy()`
   */
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
   *
   * 启动固定间隔 push/pop 与随机间隔 push 任务；若已启动会先调用 `stop()` 防止重复计时器。
   *
   *
   * @example
   * ```ts
   * ta.start()
   * ```
   *
   * @remarks
   * - 当 `enableFixedPop` 为真且数组非空，固定计时器会执行 pop；否则当 `fixedPushValue` 设置时执行 push
   *
   * @performance
   * - 启动本身 O(1)；计时器在后台运行，回调成本与数组大小相关
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
   *
   * 使用 `[min,max]` 范围生成随机延迟并在到期时执行一次 push；随后递归安排下一次。
   *
   *
   * @performance
   * - 每次调度 O(1)
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
   *
   * 清理固定与随机计时器，停止后台任务。
   *
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
   * 获取当前数组
   *
   * 返回内部数组的浅拷贝以避免外部修改原始数据。
   *
   * @returns 数组副本
   */
  getArray(): T[] {
    return [...this.array]
  }

  /**
   * 清空数组
   *
   * 清空当前数组内容，不影响计时器状态。
   *
   */
  clear(): void {
    this.array = []
  }

  /**
   * 手动 push 元素
   *
   * 向数组尾部插入一个元素，不影响计时器任务。
   *
   * @param value - 要插入的元素
   */
  push(value: T): void {
    this.array.push(value)
  }

  /**
   * 手动 pop 元素
   *
   * 从数组尾部移除一个元素并返回该元素；若数组为空返回 `undefined`。
   *
   * @returns 被移除的元素或 `undefined`
   */
  pop(): T | undefined {
    return this.array.pop()
  }

  /** 回调：固定 push/pop 与随机 push 的事件钩子 */
  onPush?: (value: T) => void
  onPop?: () => void
  onRandomPush?: (value: T) => void

  /**
   * 销毁实例
   *
   * 停止计时器并清空内部数组；推荐在组件卸载时调用以释放资源。
   *
   */
  destroy(): void {
    this.stop()
    this.array = []
  }
}
