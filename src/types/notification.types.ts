export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}

export interface Notification {
  type: NotificationType
  message: string
  description?: string
  duration?: number
}
