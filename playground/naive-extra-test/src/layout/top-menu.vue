<script setup lang="ts">
import { NLayout, NLayoutContent, NLayoutHeader, NMenu } from 'naive-ui'

const headerMenu = [
  { label: '首页', key: 'home' },
  { label: '报表', key: 'report' },
  { label: '配置', key: 'setting' }
]
</script>

<template>
  <NLayout position="absolute" :native-scrollbar="false">
    <NLayoutHeader :style="{ height: '56px' }">
      <NMenu mode="horizontal" :options="headerMenu" />
    </NLayoutHeader>
    <NLayoutContent :style="{ padding: '16px' }">
      顶部菜单布局
    </NLayoutContent>
  </NLayout>
</template>
