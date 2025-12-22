<script setup lang="ts">
import type { Props } from './props'

defineProps<Props>()
</script>

<template>
  <NPopconfirm v-bind="popconfirmProps" negative-text="取消" positive-text="确认">
    <template #trigger>
      <NButton v-bind="buttonProps" secondary>
        <slot />
      </NButton>
    </template>
    {{ title }}
  </NPopconfirm>
</template>

<style lang="scss" scoped></style>
