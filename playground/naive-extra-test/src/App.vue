<script setup lang="ts">
import { QuiProvider } from 'naive-extra'
import { computed } from 'vue'
import BaseLayout from './layout/index.vue'
import { useAppStore } from './stores/app'

const store = useAppStore()
const configProps = computed(() => store.configProps)
</script>

<template>
  <QuiProvider :config-provider-props="configProps">
    <BaseLayout />
  </QuiProvider>
</template>
