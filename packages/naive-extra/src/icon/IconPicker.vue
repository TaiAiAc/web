<!-- src/components/IconPicker.vue -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { getAllCollections, getIconNames } from './iconify'

const props = defineProps<{
  modelValue?: string // 格式: "collection:name"
  pageSize?: number // 每页加载数量
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'select', value: string): void
}>()

const searchQuery = ref('')
const selectedCollection = ref<string | 'all'>('all')
const currentPage = ref(1)
const hasMore = ref(true)

const collections = getAllCollections()
const allIcons = ref<{ collection: string, name: string }[]>([])

// 修改 loadPage 函数（替换之前的 loadIcons）
const iconsCache = new Map<string, string[]>() // 缓存各集合图标名

async function loadPage(page: number, reset = false) {
  if (reset) {
    currentPage.value = 1
    allIcons.value = []
  }
  else {
    currentPage.value = page
  }

  const targetCollections = selectedCollection.value === 'all'
    ? collections
    : [selectedCollection.value]

  const allNames: { collection: string, name: string }[] = []

  for (const col of targetCollections) {
    let names = iconsCache.get(col)
    if (!names) {
      names = getIconNames(col)
      iconsCache.set(col, names)
    }
    allNames.push(...names.map(name => ({ collection: col, name })))
  }

  // 全局排序（可选，影响性能）
  // allNames.sort((a, b) => a.name.localeCompare(b.name))

  const pageSize = props.pageSize || 100
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize

  const pageIcons = allNames.slice(start, end)

  if (reset) {
    allIcons.value = pageIcons
  }
  else {
    allIcons.value.push(...pageIcons)
  }

  hasMore.value = end < allNames.length
}

// 搜索过滤（实时）
const filteredIcons = computed(() => {
  let list = allIcons.value
  const query = searchQuery.value.trim().toLowerCase()

  if (query) {
    list = list.filter(
      item =>
        item.name.toLowerCase().includes(query)
        || `${item.collection}:${item.name}`.toLowerCase().includes(query)
    )
  }

  // 分页模拟（实际懒加载可替换为真实分页逻辑）
  const start = 0
  const end = Math.min(currentPage.value * (props.pageSize || 100), list.length)
  return list.slice(start, end)
})

// 滚动到底部加载更多
function handleScroll(event: Event) {
  const el = event.target as HTMLElement
  if (el.scrollHeight - el.scrollTop <= el.clientHeight + 100) {
    if (hasMore.value && !searchQuery.value) {
      currentPage.value++
      // 这里可以加防抖，但简单场景直接加载
      loadPage(currentPage.value)
    }
  }
}

// 选择图标
function selectIcon(collection: string, name: string) {
  const iconId = `${collection}:${name}`
  emit('update:modelValue', iconId)
  emit('select', iconId)
}

onMounted(() => {
  loadPage(1, true)
})
</script>

<template>
  <div class="icon-picker w-full max-w-4xl mx-auto flex flex-col h-[600px] border rounded">
    <!-- 搜索 & 集合筛选 -->
    <div class="p-3 border-b flex gap-2">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索图标 (e.g. home, user)"
        class="flex-1 px-3 py-1 border rounded text-sm"
        @input="currentPage = 1"
      >
      <select
        v-model="selectedCollection"
        class="px-2 py-1 border rounded text-sm"
        @change="loadPage(1, true)"
      >
        <option value="all">
          全部集合
        </option>
        <option v-for="col in collections" :key="col" :value="col">
          {{ col }}
        </option>
      </select>
    </div>

    <!-- 图标网格 -->
    <div
      class="flex-1 overflow-auto p-2 grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-2"
      @scroll="handleScroll"
    >
      <button
        v-for="item in filteredIcons"
        :key="`${item.collection}:${item.name}`"
        class="aspect-square flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
        @click="selectIcon(item.collection, item.name)"
      >
        <Icon
          :icon="`${item.collection}:${item.name}`"
          width="24"
          height="24"
          class="text-current"
        />
      </button>

      <!-- 加载提示 -->
      <div v-if="!filteredIcons.length" class="col-span-full text-center py-8 text-gray-500">
        未找到图标
      </div>
    </div>

    <!-- 当前选中预览 -->
    <div v-if="modelValue" class="p-3 border-t text-sm flex items-center gap-2">
      <span>已选:</span>
      <Icon :icon="modelValue" width="20" height="20" />
      <code class="bg-gray-100 px-2 py-1 rounded">{{ modelValue }}</code>
    </div>
  </div>
</template>

<style scoped>
.icon-picker {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>
