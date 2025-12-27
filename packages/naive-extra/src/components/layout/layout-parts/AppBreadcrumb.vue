<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { h } from 'vue'

import { useContext } from '../context'

const { baseRoutes, activeKey, updateActiveKey } = useContext()

/**
 * 生成面包屑项（基于 baseRoutes），叶子页面可点击
 *
 * @returns 面包屑项数组：{ label, path, icon, clickable }
 */
function joinPath(parent: string, p: string) {
  const full = p?.startsWith('/') ? p : (parent ? `${parent}/${p}` : `/${p}`)
  const single = full.replace(/\/+/g, '/')
  return single.length > 1 && single.endsWith('/') ? single.slice(0, -1) : single
}

function buildIndex(list: any[], parent = '', index = new Map<string, any>(), children = new Map<string, string[]>()) {
  for (const r of (list || [])) {
    const full = joinPath(parent, r.path)
    index.set(full, { ...r, path: full })
    const childList = r.children ? (r.children as any[]) : []
    children.set(full, childList.map(c => joinPath(full, c.path)))
    if (childList.length)
      buildIndex(childList, full, index, children)
  }
  return { index, children }
}

const crumbs = computed(() => {
  const path = String(unref(activeKey) ?? '')
  const parts = path.split('/').filter(Boolean)
  const { index, children } = buildIndex(unref(baseRoutes) as any[] || [])
  const items: { label: string, path: string, icon?: any, clickable: boolean, children: { label: string, key: string, icon?: any }[] }[] = []
  for (let i = 0; i < parts.length; i++) {
    const p = `/${parts.slice(0, i + 1).join('/')}`
    const rec = index.get(p)
    const label = rec?.meta?.title ?? (rec?.name as string) ?? p.split('/').filter(Boolean).pop() ?? ''
    const iconStr = rec?.meta?.icon as string | undefined
    const icon = iconStr ? () => h(Icon, { icon: iconStr, width: '18px', height: '18px' }) : undefined
    const directChildren = (children.get(p) || [])
    const childOptions = directChildren.map((cp) => {
      const cRec = index.get(cp)
      const lbl = cRec?.meta?.title ?? (cRec?.name as string) ?? cp.split('/').filter(Boolean).pop() ?? ''
      const ic = cRec?.meta?.icon as string | undefined
      const hasChildren = (children.get(cp) || []).length > 0
      const target = hasChildren ? (cRec?.redirect as string | undefined) ?? cp : cp
      return {
        label: String(lbl),
        key: target,
        icon: ic ? () => h(Icon, { icon: ic, width: '18px', height: '18px' }) : undefined
      }
    })
    const isLeaf = directChildren.length === 0
    items.push({ label: String(label), icon, path: p, clickable: isLeaf, children: childOptions })
  }

  return items
})

function onCrumbClick(to: string) {
  updateActiveKey(to)
}

function onSelectChild(key: string) {
  updateActiveKey(key)
}
</script>

<template>
  <n-breadcrumb class="px-2 w-full">
    <n-breadcrumb-item v-for="item in crumbs" :key="item.path">
      <n-flex :size="2">
        <component :is="item.icon" v-if="item.icon" />
        <n-dropdown
          v-if="item.children.length"
          :options="item.children"
          trigger="hover"
          @select="onSelectChild"
        >
          <span
            :class="item.clickable ? 'cursor-pointer' : 'cursor-default opacity-80'"
            @click="item.clickable ? onCrumbClick(item.path) : undefined"
          >{{ item.label }}</span>
        </n-dropdown>
        <span
          v-else
          :class="item.clickable ? 'cursor-pointer' : 'cursor-default opacity-80'"
          @click="item.clickable ? onCrumbClick(item.path) : undefined"
        >{{ item.label }}</span>
      </n-flex>
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>

<style scoped></style>
