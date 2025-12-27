<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { h } from 'vue'

import { useContext } from '../context'

const { menuOptions, activeKey, updateActiveKey } = useContext()

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
    const full = joinPath(parent, r.key || r.path)
    index.set(full, { ...r, path: full })
    const childList = r.children ? (r.children as any[]) : []
    children.set(full, childList.map(c => joinPath(full, c.key || c.path)))
    if (childList.length)
      buildIndex(childList, full, index, children)
  }
  return { index, children }
}

const routeIndex = computed(() => {
  return buildIndex(unref(menuOptions) as any[] || [])
})

const crumbs = computed(() => {
  const path = String(unref(activeKey) ?? '')
  const parts = path.split('/').filter(Boolean)
  const { index, children } = routeIndex.value
  const items: { label: string | (() => any), path: string, icon?: any, clickable: boolean, children: { label: string | (() => any), key: string, icon?: any }[] }[] = []
  for (let i = 0; i < parts.length; i++) {
    const p = `/${parts.slice(0, i + 1).join('/')}`
    const rec = index.get(p)
    const label = rec?.label || rec?.meta?.title || (rec?.name as string) || p.split('/').filter(Boolean).pop() || ''

    let icon = rec?.icon
    if (!icon && rec?.meta?.icon) {
      icon = () => h(Icon, { icon: rec.meta.icon, width: '18px', height: '18px' })
    }

    const directChildren = (children.get(p) || [])
    const childOptions = directChildren.map((cp) => {
      const cRec = index.get(cp)
      const lbl = cRec?.label || cRec?.meta?.title || (cRec?.name as string) || cp.split('/').filter(Boolean).pop() || ''

      let ic = cRec?.icon
      if (!ic && cRec?.meta?.icon) {
        ic = () => h(Icon, { icon: cRec.meta.icon, width: '18px', height: '18px' })
      }

      const hasChildren = (children.get(cp) || []).length > 0
      const target = hasChildren ? (cRec?.redirect as string | undefined) ?? cp : cp
      return {
        label: lbl,
        key: target,
        icon: ic
      }
    })
    items.push({ label, icon, path: p, clickable: true, children: childOptions })
  }

  return items
})

function findLeaf(path: string): string {
  const { index, children } = routeIndex.value
  let current = path

  for (let i = 0; i < 100; i++) { // Prevent infinite loops
    const rec = index.get(current)
    if (rec?.redirect) {
      current = rec.redirect
      continue
    }

    const kids = children.get(current)
    if (!kids || kids.length === 0) {
      return current
    }
    current = kids[0]
  }
  return current
}

function onSelectChild(key: string) {
  updateActiveKey(findLeaf(key))
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
          <n-flex
            align="center"
            :class="item.clickable ? 'cursor-pointer' : 'cursor-default opacity-80'"
          >
            <component :is="item.label" v-if="typeof item.label === 'function'" />
            <span v-else>{{ item.label }}</span>
          </n-flex>
        </n-dropdown>
        <n-flex
          v-else
          align="center"
          :class="item.clickable ? 'cursor-pointer' : 'cursor-default opacity-80'"
        >
          <component :is="item.label" v-if="typeof item.label === 'function'" />
          <span v-else>{{ item.label }}</span>
        </n-flex>
      </n-flex>
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>

<style scoped></style>
