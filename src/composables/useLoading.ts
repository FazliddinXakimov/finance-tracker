import { ref, computed } from 'vue'

export interface LoadingState {
  isLoading: boolean
  error: string | null
  message?: string
}

export function useLoading(initialMessage: string = 'Загрузка...') {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const message = ref(initialMessage)

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setError = (err: string | null) => {
    error.value = err
  }

  const setMessage = (msg: string) => {
    message.value = msg
  }

  const clearError = () => {
    error.value = null
  }

  const execute = async <T>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true)
    error.value = null
    try {
      const result = await fn()
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка'
      error.value = errorMessage
      throw err
    } finally {
      setLoading(false)
    }
  }

  const hasError = computed(() => error.value !== null)
  const isIdle = computed(() => !isLoading.value && !hasError.value)

  return {
    isLoading,
    error,
    message,
    hasError,
    isIdle,
    setLoading,
    setError,
    setMessage,
    clearError,
    execute,
  }
}
