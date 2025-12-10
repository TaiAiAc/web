import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import type { AxiosClient } from './client'
import type { ContractResult, RequestExtras, TypedResponse } from './types'
import { RequestCache } from './cache'
import { buildRequestKey } from './utils'

/**
 * 接口：高级请求选项
 * 作用：统一语义化方法的参数结构
 */
/**
 * 接口：高级请求选项
 * 作用：统一语义化方法的参数结构，并支持 TS 泛型推导
 * @template T 返回数据的类型（默认 unknown，若提供 contract 可自动推导）
 */
export interface RequestOptions<T = unknown, E = unknown> {
  params?: Record<string, any>
  data?: any
  config?: AxiosRequestConfig
  extras?: RequestExtras
  contract?: (data: any) => ContractResult<T, E>
  loading?: { enabled?: boolean, onChange?: (key: string, active: boolean) => void }
  transform?: { filterEmpty?: boolean, dateToISO?: boolean, encrypt?: (obj: any) => any, decrypt?: (obj: any) => any }
}

/**
 * 函数：按配置序列化请求体
 * 作用：在 Content-Type 为 urlencoded 时将对象序列化为表单
 * @param data 任意请求体
 * @param config AxiosRequestConfig 用于读取 Content-Type
 * @returns 经序列化或原始的请求体
 */
function serializeDataIfNeeded(data: any, config?: AxiosRequestConfig): any {
  const ct = config?.headers && (config.headers as any)['Content-Type']
  if (typeof ct === 'string' && ct.toLowerCase().includes('application/x-www-form-urlencoded')) {
    const usp = new URLSearchParams()
    if (data && typeof data === 'object') {
      Object.keys(data).forEach(k => usp.append(k, String(data[k])))
    }
    return usp
  }
  return data
}

/**
 * 函数：过滤空值并转换日期
 * 作用：递归移除空值并将 Date 转为 ISO 字符串
 * @params obj 输入对象
 * @params opts 选项：filterEmpty/dateToISO
 * @returns 规整后的对象
 */
function normalizePayload(obj: any, opts?: { filterEmpty?: boolean, dateToISO?: boolean }): any {
  if (!obj || typeof obj !== 'object')
    return obj
  const { filterEmpty, dateToISO } = opts || {}
  if (Array.isArray(obj))
    return obj.map(v => normalizePayload(v, opts))
  const out: any = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v instanceof Date) {
      out[k] = dateToISO ? v.toISOString() : v
    }
    else if (v === '' || v === null || v === undefined) {
      if (!filterEmpty)
        out[k] = v
    }
    else if (typeof v === 'object') {
      out[k] = normalizePayload(v, opts)
    }
    else {
      out[k] = v
    }
  }
  return out
}

/**
 * 接口：语义化 API
 * 作用：为业务提供保留响应对象的强类型返回与请求控制
 */
/**
 * 接口：语义化 API
 * 作用：为业务提供泛型友好的数据返回与请求控制
 */
export interface Api {
  get: <T, E = unknown>(url: string, options?: RequestOptions<T, E>) => Promise<TypedResponse<T, E>>
  post: <T, E = unknown>(url: string, options?: RequestOptions<T, E>) => Promise<TypedResponse<T, E>>
  put: <T, E = unknown>(url: string, options?: RequestOptions<T, E>) => Promise<TypedResponse<T, E>>
  patch: <T, E = unknown>(url: string, options?: RequestOptions<T, E>) => Promise<TypedResponse<T, E>>
  delete: <T, E = unknown>(url: string, options?: RequestOptions<T, E>) => Promise<TypedResponse<T, E>>
  head: <T, E = unknown>(url: string, options?: RequestOptions<T, E>) => Promise<TypedResponse<T, E>>
  options: <T, E = unknown>(url: string, options?: RequestOptions<T, E>) => Promise<TypedResponse<T, E>>
  request: <T, E = unknown>(config: AxiosRequestConfig, extras?: RequestExtras & { contract?: (data: any) => ContractResult<T, E>, loading?: { enabled?: boolean, onChange?: (key: string, active: boolean) => void } }) => Promise<TypedResponse<T, E>>
  raw: AxiosClient
  cache: { clear: (key?: string) => void, clearAll: () => void }
}

/**
 * 函数：创建语义化 API
 * 作用：基于 AxiosClient 提供强类型方法并保留 AxiosResponse
 */
