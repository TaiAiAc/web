import type {
  ConfigProviderProps,
  DialogProviderProps,
  LoadingBarProviderProps,
  MessageProviderProps,
  NotificationProviderProps
} from 'naive-ui'

export interface ProviderProps {
  /**
   * Config Provider Props
   * 透传 NConfigProvider 的所有属性
   */
  configProviderProps?: ConfigProviderProps

  /**
   * Loading Bar Provider Props
   * 透传 NLoadingBarProvider 的所有属性
   */
  loadingBarProviderProps?: LoadingBarProviderProps

  /**
   * Dialog Provider Props
   * 透传 NDialogProvider 的所有属性
   */
  dialogProviderProps?: DialogProviderProps

  /**
   * Notification Provider Props
   * 透传 NNotificationProvider 的所有属性
   */
  notificationProviderProps?: NotificationProviderProps

  /**
   * Message Provider Props
   * 透传 NMessageProvider 的所有属性
   */
  messageProviderProps?: MessageProviderProps
}
