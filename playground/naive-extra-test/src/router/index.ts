import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
// layout moved outside into App.vue

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/button' },
  {
    path: '/provider',
    name: 'ProviderDemo',
    component: () => import('../pages/ProviderDemo.vue'),
    meta: { title: '主题提供组件', icon: 'pixel:themes-solid' }
  },
  {
    path: '/button',
    name: 'ButtonDemo',
    component: () => import('../pages/ButtonDemo.vue'),
    meta: { title: '按钮示例', icon: 'proicons:button' }
  },
  {
    path: '/form',
    name: 'FormDemo',
    component: () => import('../pages/FormDemo.vue'),
    meta: { title: '表单示例', icon: 'lets-icons:form-duotone-line' }
  },
  {
    path: '/search-form',
    name: 'SearchFormDemo',
    component: () => import('../pages/SearchFormDemo.vue'),
    meta: { title: '搜索表单示例', icon: 'ri:file-search-fill' }
  },
  {
    path: '/table',
    name: 'TableDemo',
    component: () => import('../pages/TableDemo.vue'),
    meta: { title: '表格示例', icon: 'carbon:table' }
  },
  {
    path: '/upload',
    name: 'UploadDemo',
    component: () => import('../pages/UploadDemo.vue'),
    meta: { title: '上传示例', icon: 'material-symbols:drive-folder-upload-rounded' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
