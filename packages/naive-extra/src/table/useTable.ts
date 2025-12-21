import type { DataTableColumn } from 'naive-ui'
import type QuiTable from './index.vue'
import { NImage } from 'naive-ui'
import { h, ref } from 'vue'

interface UseTableReturn<T> {
  tableRef: ReturnType<typeof ref<InstanceType<typeof QuiTable>>>
  refresh: (isReset?: boolean) => void
  downloadCsv: (fileName?: string) => void
  setActions: (columnOption: Partial<DataTableColumn<T>>) => void
  setColumns: (columns: DataTableColumn<T>[]) => void
  getColumns: () => DataTableColumn<T>[] | undefined
  setSize: (size: 'small' | 'medium' | 'large') => void
  setStriped: (striped: boolean) => void
  getPagination: () => any
  setPagination: (patch: Partial<{ page: number, pageSize: number }>) => void
  getData: <TRow = any>() => TRow[] | undefined
  setData: (rows: T[]) => void
  setFetch: (fn: (pageInfo: { pageNum: number, pageSize: number }) => Promise<{ list: T[], total: number }>) => void
  withSearch: (
    getSearchParams: () => Record<string, any>,
    remote: (args: { pageNum: number, pageSize: number } & Record<string, any>) => Promise<{ list: T[], total: number }>
  ) => void
  createImageColumn: (key: keyof T & string, title?: string, width?: number) => DataTableColumn<T>
  createIndexColumn: (title?: string, width?: number) => DataTableColumn<T>
  createTextColumn: (key: keyof T & string, title: string, width?: number) => DataTableColumn<T>
  createMoneyColumn: (key: keyof T & string, title?: string, precision?: number) => DataTableColumn<T>
}
/**
 * 表格辅助函数集合
 *
 * 提供对 `QuiTable` 实例的常用操作封装，以及常用列的构造器。
 * 适合在业务或示例中快速调用刷新、导出、追加操作列等能力。
 *
 * @returns 一组表格操作与便捷列构造器
 *
 * @example
 * ```ts
 * const { tableRef, refresh, downloadCsv, setActions } = useTable()
 * refresh(true)
 * downloadCsv('export')
 * setActions({ title: '操作', render: (row) => h('div', {}, '查看') })
 * ```
 *
 * @remarks
 * - 所有实例方法均基于 `QuiTable` 的 `defineExpose` 能力安全调用
 * - 列构造器仅提供基础构造，仍可按需覆盖属性
 *
 * @security
 * - 导出文件名由调用方决定，请避免包含敏感信息
 *
 * @performance
 * - 方法本身为轻量封装，不引入额外复杂度
 */
export function useTable<T = Record<string, any>>(): UseTableReturn<T> {
  const tableRef = ref<InstanceType<typeof QuiTable>>()

  /**
   * 刷新表格数据
   *
   * @param isReset - 是否重置到第一页
   */
  function refresh(isReset = false) {
    tableRef.value?.updateTableData(isReset)
  }

  /**
   * 导出 CSV
   *
   * @param fileName - 文件名（不含扩展名）
   */
  function downloadCsv(fileName = 'data-table') {
    tableRef.value?.downloadCsv(fileName)
  }

  /**
   * 追加操作列
   *
   * @param columnOption - 操作列的部分配置
   */
  function setActions(columnOption: Partial<DataTableColumn<T>>) {
    tableRef.value?.setActions(columnOption as any)
  }

  /**
   * 设置列集合
   */
  function setColumns(columns: DataTableColumn<T>[]) {
    tableRef.value?.setColumns(columns as any)
  }

  /**
   * 获取当前列集合
   */
  function getColumns(): DataTableColumn<T>[] | undefined {
    return tableRef.value?.getColumns() as any
  }

  /**
   * 设置尺寸
   */
  function setSize(size: 'small' | 'medium' | 'large') {
    tableRef.value?.setSize(size as any)
  }

  /**
   * 设置斑马纹
   */
  function setStriped(striped: boolean) {
    tableRef.value?.setStriped(striped)
  }

  /**
   * 获取分页信息快照
   */
  function getPagination() {
    return tableRef.value?.getPagination()
  }

  /**
   * 局部更新分页信息
   */
  function setPagination(patch: Partial<{ page: number, pageSize: number }>) {
    tableRef.value?.setPagination(patch as any)
  }

  /**
   * 获取当前数据
   */
  function getData<TRow = any>(): TRow[] | undefined {
    return tableRef.value?.getData() as any
  }

  /**
   * 覆盖当前数据行
   */
  function setData(rows: T[]) {
    tableRef.value?.setData(rows as any)
  }

  /**
   * 替换远端 fetch 函数
   */
  function setFetch(
    fn: (pageInfo: { pageNum: number, pageSize: number }) => Promise<{ list: T[], total: number }>
  ) {
    tableRef.value?.setFetch(fn as any)
  }

  /**
   * 绑定外部搜索条件到远端 fetch
   *
   * @param getSearchParams - 返回搜索条件对象的函数
   * @param remote - 实际请求函数，接收合并后的参数
   */
  function withSearch(
    getSearchParams: () => Record<string, any>,
    remote: (args: { pageNum: number, pageSize: number } & Record<string, any>) => Promise<{ list: T[], total: number }>
  ) {
    setFetch(async ({ pageNum, pageSize }) => {
      const params = getSearchParams() || {}
      return remote({ pageNum, pageSize, ...params })
    })
  }

  /**
   * 构造图片列
   *
   * @param key - 数据字段
   * @param title - 列标题
   * @param width - 列宽
   * @returns 图片列配置
   */
  function createImageColumn(key: keyof T & string, title = '图片', width = 80): DataTableColumn<T> {
    return {
      title,
      key,
      width,
      render(row) {
        return h(NImage, { width, src: (row as any)[key] })
      }
    }
  }

  /**
   * 构造序号列
   */
  function createIndexColumn(title = '序号', width = 80): DataTableColumn<T> {
    return {
      title,
      key: '__index__' as any,
      width,
      render(_: any, index: number) {
        return index + 1
      }
    } as any
  }

  /**
   * 构造纯文本列
   */
  function createTextColumn(key: keyof T & string, title: string, width?: number): DataTableColumn<T> {
    return { title, key, width } as any
  }

  /**
   * 金额列
   */
  function createMoneyColumn(key: keyof T & string, title = '金额', precision = 2): DataTableColumn<T> {
    return {
      title,
      key,
      render(row: T) {
        const val = Number((row as any)[key] ?? 0)
        return (val / 100).toFixed(precision)
      }
    } as any
  }

  return {
    tableRef,
    refresh,
    downloadCsv,
    setActions,
    setColumns,
    getColumns,
    setSize,
    setStriped,
    getPagination,
    setPagination,
    getData,
    setData,
    setFetch,
    withSearch,
    createImageColumn,
    createIndexColumn,
    createTextColumn,
    createMoneyColumn
  }
}