/**
 * 函数：创建语义化 API
 * 作用：基于 AxiosClient 提供泛型友好的方法并返回 data
 * @param client 封装后的 AxiosClient
 * @returns Api 语义化请求集合
 */
export function createApi(client: AxiosClient): Api {
  const cache = new RequestCache()

  /**
   *
   * 执行请求（统一入口）
   *
   * 支持撤回、缓存与 loading 状态；在发送前对请求体进行空值过滤、日期转换与可选加密，
   * 统一在此处进行序列化处理（避免方法层重复序列化）。在响应到达后，先对完整响应体
   * 执行 `decrypt`（若提供），再进行 `contract` 映射以提取业务数据与可选包裹层。
   *
   * @param config - Axios 请求配置
   * @param extras - 额外控制项（撤回、缓存、loading、transform、contract 等）
   * @returns 保留 AxiosResponse 的泛型响应对象，含解包后的 `data` 与可选 `envelope`
   *
   * @example
   * ```ts
   * const res = await doRequest({ method: 'post', url: '/api', data: { a: 1 } }, {
   *   transform: { filterEmpty: true, dateToISO: true, encrypt: x => x, decrypt: x => x },
   *   contract: raw => ({ data: raw.data, envelope: { code: raw.code } }),
   *   cache: { enabled: true, ttl: 3000 }
   * })
   * ```
   *
   * @remarks
   * - 序列化仅在此函数内部进行，方法层不再重复处理
   * - 解密顺序为 `decrypt -> contract`，确保对包裹层结构也能正确解密
   *
   * @security
   * - 加密/解密函数由业务注入，注意密钥与算法的安全管理
   *
   * @performance
   * - 归一化与序列化为轻量操作；缓存命中可显著降低重复请求成本
   */
  async function doRequest<T, E = unknown>(
    config: AxiosRequestConfig,
    extras?: RequestExtras & {
      contract?: (data: any) => ContractResult<T, E>
      loading?: {
        enabled?: boolean
        onChange?: (key: string, active: boolean) => void
      }
      transform?: {
        filterEmpty?: boolean
        dateToISO?: boolean
        encrypt?: (obj: any) => any
        decrypt?: (obj: any) => any
      }
    }
  ): Promise<TypedResponse<T, E>> {
    const key = extras?.key || buildRequestKey(config)
    const autoCancel = extras?.autoCancel ?? true
    ;(config as any).__silent = extras?.silent

    // 缓存命中则直接返回
    const cacheOpt = extras?.cache
    if (cacheOpt?.enabled) {
      const ckey = cacheOpt.key || key
      const hit = cache.get<TypedResponse<T, E>>(ckey)
      if (hit !== undefined)
        return hit
    }
    if (extras?.loading?.enabled && typeof extras.loading.onChange === 'function') {
      extras.loading.onChange(key, true)
    }
    try {
      // 请求前处理：空值过滤、日期转换、加密
      if (config.data && extras?.transform) {
        let payload = normalizePayload(config.data, { filterEmpty: extras.transform.filterEmpty, dateToISO: extras.transform.dateToISO })
        if (typeof extras.transform.encrypt === 'function')
          payload = extras.transform.encrypt(payload)
        config.data = serializeDataIfNeeded(payload, config)
      }

      const res: AxiosResponse<T> = await client.request<T>({ ...config, params: config.params }, { ...extras, key, autoCancel })
      let data: any = res.data
      if (extras?.transform && typeof extras.transform.decrypt === 'function')
        data = extras.transform.decrypt(data)

      let envelope: E | undefined
      if (extras?.contract) {
        const mapped = extras.contract(data)
        if (mapped && typeof mapped === 'object' && 'data' in (mapped as any)) {
          data = (mapped as any).data
          envelope = (mapped as any).envelope as E | undefined
        }
        else {
          data = mapped as T
        }
      }

      const typed: TypedResponse<T, E> = { ...(res as any), data } as TypedResponse<T, E>
      if (envelope !== undefined)
        (typed as any).envelope = envelope

      // 写入缓存
      if (cacheOpt?.enabled) {
        const ttl = cacheOpt.ttl ?? 5000
        const ckey = cacheOpt.key || key
        cache.set<TypedResponse<T, E>>(ckey, typed, ttl)
      }
      return typed
    }
    finally {
      if (extras?.loading?.enabled && typeof extras.loading.onChange === 'function') {
        extras.loading.onChange(key, false)
      }
    }
  }

  return {
    /**
     * 函数：GET 请求
     * 作用：语义化 GET，并返回 TypedResponse<T,E>
     */
    async get<T, E = unknown>(url: string, options?: RequestOptions<T, E>): Promise<TypedResponse<T, E>> {
      const config: AxiosRequestConfig = { method: 'get', url, params: options?.params, ...options?.config }
      return doRequest<T, E>(config, {
        ...options?.extras,
        loading: options?.loading,
        contract: options?.contract,
        transform: options?.transform
      })
    },
    /**
     * 函数：POST 请求
     * 作用：语义化 POST，并返回 TypedResponse<T,E>
     */
    async post<T, E = unknown>(url: string, options?: RequestOptions<T, E>): Promise<TypedResponse<T, E>> {
      const config: AxiosRequestConfig = {
        method: 'post',
        url,
        data: options?.data,
        params: options?.params,
        ...options?.config
      }
      return doRequest<T, E>(config, {
        ...options?.extras,
        loading: options?.loading,
        contract: options?.contract,
        transform: options?.transform
      })
    },
    /**
     * 函数：PUT 请求
     * 作用：语义化 PUT，并返回 TypedResponse<T,E>
     */
    async put<T, E = unknown>(url: string, options?: RequestOptions<T, E>): Promise<TypedResponse<T, E>> {
      const config: AxiosRequestConfig = {
        method: 'put',
        url,
        data: options?.data,
        params: options?.params,
        ...(options?.config)
      }
      return doRequest<T, E>(config, {
        ...options?.extras,
        loading: options?.loading,
        contract: options?.contract,
        transform: options?.transform
      })
    },
    /**
     * 函数：PATCH 请求
     * 作用：语义化 PATCH，并返回 TypedResponse<T,E>
     */
    async patch<T, E = unknown>(url: string, options?: RequestOptions<T, E>): Promise<TypedResponse<T, E>> {
      const config: AxiosRequestConfig = {
        method: 'patch',
        url,
        data: options?.data,
        params: options?.params,
        ...options?.config
      }
      return doRequest<T, E>(config, {
        ...options?.extras,
        loading: options?.loading,
        contract: options?.contract,
        transform: options?.transform
      })
    },
    /**
     * 函数：DELETE 请求
     * 作用：语义化 DELETE，并返回 TypedResponse<T,E>
     */
    async delete<T, E = unknown>(url: string, options?: RequestOptions<T, E>): Promise<TypedResponse<T, E>> {
      const config: AxiosRequestConfig = {
        method: 'delete',
        url,
        params: options?.params,
        ...options?.config
      }
      return doRequest<T, E>(config, {
        ...options?.extras,
        loading: options?.loading,
        contract: options?.contract,
        transform: options?.transform
      })
    },
    /**
     * 函数：HEAD 请求
     * 作用：语义化 HEAD，并返回 TypedResponse<T,E>
     */
    async head<T, E = unknown>(url: string, options?: RequestOptions<T, E>): Promise<TypedResponse<T, E>> {
      const config: AxiosRequestConfig = {
        method: 'head',
        url,
        params: options?.params,
        ...options?.config
      }
      return doRequest<T, E>(config, {
        ...options?.extras,
        loading: options?.loading,
        contract: options?.contract,
        transform: options?.transform
      })
    },
    /**
     * 函数：OPTIONS 请求
     * 作用：语义化 OPTIONS，并返回 TypedResponse<T,E>
     */
    async options<T, E = unknown>(url: string, options?: RequestOptions<T, E>): Promise<TypedResponse<T, E>> {
      const config: AxiosRequestConfig = {
        method: 'options',
        url,
        params: options?.params,
        ...options?.config
      }
      return doRequest<T, E>(config, {
        ...options?.extras,
        loading: options?.loading,
        contract: options?.contract,
        transform: options?.transform
      })
    },
    /**
     * 函数：原始请求
     * 作用：直接使用 AxiosRequestConfig 执行并返回 TypedResponse<T,E>
     */
    async request<T, E = unknown>(
      config: AxiosRequestConfig,
      extras?: RequestExtras & { contract?: (data: any) => ContractResult<T, E>, loading?: { enabled?: boolean, onChange?: (key: string, active: boolean) => void } }
    ): Promise<TypedResponse<T, E>> {
      return doRequest<T, E>(config, extras)
    },
    raw: client,
    cache: {
      clear: (key?: string) => cache.clear(key),
      clearAll: () => cache.clear()
    }
  }
}
