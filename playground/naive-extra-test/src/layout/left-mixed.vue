<script setup lang="ts">
import { NAvatar, NButton, NFlex, NLayout, NLayoutContent, NLayoutHeader, NLayoutSider, NMenu } from 'naive-ui'

const menuOptions = [
  { label: '总览', key: '/overview' },
  { label: '项目', key: '/project' },
  { label: '设置', key: '/setting' }
]
</script>

<template>
  <NLayout has-sider position="absolute" :native-scrollbar="false">
    <NLayoutSider :width="240" :native-scrollbar="false" bordered>
      <NFlex vertical :style="{ padding: '12px' }">
        <NFlex align="center" :style="{ gap: '8px' }">
          <NAvatar>U</NAvatar>
          <div>用户名</div>
        </NFlex>
        <NButton type="primary">
          快捷入口
        </NButton>
      </NFlex>
      <NMenu :options="menuOptions" />
    </NLayoutSider>
    <NLayout :native-scrollbar="false">
      <NLayoutHeader :style="{ height: '56px' }">
        <div style="display: flex; align-items: center; height: 100%; padding: 0 12px;">
          左侧混合布局
        </div>
      </NLayoutHeader>
      <NLayoutContent :style="{ padding: '16px' }">
        <div>内容</div>
      </NLayoutContent>
    </NLayout>
  </NLayout>
</template>
