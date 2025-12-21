import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
// layout moved outside into App.vue

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/button' },
  {
    path: '/provider',
    name: 'ProviderDemo',
    component: () => import('../pages/ProviderDemo.vue'),
    meta: { title: '主题提供组件' }
  },
  {
    path: '/button',
    name: 'ButtonDemo',
    component: () => import('../pages/ButtonDemo.vue'),
    meta: { title: '按钮示例' }
  },
  {
    path: '/form',
    name: 'FormDemo',
    component: () => import('../pages/FormDemo.vue'),
    meta: { title: '表单示例' }
  },
  {
    path: '/search-form',
    name: 'SearchFormDemo',
    component: () => import('../pages/SearchFormDemo.vue'),
    meta: { title: '搜索表单示例' }
  },
  {
    path: '/table',
    name: 'TableDemo',
    component: () => import('../pages/TableDemo.vue'),
    meta: { title: '表格示例' }
  },
  {
    path: '/upload',
    name: 'UploadDemo',
    component: () => import('../pages/UploadDemo.vue'),
    meta: { title: '上传示例' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
