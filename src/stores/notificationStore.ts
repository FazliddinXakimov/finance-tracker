import { defineStore } from 'pinia'
import { notification } from 'ant-design-vue'
import { NotificationType } from '@/types/notification.types'

export const useNotificationStore = defineStore('notification', () => {
  const show = (type: NotificationType, message: string, description?: string, duration = 4.5) => {
    notification[type]({
      message,
      description,
      duration,
    })
  }

  const showSuccess = (message: string, description?: string) => {
    show(NotificationType.SUCCESS, message, description)
  }

  const showError = (message: string, description?: string) => {
    show(NotificationType.ERROR, message, description)
  }

  const showInfo = (message: string, description?: string) => {
    show(NotificationType.INFO, message, description)
  }

  const showWarning = (message: string, description?: string) => {
    show(NotificationType.WARNING, message, description)
  }

  return {
    show,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  }
})
