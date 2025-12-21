/**
 * 存储配置项
 */
export interface StorageOptions {
  /** 命名空间，默认为 'app-' */
  namespace?: string
  /** 存储类型，默认为 'localStorage' */
  type?: 'localStorage' | 'sessionStorage'
  /** 是否开启混淆，默认为 false */
  obfuscate?: boolean
}

/**
 * 存储数据结构
 */
interface StorageData<T> {
  value: T
  expire: number | null
}

/**
 * [本地存储封装类]
 *
 * [提供 localStorage 和 sessionStorage 的统一封装。
 * 支持命名空间、数据过期机制、以及可选的数据混淆功能。
 * 混淆使用 Base64 编码，主要用于防止敏感信息在控制台明文直视，并非高强度加密。]
 *
 * @example
 * ```ts
 * // 创建实例
 * const storage = new WebStorage({
 *   namespace: 'my-app-',
 *   type: 'localStorage',
 *   obfuscate: true // 开启混淆
 * })
 *
 * // 存储数据，有效期 1 小时
 * storage.set('token', 'xyz123', 60 * 60)
 *
 * // 获取数据
 * const token = storage.get('token')
 *
 * // 删除数据
 * storage.remove('token')
 * ```
 */
export class WebStorage {
  private namespace: string
  private storage: Storage
  private obfuscate: boolean

  constructor(options: StorageOptions = {}) {
    const {
      namespace = 'app-',
      type = 'localStorage',
      obfuscate = false
    } = options

    this.namespace = namespace
    this.obfuscate = obfuscate

    if (typeof window !== 'undefined') {
      this.storage = type === 'localStorage' ? window.localStorage : window.sessionStorage
    }
    else {
      this.storage = {
        length: 0,
        clear: () => {},
        getItem: (_key: string) => null,
        key: (_index: number) => null,
        removeItem: (_key: string) => {},
        setItem: (_key: string, _value: string) => {}
      }
    }
  }

  /**
   * 设置存储
   * @param key - 键名
   * @param value - 值
   * @param expire - 过期时间（秒），null 或不传表示永不过期
   */
  set<T = any>(key: string, value: T, expire: number | null = null): void {
    const data: StorageData<T> = {
      value,
      expire: expire !== null ? Date.now() + expire * 1000 : null
    }

    const storageKey = this.getKey(key)
    let storageValue = JSON.stringify(data)

    if (this.obfuscate) {
      storageValue = this.encrypt(storageValue)
    }

    this.storage.setItem(storageKey, storageValue)
  }

  /**
   * 获取存储
   * @param key - 键名
   * @param def - 默认值，当 key 不存在或已过期时返回
   * @returns 存储的值或默认值
   */
  get<T = any>(key: string, def: T | null = null): T | null {
    const storageKey = this.getKey(key)
    let item = this.storage.getItem(storageKey)

    if (!item)
      return def

    if (this.obfuscate) {
      try {
        item = this.decrypt(item)
      }
      catch (e) {
        // 解密失败，可能是未开启混淆时存入的数据，或者是被篡改的数据
        console.error(`[WebStorage] Failed to decrypt value for key "${key}"`, e)
        return def
      }
    }

    try {
      const data = JSON.parse(item) as StorageData<T>

      // 检查过期时间
      if (data.expire !== null && data.expire < Date.now()) {
        this.remove(key)
        return def
      }

      return data.value
    }
    catch (e) {
      console.error(`[WebStorage] Failed to parse value for key "${key}"`, e)
      return def
    }
  }

  /**
   * 移除存储
   * @param key - 键名
   */
  remove(key: string): void {
    const storageKey = this.getKey(key)
    this.storage.removeItem(storageKey)
  }

  /**
   * 清空当前命名空间下的所有存储
   */
  clear(): void {
    // 仅清除匹配 namespace 的项
    // 注意：localStorage 是共享的，直接 clear() 会清除所有域的数据
    // 所以这里只遍历删除
    const keys = Object.keys(this.storage)
    keys.forEach((key) => {
      // 检查是否是混淆过的 key
      // 如果开启混淆，key 也是无法直接匹配前缀的，这会导致 clear 变得困难
      // 策略：如果开启了混淆，clear 操作可能比较危险或难以实现精确匹配
      // 这里的实现假设 key 本身不混淆，或者用户接受 key 混淆带来的 clear 限制

      // 修正策略：为了支持 clear，key 本身不进行混淆，只混淆 value。
      // 如果必须混淆 key，那么 namespace 也应该被混淆，但这会导致无法遍历。
      // 因此，本实现中，只混淆 value，key 保持 "namespace + key" 的明文形式。
      if (key.startsWith(this.namespace)) {
        this.storage.removeItem(key)
      }
    })
  }

  /**
   * 获取处理后的键名
   */
  private getKey(key: string): string {
    return `${this.namespace}${key}`
  }

  /**
   * 加密（混淆）
   */
  private encrypt(data: string): string {
    if (typeof window === 'undefined')
      return data
    try {
      // 使用 encodeURIComponent 处理中文，btoa 进行 Base64
      return window.btoa(encodeURIComponent(data))
    }
    catch (e) {
      console.warn('[WebStorage] Encrypt failed, fallback to raw data', e)
      return data
    }
  }

  /**
   * 解密（还原）
   */
  private decrypt(data: string): string {
    if (typeof window === 'undefined')
      return data
    // 使用 decodeURIComponent 处理中文，atob 进行 Base64 解码
    return decodeURIComponent(window.atob(data))
  }
}

/**
 * 默认导出的 localStorage 实例
 */
export const localStore = new WebStorage({ type: 'localStorage' })

/**
 * 默认导出的 sessionStorage 实例
 */
export const sessionStore = new WebStorage({ type: 'sessionStorage' })
