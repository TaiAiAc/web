import type { DialogApi, LoadingBarApi, MessageApi, NotificationApi } from 'naive-ui'

import { QuiActionButton, QuiBaseButton } from './components/button'
import { QuiForm } from './components/form'
import { QuiIcon, QuiIconPicker } from './components/icon'
import { DEFAULT_LAYOUT_TYPE, QuiLayout, useLayout } from './components/layout'
import { QuiProvider } from './components/provider'
import { QuiSearchBar } from './components/search-bar'
import { QuiTable } from './components/table'

import { AcceptType, QuiUpload, useUploadProps } from './components/upload'
import 'virtual:uno.css'

export {
  QuiActionButton,
  QuiBaseButton,
  QuiForm,
  QuiIcon,
  QuiIconPicker,
  QuiLayout,
  QuiProvider,
  QuiSearchBar,
  QuiTable,
  QuiUpload
}

export {
  AcceptType,
  useUploadProps
}

export {
  useLayout
}

export { DEFAULT_LAYOUT_TYPE }

export type { ActionItem, BaseButtonProps } from './components/button'
export { useForm } from './components/form'
export type { CustomSwitchProps, FormProps, FormSchema } from './components/form'
export type { LayoutProps, LayoutType, RouteMeta } from './components/layout'

export { useBorderRadio, useColorScheme, useLocale, useTheme } from './components/provider'
export type { ProviderProps } from './components/provider'
export type { SearchBarProps } from './components/search-bar'
export { useColumn, useTable } from './components/table'
export type {
  TableColumn,
  TableColumns,
  TableExportType,
  TableFetchFn,
  TableProps,
  TableSettings,
  TableSize
} from './components/table'
export type { UploadProps } from './components/upload'

declare global {
  interface Window {
    $message?: MessageApi
    $dialog?: DialogApi
    $notification?: NotificationApi
    $loadingBar?: LoadingBarApi
  }
}
