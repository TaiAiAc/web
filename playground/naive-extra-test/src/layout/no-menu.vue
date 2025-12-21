<script setup lang="ts">
import { NButton, NCard, NFlex, NInput, NLayout, NLayoutContent, NLayoutFooter, NLayoutHeader } from 'naive-ui'
</script>

<template>
  <NLayout position="absolute" :native-scrollbar="false">
    <NLayoutHeader :style="{ height: '56px' }">
      <div style="display: flex; align-items: center; gap: 12px; padding: 0 12px; height: 100%;">
        <strong>无菜单布局</strong>
        <NInput placeholder="搜索..." style="max-width: 240px;" />
        <div style="margin-left: auto;">
          <NButton size="small">
            操作
          </NButton>
        </div>
      </div>
    </NLayoutHeader>
    <NLayoutContent :style="{ padding: '16px' }">
      <NFlex vertical>
        <NCard v-for="i in 30" :key="i" :title="`内容块 ${i}`" size="small">
          这是内置滚动区域中的内容卡片
        </NCard>
      </NFlex>
    </NLayoutContent>
    <NLayoutFooter :style="{ height: '40px' }">
      <div style="display: flex; align-items: center; height: 100%; padding: 0 12px;">
        页脚
      </div>
    </NLayoutFooter>
  </NLayout>
</template>
