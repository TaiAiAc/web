<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  /**
   * Iconify 图标名称，格式：`collection:name`
   * 例如：'mdi:home', 'carbon:user', 'tabler:settings'
   */
  icon?: string
  size?: string | number
  color?: string
}>()
</script>

<template>
  <Icon
    v-if="icon"
    :icon="icon"
    :width="size"
    :height="size"
    :color="color"
  />
</template>
