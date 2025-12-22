<!-- LeftMenuLayout.vue -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import {
  NLayout,
  NLayoutContent,
  NLayoutFooter,
  NLayoutHeader,
  NLayoutSider,
  NMenu
} from 'naive-ui'
import { computed, h, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

function renderIcon(icon: string) {
  return () => h(Icon, { icon: icon ?? 'fluent:document-one-page-24-filled', width: '24px', height: '24px' })
}

const props = reactive({
  type: 'left-menu',
  bordered: true,
  isCollapsed: false,
  headerHeight: '56px',
  footerHeight: '50px',
  siderWidth: 240,
  collapsedWidth: 60,
  valueField: 'key',
  labelField: 'label',
  childrenField: 'children'
})

const siderWidth = computed(() => props.isCollapsed ? `${props.collapsedWidth}` : props.siderWidth)

const menuRoutes = router.options.routes.filter(
  r => r.path !== '/' && r.meta?.showInMenu !== false
).map(route => ({
  label: route.meta?.title || route.name || route.path,
  key: route.path,
  icon: renderIcon(route.meta?.icon as string)
}))

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
      <NLayout>
        <NLayoutHeader>
          <n-flex class=" " :wrap="false" align="center" :style="{ height: props.headerHeight }" :justify="props.isCollapsed ? 'center' : 'flex-start'" :class="props.isCollapsed ? '' : 'px-5'">
            <i class=" i-skill-icons:vuejs-dark text-3xl" />
            <div v-if="!props.isCollapsed">
              {{ props.isCollapsed ? '' : '明天会好的' }}
            </div>
          </n-flex>
        </NLayoutHeader>
        <NMenu
          :options="menuRoutes"
          :collapsed-width="props.collapsedWidth"
          :value="activeKey"
          @update:value="handleMenuSelect"
        />
      </NLayout>
    </NLayoutSider>

    <!-- 右侧主区域容器 -->
    <NLayout position="absolute" :style="{ left: `${siderWidth}px` }">
      <!-- 固定 Header（不滚动） -->
      <NLayoutHeader
        :bordered="props.bordered"
        :style="{ height: props.headerHeight }"
      >
        <!-- <n-breadcrumb>
          <n-breadcrumb-item>
            北京总行
          </n-breadcrumb-item>
          <n-breadcrumb-item>
            天津分行
          </n-breadcrumb-item>
          <n-breadcrumb-item>
            平山道支行
          </n-breadcrumb-item>
        </n-breadcrumb> -->
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
