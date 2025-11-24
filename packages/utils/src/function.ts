/**
 * 函数：防抖
 * 作用：在等待时间内合并多次调用，仅最后一次执行（可选立即执行）
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
 * 函数：节流
 * 作用：在时间窗口内最多执行一次，可配置首尾触发
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
 * 函数：只执行一次
 * 作用：包装函数使其只执行一次，后续调用返回首次结果
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
 * 函数：断言
 * 作用：断言条件为真，否则抛出错误
 */
export function assert(condition: any, message = 'Assertion failed'): asserts condition {
  if (!condition)
    throw new Error(message)
}
