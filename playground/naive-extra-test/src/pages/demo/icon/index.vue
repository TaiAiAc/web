<script setup lang="ts">
import { QuiIcon, QuiIconPicker } from 'naive-extra'
import { ref } from 'vue'

const selectedIcon = ref('mdi:home')
</script>

<template>
  <NSpace vertical size="large">
    <NCard title="基础图标 (QuiIcon)">
      <NSpace align="center">
        <NSpace align="center" vertical>
          <QuiIcon icon="mdi:home" size="32" />
          <NText>mdi:home</NText>
        </NSpace>

        <NSpace align="center" vertical>
          <QuiIcon icon="mdi:account" size="32" color="primary" />
          <NText>mdi:account</NText>
        </NSpace>

        <NSpace align="center" vertical>
          <QuiIcon icon="carbon:settings" size="32" class="text-red-500" />
          <NText>carbon:settings</NText>
        </NSpace>
      </NSpace>
    </NCard>

    <NCard title="图标选择器 (QuiIconPicker)">
      <NSpace vertical>
        <QuiIconPicker v-model="selectedIcon" />

        <div class="flex items-center gap-2 p-4 bg-gray-50 rounded">
          <span>当前选择:</span>
          <QuiIcon :icon="selectedIcon" size="24" />
          <code class="bg-gray-200 px-2 py-1 rounded">{{ selectedIcon }}</code>
        </div>
      </NSpace>
    </NCard>
  </NSpace>
</template>
