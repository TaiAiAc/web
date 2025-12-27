<script setup lang="ts">
import { getCollections, getIconNames, searchIcons } from './iconify'
import QuiIcon from './index.vue'

const props = defineProps<{
  modelValue?: string // 格式: "collection:name"
  pageSize?: number // 每页加载数量
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'select', value: string): void
}>()

const searchQuery = ref('')
const selectedCollection = ref<string>('mdi')
const currentPage = ref(1)
const hasMore = ref(true)
const loading = ref(false)

const collections = ref<string[]>([])
const allIcons = ref<{ collection: string, name: string }[]>([])
const displayedIcons = ref<{ collection: string, name: string }[]>([])

// 缓存各集合图标名
const iconsCache = new Map<string, string[]>()

const collectionOptions = computed(() => {
  return collections.value.map(col => ({ label: col, value: col }))
})

async function initCollections() {
  const cols = await getCollections()
  collections.value = cols
  if (cols.includes('mdi')) {
    selectedCollection.value = 'mdi'
  }
  else if (cols.length > 0) {
    selectedCollection.value = cols[0]
  }
}

async function loadPage(page: number, reset = false) {
  loading.value = true
  if (reset) {
    currentPage.value = 1
    displayedIcons.value = []
  }
  else {
    currentPage.value = page
  }

  try {
    const query = searchQuery.value.trim().toLowerCase()

    // 如果是搜索模式
    if (query) {
      if (reset) {
        // 执行搜索
        allIcons.value = await searchIcons(query)
      }
    }
    // 如果是浏览模式
    else {
      // 检查缓存
      const currentCol = selectedCollection.value
      let names = iconsCache.get(currentCol)

      if (!names) {
        names = await getIconNames(currentCol)
        iconsCache.set(currentCol, names)
      }

      if (reset) {
        allIcons.value = names.map(name => ({ collection: currentCol, name }))
      }
    }

    // 分页逻辑
    const pageSize = props.pageSize || 100
    const start = (currentPage.value - 1) * pageSize
    const end = start + pageSize

    const pageIcons = allIcons.value.slice(start, end)

    if (reset) {
      displayedIcons.value = pageIcons
    }
    else {
      displayedIcons.value.push(...pageIcons)
    }

    hasMore.value = end < allIcons.value.length
  }
  catch (error) {
    console.error('Failed to load icons:', error)
  }
  finally {
    loading.value = false
  }
}

let searchTimeout: any

function handleSearchInput() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadPage(1, true)
  }, 500)
}

function handleCollectionChange() {
  searchQuery.value = '' // 切换集合时清空搜索
  loadPage(1, true)
}

// 滚动到底部加载更多
function handleScroll(e: Event) {
  const target = e.target as HTMLElement
  if (target.scrollTop + target.clientHeight >= target.scrollHeight - 100) {
    if (hasMore.value && !loading.value) {
      currentPage.value++
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

onMounted(async () => {
  await initCollections()
  loadPage(1, true)
})
</script>

<template>
  <NCard
    class="icon-picker w-full mx-auto h-[600px]"
    content-style="padding: 0; display: flex; flex-direction: column; height: 100%; overflow: hidden;"
    :bordered="true"
  >
    <!-- 搜索 & 集合筛选 -->
    <div class="p-3 border-b border-gray-200 dark:border-gray-700">
      <n-grid :cols="24" :x-gap="12">
        <n-gi :span="16">
          <NInput
            v-model:value="searchQuery"
            placeholder="搜索图标 (e.g. home, user)"
            clearable
            @input="handleSearchInput"
          >
            <template #prefix>
              <QuiIcon icon="carbon:search" class="text-gray-400" />
            </template>
          </NInput>
        </n-gi>
        <n-gi :span="8">
          <NSelect
            v-model:value="selectedCollection"
            :options="collectionOptions"
            filterable
            placeholder="选择集合"
            :disabled="!!searchQuery"
            @update:value="handleCollectionChange"
          />
        </n-gi>
      </n-grid>
    </div>

    <!-- 图标网格 -->
    <div class="flex-1 overflow-hidden relative">
      <NScrollbar
        class="h-full"
        content-class="p-4"
        @scroll="handleScroll"
      >
        <div v-if="displayedIcons.length">
          <n-grid
            cols="8 s:10 m:12 l:16 xl:20"
            responsive="screen"
            :x-gap="8"
            :y-gap="8"
          >
            <n-gi
              v-for="item in displayedIcons"
              :key="`${item.collection}:${item.name}`"
            >
              <NTooltip trigger="hover">
                <template #trigger>
                  <div
                    class="aspect-square flex items-center justify-center rounded cursor-pointer transition-colors border border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
                    :class="{ 'bg-primary-50 text-primary-600 border-primary-200': modelValue === `${item.collection}:${item.name}` }"
                    @click="selectIcon(item.collection, item.name)"
                  >
                    <QuiIcon
                      :icon="`${item.collection}:${item.name}`"
                      size="24"
                    />
                  </div>
                </template>
                {{ item.name }}
              </NTooltip>
            </n-gi>
          </n-grid>
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && !displayedIcons.length" class="h-full flex items-center justify-center min-h-[200px]">
          <NEmpty description="未找到图标" />
        </div>

        <!-- 底部加载中 -->
        <div v-if="loading && displayedIcons.length > 0" class="py-4 flex justify-center w-full">
          <NSpin size="small" />
        </div>
      </NScrollbar>

      <!-- 初始加载遮罩 -->
      <div v-if="loading && displayedIcons.length === 0" class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 z-10">
        <NSpin size="large" />
      </div>
    </div>

    <!-- 当前选中预览 -->
    <div v-if="modelValue" class="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
      <n-flex justify="space-between" align="center">
        <n-flex align="center" :size="8">
          <span class="text-sm text-gray-500">已选:</span>
          <div class="flex items-center gap-2 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
            <QuiIcon :icon="modelValue" size="20" />
            <NText code class="text-sm">
              {{ modelValue }}
            </NText>
          </div>
        </n-flex>

        <NTag size="small" type="success" :bordered="false">
          {{ modelValue.split(':')[0] }}
        </NTag>
      </n-flex>
    </div>
  </NCard>
</template>

<style scoped>
.icon-picker {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>
