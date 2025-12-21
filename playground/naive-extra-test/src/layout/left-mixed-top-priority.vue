<script setup lang="ts">
import { NLayout, NLayoutContent, NLayoutHeader, NLayoutSider, NMenu } from 'naive-ui'

const headerMenu = [
  { label: '首页', key: 'home' },
  { label: '报表', key: 'report' },
  { label: '配置', key: 'setting' }
]
const sideMenu = [
  { label: '仪表盘', key: '/dashboard' },
  { label: '用户', key: '/user' },
  { label: '系统', key: '/system' }
]
</script>

<template>
  <NLayout position="absolute" :native-scrollbar="false">
    <NLayoutHeader :style="{ height: '56px' }" bordered>
      <NMenu mode="horizontal" :options="headerMenu" />
    </NLayoutHeader>
    <NLayout has-sider position="absolute" style="top: 56px; bottom: 0;" :native-scrollbar="false">
      <NLayoutSider :width="64" collapsed :collapsed-width="64" :native-scrollbar="false" bordered content-style="height: 100%;">
        <NMenu :options="sideMenu" />
      </NLayoutSider>
      <NLayoutContent :style="{ padding: '16px' }" :native-scrollbar="false">
        顶部优先的左侧混合布局
      </NLayoutContent>
    </NLayout>
  </NLayout>
</template>
