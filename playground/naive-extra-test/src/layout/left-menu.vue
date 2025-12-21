<!-- LeftMenuLayout.vue -->
<script setup lang="ts">
import type { Component } from 'vue'
import {
  NIcon,
  NLayout,
  NLayoutContent,
  NLayoutFooter,
  NLayoutHeader,
  NLayoutSider,
  NMenu
} from 'naive-ui'
import { computed, h, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import IconAccessibility from '~icons/carbon/accessibility'

const router = useRouter()
const route = useRoute()

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const props = reactive({
  type: 'left-menu',
  bordered: false,
  isCollapsed: false,
  headerHeight: '56px',
  footerHeight: '50px',
  siderWidth: 240,
  collapsedWidth: 60
})

const siderWidth = computed(() => props.isCollapsed ? `${props.collapsedWidth}` : props.siderWidth)

const menuRoutes = router.options.routes.filter(
  r => r.path !== '/' && r.meta?.showInMenu !== false
).map(route => ({
  label: route.meta?.title || route.name || route.path,
  key: route.path,
  icon: renderIcon(route.meta?.icon || IconAccessibility)
})).concat([{
  label: '设置',
  key: '/setting',
  icon: renderIcon(IconAccessibility),
  children: [
    { label: '个人中心', key: '/setting/profile', icon: renderIcon(IconAccessibility), children: [
      { label: '基本信息', key: '/setting/profile/basic', icon: renderIcon(IconAccessibility) },
      { label: '安全设置', key: '/setting/profile/security', icon: renderIcon(IconAccessibility) }
    ] },
    { label: '安全设置', key: '/setting/security', icon: renderIcon(IconAccessibility) }
  ]
}])

const activeKey = ref<string>('')

watch(
  () => route.path,
  (path) => {
    activeKey.value = path
  },
  { immediate: true }
)

function handleMenuSelect(key: string) {
  router.push(key)
}
</script>

<template>
  <!-- 根布局：占满视口 -->
  <NLayout has-sider position="absolute">
    <!-- 左侧菜单：纵向可滚动 -->
    <NLayoutSider
      position="absolute"
      collapse-mode="width"
      show-trigger="bar"
      :width="siderWidth"
      :collapsed-width="props.collapsedWidth"
      :bordered="props.bordered"
      :native-scrollbar="false"
      @update:collapsed="props.isCollapsed = $event"
    >
      <n-flex class=" bg-zinc-100" :wrap="false" align="center" :style="{ height: props.headerHeight }" :justify="props.isCollapsed ? 'center' : 'flex-start'" :class="props.isCollapsed ? '' : 'px-5'">
        <i class=" i-skill-icons:vuejs-dark text-3xl" />
        <div v-if="!props.isCollapsed">
          {{ props.isCollapsed ? '' : '明天会好的' }}
        </div>
      </n-flex>
      <NMenu
        :options="menuRoutes"
        :collapsed-width="props.collapsedWidth"
        :value="activeKey"
        @update:value="handleMenuSelect"
      />
    </NLayoutSider>

    <!-- 右侧主区域容器 -->
    <NLayout position="absolute" :style="{ left: `${siderWidth}px` }">
      <!-- 固定 Header（不滚动） -->
      <NLayoutHeader
        :bordered="props.bordered"
        :style="{ height: props.headerHeight }"
      >
        <n-flex align="center" class="w-4/5" :style="{ height: props.headerHeight }">
          <NMenu
            v-model:value="activeKey"
            mode="horizontal"
            :options="menuRoutes"
            responsive
            @update:value="handleMenuSelect"
          />
        </n-flex>
      </NLayoutHeader>

      <!-- 可滚动的内容区（关键！） -->
      <NLayoutContent
        position="absolute"
        :style="{ top: props.headerHeight, bottom: props.footerHeight }"
        :native-scrollbar="false"
        content-style="padding: 16px;"
      >
        <router-view />
      </NLayoutContent>
      <!-- 固定 Footer（不滚动） -->
      <NLayoutFooter
        class="flex flex-center"
        position="absolute"
        :bordered="props.bordered"
        :style="{ height: props.footerHeight }"
      >
        固定页脚
      </NLayoutFooter>
    </NLayout>
  </NLayout>
</template>

<style>
/* 禁止全局滚动 */
html,
body,
#app {
  margin: 0;
  padding: 0;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
}
</style>
