import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionFilters,
  Balance,
  MonthlyStats,
} from '@/types/transaction.types'
import { transactionService } from '@/services/TransactionService'
import { useNotificationStore } from './notificationStore'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref<Transaction[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<TransactionFilters>({})

  const notificationStore = useNotificationStore()

  const filteredTransactions = computed((): Transaction[] => {
    return transactions.value
  })

  const balance = computed((): Balance => {
    const { totalIncome, totalExpense } = transactions.value.reduce(
      (acc, t) => ({
        totalIncome: acc.totalIncome + (t.type === 'income' ? t.amount : 0),
        totalExpense: acc.totalExpense + (t.type === 'expense' ? t.amount : 0),
      }),
      { totalIncome: 0, totalExpense: 0 }
    )

    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
    }
  })

  const fetchTransactions = async (newFilters?: TransactionFilters): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      if (newFilters) {
        filters.value = newFilters
      }
      transactions.value = await transactionService.getTransactions(filters.value)
    } catch (err) {
      handleError('Ошибка загрузки', 'Failed to fetch transactions', err)
    } finally {
      isLoading.value = false
    }
  }

  const createTransaction = async (dto: CreateTransactionDto): Promise<Transaction> => {
    isLoading.value = true
    error.value = null

    try {
      const newTransaction = await transactionService.createTransaction(dto)
      transactions.value.unshift(newTransaction)
      notificationStore.showSuccess('Транзакция создана', 'Транзакция успешно добавлена')
      return newTransaction
    } catch (err) {
      handleError('Ошибка создания', 'Failed to create transaction', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateTransaction = async (dto: UpdateTransactionDto): Promise<Transaction> => {
    isLoading.value = true
    error.value = null

    try {
      const updated = await transactionService.updateTransaction(dto)
      const index = transactions.value.findIndex((t) => t.id === dto.id)
      if (index !== -1) {
        transactions.value[index] = updated
      }
      notificationStore.showSuccess('Транзакция обновлена', 'Изменения сохранены')
      return updated
    } catch (err) {
      handleError('Ошибка обновления', 'Failed to update transaction', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteTransaction = async (id: string): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      await transactionService.deleteTransaction(id)
      transactions.value = transactions.value.filter((t) => t.id !== id)
      notificationStore.showSuccess('Транзакция удалена', 'Транзакция успешно удалена')
    } catch (err) {
      handleError('Ошибка удаления', 'Failed to delete transaction', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getMonthlyStats = async (): Promise<MonthlyStats[]> => {
    try {
      return await transactionService.getMonthlyStats()
    } catch (err) {
      handleError('Ошибка статистики', 'Failed to get monthly stats', err)
      return []
    }
  }

  const exportData = async (): Promise<void> => {
    try {
      const jsonData = await transactionService.exportToJSON()
      downloadFile(jsonData, 'application/json')
      notificationStore.showSuccess('Экспорт выполнен', 'Данные успешно экспортированы')
    } catch (err) {
      handleError('Ошибка экспорта', 'Failed to export data', err)
    }
  }

  const importData = async (file: File): Promise<void> => {
    try {
      const text = await file.text()
      await transactionService.importFromJSON(text)
      await fetchTransactions()
      notificationStore.showSuccess('Импорт выполнен', 'Данные успешно импортированы')
    } catch (err) {
      handleError('Ошибка импорта', 'Failed to import data', err)
      throw err
    }
  }

  const clearFilters = (): Promise<void> => {
    filters.value = {}
    return fetchTransactions()
  }

  const clearError = (): void => {
    error.value = null
  }

  const handleError = (notificationTitle: string, fallbackMessage: string, err: unknown): void => {
    error.value = err instanceof Error ? err.message : fallbackMessage
    notificationStore.showError(notificationTitle, error.value)
  }

  const downloadFile = (content: string, mimeType: string): void => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    try {
      link.href = url
      link.download = generateExportFilename()
      document.body.appendChild(link)
      link.click()
    } finally {
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  const generateExportFilename = (): string => {
    const dateStr = new Date().toISOString().split('T')[0]
    return `finance-tracker-${dateStr}.json`
  }

  return {
    transactions,
    isLoading,
    error,
    filters,

    filteredTransactions,
    balance,

    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getMonthlyStats,
    exportData,
    importData,
    clearFilters,
    clearError,
  }
})
