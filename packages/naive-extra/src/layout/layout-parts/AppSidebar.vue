<script setup lang="ts">
import { computed, unref } from 'vue'
import { injectLayoutContext } from '../context'
import AppLeftLogoInfo from './AppLeftLogoInfo.vue'

const ctx = injectLayoutContext()!
const width = computed(() => (unref(ctx.isCollapsed) ? unref(ctx.collapsedWidth) : unref(ctx.siderWidth)))
const option = computed(() => unref(ctx.menuOptions))
const inverted = computed(() => unref(ctx.inverted))

function handleUpdateValue(key: string) {
  ctx.updateActiveKey(key)
}
</script>

<template>
  <NLayoutSider
    position="absolute"
    collapse-mode="width"
    show-trigger="bar"
    :width="width"
    :collapsed-width="ctx.collapsedWidth"
    :bordered="ctx.bordered"
    :inverted="inverted"
    :native-scrollbar="false"
    @update:collapsed="(v) => ctx.updateIsCollapsed(v)"
  >
    <NLayoutHeader :inverted="inverted">
      <slot name="header">
        <AppLeftLogoInfo :header-height="ctx.headerHeight" :is-collapsed="ctx.isCollapsed" />
      </slot>
    </NLayoutHeader>
    <NMenu
      :options="option"
      :collapsed-width="ctx.collapsedWidth"
      :inverted="inverted"
      :value="ctx.activeKey"
      @update:value="handleUpdateValue"
    />
  </NLayoutSider>
</template>
