import { createApi, createClient } from '@quiteer/axios'

// 创建基础客户端（可传入 baseURL/timeout/headers 等）
const client = createClient({ baseURL: '/api', timeout: 15000 })

// 语义化 API（返回 data，支持泛型推导）
export const api = createApi(client)
