<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const routes = router.options.routes.filter(r => r.path !== '/')

const activeKey = ref<string>('')

watch(
  () => route.path,
  (path) => {
    activeKey.value = path
  },
  { immediate: true }
)

function handleUpdateValue(key: string) {
  router.push(key)
}
</script>

<template>
  <n-layout has-sider position="absolute" :native-scrollbar="false">
    <n-layout-sider bordered>
      <n-h2 style="padding: 16px; margin: 0; text-align: center;">
        Playground
      </n-h2>
      <n-menu
        :options="routes.map((item) => ({
          label: item.meta?.title ?? item.name,
          key: item.path,
        }))"
        :value="activeKey"
        @update:value="handleUpdateValue"
      />
    </n-layout-sider>
    <n-layout content-style="padding: 24px;">
      <slot />
    </n-layout>
  </n-layout>
</template>
