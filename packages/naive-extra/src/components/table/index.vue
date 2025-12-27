<script setup lang="ts">
import type { DataTableColumn, DataTableProps, NDataTable, PaginationProps } from 'naive-ui'
import type { Props, Settings } from './props'
import TableSetting from './TableSetting.vue'

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  striped: true,
  hidebar: false
})

const attrs = useAttrs() as Omit<DataTableProps, 'size' | 'striped'>

const settings = ref<Settings>({
  size: props.size,
  striped: props.striped,
  columns: attrs.columns!.map(item => ({
    fixed: false,
    ellipsis: { tooltip: true },
    resizable: true,
    align: 'center',
    ...item
  }))
})

const loading = ref(true)

const list = ref<any[]>([])

const pagination = reactive<PaginationProps>({
  page: 1,
  pageSize: 10,
  prefix({ itemCount }) {
    return `共 ${itemCount} 条`
  },
  showSizePicker: true,
  showQuickJumper: true,
  pageSizes: [10, 20, 50, 100],
  onChange: (page: number) => {
    pagination.page = page
    fetchData()
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    fetchData()
  }
})

const tableRef = ref<InstanceType<typeof NDataTable>>()

const tableProps = computed<DataTableProps>(() => {
  return {
    remote: true,
    renderCell(v: any) {
      return v ?? h(NText, { depth: 3 }, { default: () => '信息缺失' })
    },
    ...attrs
  }
})

const fetchFn = ref(props.fetch)

async function fetchData() {
  loading.value = true
  const res = await fetchFn.value({
    pageNum: pagination.page!,
    pageSize: pagination.pageSize!
  })

  loading.value = false
  list.value = res.list
  pagination.itemCount = res.total
}

onActivated(() => {
  fetchData()
})

onMounted(async () => {
  fetchData()

  // console.log({
  //   tableProps: tableProps.value,
  //   tableRef: tableRef.value,
  //   props,
  //   attrs
  // });
})

function handleExport() {
  tableRef.value?.downloadCsv({ fileName: 'data-table' })
}

// 移除显式接口，避免 dts 类型过深

defineExpose({
  // 获取表格实例
  getTableRef: () => tableRef.value,
  // 刷新
  updateTableData: (isReset = false) => {
    if (isReset) {
      pagination.page = 1
    }
    fetchData()
  },
  setActions<T = Record<string, any>>(columnOption: Partial<DataTableColumn<T>>) {
    settings.value.columns.push({
      title: '操作',
      align: 'center',
      fixed: 'right',
      key: 'action',
      ...columnOption
    })
  },
  // 导出表格
  downloadCsv: (fileName = 'data-table') => tableRef.value?.downloadCsv({ fileName }),
  // 设置列
  setColumns(columns: DataTableColumn[]) {
    settings.value.columns = columns.map((item: any) => ({
      fixed: false,
      ellipsis: { tooltip: true },
      resizable: true,
      align: 'center',
      ...item
    }))
  },
  // 获取列
  getColumns: () => settings.value.columns,
  // 设置尺寸
  setSize: (size: Settings['size']) => { settings.value.size = size },
  // 设置斑马纹
  setStriped: (striped: boolean) => { settings.value.striped = striped },
  // 获取分页
  getPagination: () => ({ ...pagination }),
  // 设置分页（部分）
  setPagination: (patch: Partial<PaginationProps>) => { Object.assign(pagination, patch) },
  // 获取数据
  getData: () => list.value,
  // 设置数据
  setData: (rows: any[]) => { list.value = rows },
  // 设置 fetch 函数
  setFetch: (fn: (pageInfo: { pageNum: number, pageSize: number }) => Promise<{ list: any[], total: number }>) => {
    fetchFn.value = fn
  },
  // 获取与设置设置项
  getSettings: () => settings.value,
  setSettings: (patch: Partial<Settings>) => { settings.value = { ...settings.value, ...patch } }
} as any)
</script>

<template>
  <NFlex vertical class="h-full flex-col-stretch">
    <NFlex v-if="!hidebar" align="center" justify="space-between">
      <div>
        <slot name="left" />
      </div>
      <NFlex align="center">
        <slot name="right" />
        <TableSetting v-if="!hidebar" v-model="settings" @realod="fetchData" @export="handleExport" />
      </NFlex>
    </NFlex>
    <NDataTable
      ref="tableRef"
      v-bind="tableProps"
      flex-height
      :size="settings.size"
      :striped="settings.striped"
      :columns="settings.columns"
      :pagination="pagination"
      :loading="loading"
      :data="list"
      class="flex-1-hidden"
    />
  </NFlex>
</template>

<style lang="scss" scoped></style>
