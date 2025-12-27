import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/demo/button' },
  {
    path: '/demo',
    name: 'DemoGroup',
    meta: { title: '组件示例', icon: 'mdi:application-cog', order: 1 },
    children: [
      {
        path: 'provider',
        name: 'ProviderDemo',
        component: () => import('@/pages/demo/provider/index.vue'),
        meta: { title: '主题提供组件', icon: 'pixel:themes-solid', order: 20 }
      },
      {
        path: 'layout',
        name: 'LayoutDemo',
        component: () => import('@/pages/demo/layout/index.vue'),
        meta: { title: '布局示例', icon: 'streamline-plump:layout-window-4-solid', order: 10 }
      },
      {
        path: 'button',
        name: 'ButtonDemo',
        component: () => import('@/pages/demo/button/index.vue'),
        meta: { title: '按钮示例', icon: 'proicons:button', order: 1 }
      },
      {
        path: 'form',
        name: 'FormDemo',
        component: () => import('@/pages/demo/form/index.vue'),
        meta: { title: '表单示例', icon: 'lets-icons:form-duotone-line', order: 2 }
      },
      {
        path: 'search-form',
        name: 'SearchFormDemo',
        component: () => import('@/pages/demo/search-form/index.vue'),
        meta: { title: '搜索表单示例', icon: 'ri:file-search-fill', order: 3 }
      },
      {
        path: 'table',
        name: 'TableDemo',
        component: () => import('@/pages/demo/table/index.vue'),
        meta: { title: '表格示例', icon: 'carbon:table', order: 4 }
      },
      {
        path: 'upload',
        name: 'UploadDemo',
        component: () => import('@/pages/demo/upload/index.vue'),
        meta: { title: '上传示例', icon: 'material-symbols:drive-folder-upload-rounded', order: 5 }
      },
      {
        path: 'icon',
        name: 'IconDemo',
        component: () => import('@/pages/demo/icon/index.vue'),
        meta: { title: '图标示例', icon: 'line-md:iconify1', order: 6 }
      }
    ]
  },
  {
    path: '/test',
    redirect: '/test/page-1',
    name: 'TestGroup',
    meta: { title: '测试示例', icon: 'mdi:test-tube', order: 100 },
    children: [
      {
        path: 'page-1',
        name: 'TestPage1',
        component: () => import('@/pages/test/text-page-1.vue'),
        meta: { title: '测试页面 1', icon: 'mdi:numeric-1-circle', order: 1 }
      },
      {
        path: 'page-2',
        name: 'TestPage2',
        component: () => import('@/pages/test/test-page-2/test-page-2.vue'),
        meta: { title: '测试页面 2', icon: 'mdi:numeric-2-circle', order: 2 }
      },
      {
        path: 'page-3',
        name: 'TestPage3',
        component: () => import('@/pages/test/test-page-3/test-page-3.vue'),
        meta: { title: '测试页面 3', icon: 'mdi:numeric-3-circle', order: 3 },
        children: [
          {
            path: 'page-4',
            name: 'TestPage4',
            component: () => import('@/pages/test/test-page-3/test-page-4/test-page-4.vue'),
            meta: { title: '测试页面 4', icon: 'mdi:numeric-4-circle', order: 1 }
          },
          {
            path: 'page-5',
            name: 'TestPage5',
            component: () => import('@/pages/test/test-page-3/test-page-4/test-page-5.vue'), // ✅ 修正路径！
            meta: { title: '测试页面 5', icon: 'mdi:numeric-5-circle', order: 2 }
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
