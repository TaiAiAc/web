import type { WritableComputedRef } from 'vue'
import { cloneDeep } from 'lodash-es'
import { reactive, ref, toRaw, toRefs } from 'vue'

export function useColumn(data: WritableComputedRef<any[]>) {
  const metaColumns = ref<any[]>([])
  const columnsList = ref<any[]>([])

  const selectCloumn = {
    type: 'selection',
    key: 'selection',
    fixed: 'left'
  }

  const state = reactive({
    selection: false,
    checkAll: true,
    checkList: [] as any[],
    defaultCheckList: [] as any[]
  })

  function init() {
    const checkList: any = data.value.map(item => item.key)
    state.checkList = checkList
    state.defaultCheckList = checkList
    state.selection = Boolean(data.value.find(item => item.type === 'selection'))

    const newColumns = data.value.filter(
      item => !['action', 'selection', 'expand'].includes(item.type) && item.title !== '操作'
    )

    if (!columnsList.value.length) {
      columnsList.value = cloneDeep(newColumns)
      metaColumns.value = cloneDeep(newColumns)
    }
  }

  init()

  function handleCheckAll(flag: boolean) {
    if (flag) {
      state.checkList = columnsList.value.map(item => item.key)
      data.value = metaColumns.value
    }
    else {
      state.checkList = []
      data.value = []
    }

    handleSelection(state.selection)
  }

  function handleSelection(flag: boolean) {
    data.value = data.value.filter(item => item.type !== 'selection')
    if (flag) {
      data.value.unshift(selectCloumn)
    }
  }

  function resetColumns() {
    columnsList.value = metaColumns.value
    data.value = metaColumns.value
    const checkList: any = data.value.map(item => item.key)
    state.checkList = checkList
    state.defaultCheckList = checkList

    handleSelection(state.selection)
  }

  function handleChange() {
    data.value = metaColumns.value.filter(item => state.checkList.includes(item.key))
    handleSelection(state.selection)
  }

  // 拖拽排序
  function draggableEnd() {
    const newColumns = toRaw(columnsList.value)
    columnsList.value = newColumns
    data.value = newColumns
    handleSelection(state.selection)
  }

  function fixedColumn(item: any, type: 'left' | 'right') {
    const row = columnsList.value.find(i => item.key === i.key)
    const finder = data.value.find(i => item.key === i.key)

    const fixed = row.fixed === type ? false : type

    row.fixed = fixed
    finder.fixed = fixed
  }

  return {
    ...toRefs(state),
    init,
    columnsList,
    handleCheckAll,
    handleSelection,
    resetColumns,
    handleChange,
    fixedColumn,
    draggableEnd
  }
}
