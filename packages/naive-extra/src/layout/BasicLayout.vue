<script setup lang="ts">
import { unref } from 'vue'
import { injectLayoutContext } from './context'
import AppFooter from './layout-parts/AppFooter.vue'
import AppHeader from './layout-parts/AppHeader.vue'
import AppMain from './layout-parts/AppMain.vue'
import AppSidebar from './layout-parts/AppSidebar.vue'

const ctx = injectLayoutContext()!
const isCollapsed = computed(() => unref(ctx.isCollapsed))
const collapsedWidth = computed(() => unref(ctx.collapsedWidth))
const siderWidth = computed(() => unref(ctx.siderWidth))
</script>

<template>
  <NLayout has-sider position="absolute" :native-scrollbar="false" :inverted="unref(ctx.inverted)">
    <AppSidebar />

    <NLayout position="absolute" :style="{ left: `${isCollapsed ? collapsedWidth : siderWidth}px` }">
      <AppHeader />

      <AppMain>
        <slot />
      </AppMain>

      <AppFooter>
        固定页脚
      </AppFooter>
    </NLayout>
  </NLayout>
</template>
