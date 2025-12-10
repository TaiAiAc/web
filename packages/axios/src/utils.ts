import type { AxiosRequestConfig } from 'axios'

/**
 * 生成稳定 JSON 字符串
 *
 * 对普通对象进行键排序后再 `JSON.stringify`，确保同结构对象生成的字符串一致；
 * 对数组按原顺序序列化；其余类型直接使用 `JSON.stringify` 的结果。
 *
 * @param obj - 需要序列化的对象或数组
 * @returns 稳定的 JSON 字符串表示
 *
 * @example
 * ```ts
 * stableStringify({ b: 1, a: 2 }) // '{"a":2,"b":1}'
 * stableStringify([2, 1]) // '[2,1]'
 * ```
 *
 * @remarks
 * - 仅排序对象的第一层键；嵌套对象保持原有结构
 *
 * @security
 * 无安全风险，仅字符串处理
 *
 * @performance
 * O(n log n) 取决于键排序；适用于小型配置对象
 */
function stableStringify(obj: any): string {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    const sorted: Record<string, any> = {}
    for (const k of Object.keys(obj).sort()) sorted[k] = (obj as any)[k]
    return JSON.stringify(sorted)
  }
  return JSON.stringify(obj)
}

/**
 * 构建请求唯一键
 *
 * 根据 `method|url|params|data` 生成可复用的请求键，用于撤回、去重与缓存。
 * 对 `data` 的处理具备类型兼容性：
 * - `string`：直接使用字符串
 * - `URLSearchParams`：使用 `.toString()` 确保内容一致
 * - 普通对象：使用稳定序列化（键排序）
 * - 其他不可序列化类型（如 `FormData`、流、`Blob`）：使用占位标记 `"[non-serializable-data]"`
 *
 * @param cfg - Axios 请求配置
 * @returns 由关键字段拼接形成的稳定请求键
 *
 * @example
 * ```ts
 * buildRequestKey({ method: 'post', url: '/api', data: { a:1, b:2 } })
 * // 'POST|/api||{"a":1,"b":2}'
 * ```
 *
 * @remarks
 * - 该键用于缓存与自动撤回，请确保与业务去重语义一致
 *
 * @security
 * 键中不包含敏感信息的还原逻辑；如需避免外泄，请勿在键生成中包含机密字段
 *
 * @performance
 * 轻量字符串拼接与必要的序列化；适用于高并发请求场景
 */
export function buildRequestKey(cfg: AxiosRequestConfig): string {
  const m = (cfg.method || 'get').toUpperCase()
  const u = cfg.url || ''
  const p = cfg.params ? stableStringify(cfg.params) : ''
  let d = ''
  if (cfg.data != null) {
    if (typeof cfg.data === 'string') {
      d = cfg.data
    }
    else {
      const tag = Object.prototype.toString.call(cfg.data)
      if (tag === '[object URLSearchParams]') {
        d = (cfg.data as URLSearchParams).toString()
      }
      else if (Array.isArray(cfg.data)) {
        d = JSON.stringify(cfg.data)
      }
      else if (tag === '[object Object]') {
        d = stableStringify(cfg.data)
      }
      else {
        d = '[non-serializable-data]'
      }
    }
  }
  return [m, u, p, d].join('|')
}

/**
 * 睡眠等待
 *
 * 返回一个在指定毫秒后 `resolve` 的 Promise，用于实现简单的延时控制。
 *
 * @param ms - 毫秒数
 * @returns 在指定时间后完成的 Promise
 *
 * @example
 * ```ts
 * await sleep(1000) // 等待 1s
 * ```
 *
 * @remarks
 * - 结合重试策略可实现指数退避
 *
 * @security
 * 无安全风险
 *
 * @performance
 * 原生定时器，成本极低
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
