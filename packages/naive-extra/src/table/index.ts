import QuiTable from './index.vue'
import { useColumn } from './useColumn'

export { QuiTable, useColumn }

export type {
  Column as TableColumn,
  Columns as TableColumns,
  ExportType as TableExportType,
  FetchFn as TableFetchFn,
  Props as TableProps,
  Settings as TableSettings,
  TableSize
} from './props'
