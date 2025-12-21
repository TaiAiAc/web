<script setup lang="ts">
import { QuiProvider } from '@quiteer/naive-extra'
import { computed } from 'vue'
import { LeftMenuLayout } from './layout'
import { useAppStore } from './stores/app'

const store = useAppStore()
const configProps = computed(() => store.configProps)
</script>

<template>
  <QuiProvider :config-provider-props="configProps">
    <LeftMenuLayout />
  </QuiProvider>
</template>
