<script setup lang="ts">
import { computed, unref } from 'vue'
import { injectLayoutContext } from '../context'

const ctx = injectLayoutContext()!

function onMenuSelect(key: string) {
  ctx.updateActiveKey(key)
}

const activeKey = computed({
  get: () => ctx.activeKey,
  set: (key: string) => ctx.updateActiveKey(key)
})

const inverted = computed(() => unref(ctx.inverted))
const options = computed(() => unref(ctx.menuOptions))
</script>

<template>
  <NLayoutHeader position="absolute" :bordered="ctx.bordered" :inverted="inverted" :style="{ height: `${ctx.headerHeight}px`, zIndex: 1 }">
    <n-flex align="center" class="w-4/5" :style="{ height: `${ctx.headerHeight}px` }">
      <n-menu
        v-model:value="activeKey"
        mode="horizontal"
        :options="options"
        responsive
        :inverted="inverted"
        @update:value="onMenuSelect"
      />
    </n-flex>
  </NLayoutHeader>
</template>
