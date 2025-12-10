import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

/**
 * 接口：Axios 插件钩子
 * 作用：对请求/响应/错误进行模块化扩展处理
 */
export interface AxiosPlugin {
  onRequest?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | void
  onResponse?: <T>(response: AxiosResponse<T>) => AxiosResponse<T> | void
  onError?: (error: any) => any
}

/**
 * 抽象类：重试策略
 * 作用：定义计算下一次重试等待时间的协议
 */
export abstract class RetryStrategy {
  /**
   * 计算下一次重试的等待时间（毫秒）
   */
  abstract nextDelay(attempt: number): number
}

/**
 * 接口：重试选项
 * 作用：配置重试次数、策略与触发条件
 */
export interface RetryOptions {
  times?: number
  strategy?: RetryStrategy
  retryOn?: (err: any) => boolean
}

/**
 * 接口：请求额外选项
 * 作用：控制撤回键、自动撤回与重试行为
 */
export interface RequestExtras {
  key?: string
  autoCancel?: boolean
  retry?: RetryOptions
  loading?: { enabled?: boolean, onChange?: (key: string, active: boolean) => void }
  silent?: boolean
  cache?: { enabled?: boolean, ttl?: number, key?: string }
}

/**
 * 抽象类：响应品牌（虚拟类）
 * 作用：通过私有成员实现名义类型约束，避免用户误用导致类型“变形”
 * 说明：仅用于类型系统，不会参与运行时生成任何实体
 * @template T 响应体 data 的类型
 * @template E 响应包裹层（envelope/metadata）的类型
 */
export abstract class ResponseBrand<T, E = unknown> {
  /** 私有品牌字段：编译期名义约束，不产生运行时代码 */
  private __typed_response_brand__?: { data: T, envelope: E }
}

/**
 * 类型：TypedResponse
 * 作用：在保留 AxiosResponse<T> 的前提下，扩展 envelope 元信息并施加名义约束
 * 适用：需要完整响应（状态码/头/配置）同时对返回数据进行强泛型描述的场景
 * @template T 响应体 data 的类型
 * @template E 响应包裹层（如后端统一返回结构中的除 data 外的部分）
 */
export type TypedResponse<T, E = unknown> = AxiosResponse<T> & {
  /** 响应主体数据（经 contract 处理后） */
  data: T
  /** 可选：原始包裹层（如 { code, msg, timestamp }） */
  envelope?: E
} & ResponseBrand<T, E>

/**
 * 类型：ContractResult
 * 作用：用于将服务端原始响应数据映射为强类型数据，可灵活返回纯数据或带 envelope 的结构
 * @template T 目标数据类型
 * @template E 包裹层类型
 */
export type ContractResult<T, E = unknown> = T | { data: T, envelope?: E }
