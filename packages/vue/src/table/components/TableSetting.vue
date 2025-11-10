<script setup lang="ts">
import type { ExportType, Settings, TableSize } from '../types'
import { computed } from 'vue'
import Draggable from 'vuedraggable'
import { useColumn } from './useColumn'

const emit = defineEmits<{
  realod: []
  export: [type: ExportType]
}>()
const settings = defineModel<Settings>({ required: true })
const sizeOptions = [
  {
    type: 'menu',
    label: '紧凑',
    key: 'small'
  },
  {
    type: 'menu',
    label: '默认',
    key: 'medium'
  },
  {
    type: 'menu',
    label: '宽松',
    key: 'large'
  }
]

// 密度切换
function selectSize(e: TableSize) {
  settings.value.size = e
}

const exportOptions = [
  {
    label: '导出原始数据',
    key: 'all'
  }
]

function selectExport(e: ExportType) {
  emit('export', e)
}

const data = computed({
  get() {
    return settings.value.columns
  },
  set(columns) {
    settings.value.columns = columns
  }
})

const {
  selection,
  checkAll,
  checkList,
  columnsList,
  handleCheckAll,
  handleSelection,
  resetColumns,
  handleChange,
  fixedColumn,
  draggableEnd
} = useColumn(data)

function onMove(e: any) {
  if (e.draggedContext.element.draggable === false)
    return false
  return true
}
</script>

<template>
  <NFlex :size="0" align="center">
    <NTooltip trigger="hover">
      <template #trigger>
        <NSwitch v-model:value="settings.striped" size="small" />
      </template>
      斑马纹
    </NTooltip>
    <NDivider vertical />
    <NTooltip trigger="hover">
      <template #trigger>
        <NButton text type="info">
          <template #icon>
            <icon-ant-design-reload-outlined class="text-5" @click="emit('realod')" />
          </template>
        </NButton>
      </template>
      刷新
    </NTooltip>
    <NDivider vertical />
    <!-- 密度 -->
    <NTooltip trigger="hover">
      <template #trigger>
        <NFlex align="center">
          <NDropdown v-model:value="settings.size" trigger="click" :options="sizeOptions" @select="selectSize">
            <NButton text type="info">
              <template #icon>
                <icon-mdi-arrow-expand-vertical class="text-5" />
              </template>
            </NButton>
          </NDropdown>
        </NFlex>
      </template>
      <span>密度</span>
    </NTooltip>
    <NDivider vertical />
    <!-- 导出 -->
    <NTooltip trigger="hover">
      <template #trigger>
        <NFlex align="center">
          <NDropdown trigger="click" :options="exportOptions" @select="selectExport">
            <NButton text type="info">
              <template #icon>
                <icon-mdi-file-excel class="text-5" />
              </template>
            </NButton>
          </NDropdown>
        </NFlex>
      </template>
      <span>导出表格</span>
    </NTooltip>
    <NDivider vertical />
    <!-- 列设置 -->
    <NTooltip trigger="hover">
      <template #trigger>
        <NFlex align="center">
          <NPopover trigger="click" :width="240" placement="bottom-end">
            <template #trigger>
              <NButton text type="info">
                <template #icon>
                  <icon-ic-outline-settings class="text-5" />
                </template>
              </NButton>
            </template>
            <template #header>
              <NSpace>
                <NCheckbox v-model:checked="checkAll" @update:checked="handleCheckAll">
                  列展示
                </NCheckbox>
                <NCheckbox v-model:checked="selection" @update:checked="handleSelection">
                  勾选列
                </NCheckbox>
                <NButton text type="info" size="small" class="mt-1" @click="resetColumns">
                  重置
                </NButton>
              </NSpace>
            </template>
            <div class="table-toolbar-inner">
              <NCheckboxGroup v-model:value="checkList" @update:value="handleChange">
                <Draggable
                  v-model="columnsList"
                  animation="300"
                  item-key="key"
                  filter=".no-draggable"
                  :move="onMove"
                  @end="draggableEnd"
                >
                  <template #item="{ element }">
                    <div
                      class="table-toolbar-inner-checkbox"
                      :class="{
                        'no-draggable': element.draggable === false,
                      }"
                    >
                      <span class="drag-icon" :class="{ 'drag-icon-hidden': element.draggable === false }">
                        <icon-nimbus-drag class="text-4" />
                      </span>
                      <NCheckbox :value="element.key" :label="element.title" />
                      <div class="fixed-item">
                        <NTooltip trigger="hover" placement="bottom">
                          <template #trigger>
                            <NButton text>
                              <template #icon>
                                <icon-ph-caret-line-left-bold
                                  class="text-4"
                                  :class="{ 'text-cyan-400 ': element.fixed === 'left' }"
                                  @click="fixedColumn(element, 'left')"
                                />
                              </template>
                            </NButton>
                          </template>
                          <span>固定到左侧</span>
                        </NTooltip>
                        <NDivider vertical />
                        <NTooltip trigger="hover" placement="bottom">
                          <template #trigger>
                            <NButton text>
                              <template #icon>
                                <icon-ph-caret-line-right-bold
                                  class="cursor-pointer text-4"
                                  :class="{ 'text-cyan-400': element.fixed === 'right' }"
                                  @click="fixedColumn(element, 'right')"
                                />
                              </template>
                            </NButton>
                          </template>
                          <span>固定到右侧</span>
                        </NTooltip>
                      </div>
                    </div>
                  </template>
                </Draggable>
              </NCheckboxGroup>
            </div>
          </NPopover>
        </NFlex>
      </template>
      <span>列设置</span>
    </NTooltip>
  </NFlex>
</template>

<style lang="scss" scoped>
.table-toolbar-right-icon {
  margin-left: 12px;
  font-size: 16px;
  color: var(--text-color);
  cursor: pointer;

  :hover {
    color: #1890ff;
  }
}

.table-toolbar-inner {
  .table-toolbar-inner-checkbox {
    display: flex;
    align-items: center;
    padding: 5px;

    &:hover {
      background: var(--n-merged-td-color-hover);
    }

    .drag-icon {
      display: inline-flex;
      margin-right: 8px;
      cursor: move;
      &-hidden {
        visibility: hidden;
        cursor: default;
      }
    }

    .fixed-item {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-left: auto;
    }
  }
}
</style>
