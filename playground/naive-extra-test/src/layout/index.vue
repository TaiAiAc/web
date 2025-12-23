<script setup lang="ts">
import { QuiLayout } from '@quiteer/naive-extra'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLayoutStore } from '../stores/layout'

// 获取当前路由和路由器实例
const route = useRoute()
const router = useRouter()

const layout = useLayoutStore()
const {
  collapsed,
  activeKey,
  menuOptions,
  bordered,
  inverted,
  headerHeight,
  footerHeight,
  siderWidth,
  collapsedWidth,
  type
} = storeToRefs(layout)
const { setActiveKey } = layout

// 监听路由变化，更新激活的菜单项
watch(
  () => route.path,
  (path) => {
    setActiveKey(path)
  },
  { immediate: true }
)

// 定义处理菜单点击的方法
function onActive(key: string) {
  router.push(key)
}

// 布局类型由 useLayout 管理
</script>

<template>
  <div style="display: grid; grid-template-columns: 360px 1fr; gap: 16px; align-items: start;">
    <!-- QuiLayout 组件 -->
    <QuiLayout
      v-model:is-collapsed="collapsed"
      v-model:active-key="activeKey"
      v-model:inverted="inverted"
      :type="type"
      :bordered="bordered"
      :header-height="headerHeight"
      :footer-height="footerHeight"
      :sider-width="siderWidth"
      :collapsed-width="collapsedWidth"
      :menu-options="menuOptions"
      @active="onActive"
    >
      <!-- RouterView 用于渲染匹配的路由组件 -->
      <RouterView />
    </QuiLayout>
  </div>
</template>

<style lang="scss" scoped></style>
