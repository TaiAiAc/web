/**
 * 防抖（debounce）
 *
 * 在指定等待时间窗口内合并多次调用，仅执行最后一次；支持 `immediate` 选项在首次调用时立即执行。
 *
 * @param fn - 需要防抖的函数
 * @param wait - 等待时间窗口（毫秒）；默认 300ms
 * @param immediate - 是否在首次触发时立即执行一次；默认 `false`
 * @returns 包装后的函数，附带 `cancel()` 方法用于取消挂起的调用
 *
 * @example
 * ```ts
 * const onInput = debounce((v: string) => fetch(v), 300)
 * onInput('a'); onInput('ab'); onInput('abc') // 仅最后一次触发执行
 * onInput.cancel() // 取消挂起的执行
 * ```
 *
 * @remarks
 * - 包装函数的 `this` 与参数将透传给原始函数
 * - 当 `immediate=true` 时，首次调用会执行，之后需等待 `wait` 时间窗口结束
 *
 * @performance
 * 时间复杂度 O(1) 每次调用；空间复杂度 O(1)
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, wait = 300, immediate = false) {
  let timer: any = null
  let invoked = false
  const debounced = function (this: any, ...args: Parameters<T>) {
    if (timer)
      clearTimeout(timer)
    if (immediate && !invoked) {
      invoked = true
      fn.apply(this, args)
    }
    else {
      timer = setTimeout(() => {
        fn.apply(this, args)
        invoked = false
      }, wait)
    }
  }
  ;(debounced as any).cancel = () => {
    if (timer) {
      clearTimeout(timer)
      invoked = false
    }
  }
  return debounced as T & { cancel: () => void }
}

/**
 * 节流（throttle）
 *
 * 在时间窗口内最多执行一次；支持 `leading`/`trailing` 控制首/尾触发行为。
 *
 * @param fn - 需要节流的函数
 * @param wait - 时间窗口（毫秒）；默认 300ms
 * @param leading - 是否允许窗口开始时触发；默认 `true`
 * @param trailing - 是否允许窗口结束时触发；默认 `true`
 * @returns 包装后的函数
 *
 * @example
 * ```ts
 * const onScroll = throttle(() => console.info('tick'), 100)
 * ```
 *
 * @remarks
 * - 包装函数的 `this` 与参数将透传给原始函数
 * - 当 `leading=false` 时首次调用不会触发，直到窗口结束
 *
 * @performance
 * 时间复杂度 O(1) 每次调用；空间复杂度 O(1)
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, wait = 300, leading = true, trailing = true) {
  let timer: any = null
  let lastCall = 0
  let lastArgs: any[] | null = null
  let lastThis: any = null

  const invoke = (self: any, args: any[]) => {
    fn.apply(self, args)
    lastCall = Date.now()
  }

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now()
    const remaining = wait - (now - lastCall)
    if (remaining <= 0 || remaining > wait) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      if (leading || lastCall > 0)
        invoke(this, args)
      else lastCall = now
    }
    else if (!timer && trailing) {
      lastArgs = args
      // eslint-disable-next-line ts/no-this-alias
      lastThis = this
      timer = setTimeout(() => {
        if (lastArgs) {
          invoke(lastThis, lastArgs)
          lastArgs = null
          lastThis = null
          timer = null
        }
      }, remaining)
    }
  } as T
}

/**
 * 只执行一次（once）
 *
 * 包装函数使其仅执行一次，后续调用返回首次执行结果。
 *
 * @param fn - 目标函数
 * @returns 包装后的函数，仅首次执行并缓存返回值
 *
 * @example
 * ```ts
 * const init = once(() => setup())
 * init(); init(); // 第二次调用不会再次执行 setup
 * ```
 */
export function once<T extends (...args: any[]) => any>(fn: T) {
  let called = false
  let result: ReturnType<T>
  return function (this: any, ...args: Parameters<T>) {
    if (!called) {
      called = true
      result = fn.apply(this, args)
    }
    return result
  } as T
}

/**
 * 断言工具
 *
 * 断言条件为真；否则抛出错误并中断流程，用于类型收窄与运行时校验。
 *
 * @param condition - 条件表达式；真值通过，假值抛错
 * @param message - 错误消息；默认 `'Assertion failed'`
 * @returns 无返回值；通过 `asserts condition` 进行类型收窄
 * @throws {Error} 当 `condition` 为假时抛出错误
 *
 * @example
 * ```ts
 * assert(typeof x === 'string', 'x 必须为字符串')
 * // 之后 x 将被收窄为 string
 * ```
 */
export function assert(condition: any, message = 'Assertion failed'): asserts condition {
  if (!condition)
    throw new Error(message)
}
