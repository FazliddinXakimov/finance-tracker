import { computed, type Ref } from 'vue'
import { useTransactionStore } from '@/stores/transactionStore'
import { TransactionType, type TransactionCategory } from '@/types/transaction.types'
import { categoryLabels, categoryColors } from '@/utils/categoryConfig'
import { formatMonthYear } from '@/utils/formatters'
import dayjs from 'dayjs'

export function useAdvancedAnalyticsData(monthsToShow: Ref<number>, categoryPeriod: Ref<'month' | 'quarter' | 'all'>) {
  const transactionStore = useTransactionStore()

  const monthlyData = computed(() => {
    const transactions = transactionStore.transactions
    const monthsMap = new Map()

    transactions.forEach((t) => {
      const month = dayjs(t.date).format('YYYY-MM')
      if (!monthsMap.has(month)) {
        monthsMap.set(month, { income: 0, expense: 0, month })
      }
      const data = monthsMap.get(month)
      if (t.type === TransactionType.INCOME) {
        data.income += t.amount
      } else {
        data.expense += t.amount
      }
    })

    return Array.from(monthsMap.values())
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-monthsToShow.value)
  })

  const categoryData = computed(() => {
    const transactions = transactionStore.transactions
    let filteredTransactions = transactions

    if (categoryPeriod.value === 'month') {
      const oneMonthAgo = dayjs().subtract(1, 'month')
      filteredTransactions = transactions.filter((t) => dayjs(t.date).isAfter(oneMonthAgo))
    } else if (categoryPeriod.value === 'quarter') {
      const threeMonthsAgo = dayjs().subtract(3, 'month')
      filteredTransactions = transactions.filter((t) => dayjs(t.date).isAfter(threeMonthsAgo))
    }

    const expenseByCategory = new Map()
    const incomeByCategory = new Map()

    filteredTransactions.forEach((t) => {
      if (t.type === TransactionType.EXPENSE) {
        expenseByCategory.set(t.category, (expenseByCategory.get(t.category) || 0) + t.amount)
      } else {
        incomeByCategory.set(t.category, (incomeByCategory.get(t.category) || 0) + t.amount)
      }
    })

    return {
      expense: Array.from(expenseByCategory.entries()).map(([category, value]) => ({
        name: categoryLabels[category as TransactionCategory],
        value,
        itemStyle: { color: categoryColors[category as TransactionCategory] },
      })),
      income: Array.from(incomeByCategory.entries()).map(([category, value]) => ({
        name: categoryLabels[category as TransactionCategory],
        value,
        itemStyle: { color: categoryColors[category as TransactionCategory] },
      })),
    }
  })

  const statistics = computed(() => {
    const transactions = transactionStore.transactions
    const monthlyStats = monthlyData.value

    const totalIncome = transactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0)
    const totalExpense = transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0)

    const avgIncome = monthlyStats.length > 0 ? totalIncome / monthlyStats.length : 0
    const avgExpense = monthlyStats.length > 0 ? totalExpense / monthlyStats.length : 0

    const bestMonth =
      monthlyStats.length > 0
        ? monthlyStats.reduce((max, curr) => (curr.income - curr.expense > max.income - max.expense ? curr : max))
        : null

    const expenseByCategory = new Map()
    transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .forEach((t) => {
        expenseByCategory.set(t.category, (expenseByCategory.get(t.category) || 0) + t.amount)
      })

    const topExpense =
      expenseByCategory.size > 0
        ? Array.from(expenseByCategory.entries()).reduce((max, curr) => (curr[1] > max[1] ? curr : max))
        : null

    const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0

    return {
      avgIncome,
      avgExpense,
      bestMonth: bestMonth ? formatMonthYear(bestMonth.month) : 'N/A',
      bestMonthAmount: bestMonth ? bestMonth.income - bestMonth.expense : 0,
      topExpenseCategory: topExpense ? categoryLabels[topExpense[0] as TransactionCategory] : 'N/A',
      topExpenseCategoryAmount: topExpense ? topExpense[1] : 0,
      savingsRate,
      totalTransactions: transactions.length,
      monthsTracked: monthlyStats.length,
    }
  })

  const savingsRateClass = computed(() => (statistics.value.savingsRate > 20 ? 'income' : 'expense'))
  const savingsRateLabel = computed(() => (statistics.value.savingsRate > 20 ? 'Отлично' : 'Можно улучшить'))

  return {
    monthlyData,
    categoryData,
    statistics,
    savingsRateClass,
    savingsRateLabel,
  }
}
