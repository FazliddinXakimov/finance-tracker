import { computed } from 'vue'
import type { Transaction } from '@/types/transaction.types'
import dayjs from 'dayjs'

export function useChartData(transactions: any) {
  const monthlyData = computed(() => {
    const grouped = new Map<string, { income: number; expense: number }>()

    transactions.value.forEach((t: Transaction) => {
      const month = dayjs(t.date).format('YYYY-MM')
      const current = grouped.get(month) || { income: 0, expense: 0 }

      if (t.type === 'income') {
        current.income += t.amount
      } else {
        current.expense += t.amount
      }

      grouped.set(month, current)
    })

    return Array.from(grouped.entries())
      .map(([month, data]) => ({
        month,
        ...data,
        balance: data.income - data.expense,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
  })

  const categoryData = computed(() => {
    const income = new Map<string, number>()
    const expense = new Map<string, number>()

    transactions.value.forEach((t: Transaction) => {
      const map = t.type === 'income' ? income : expense
      const current = map.get(t.category) || 0
      map.set(t.category, current + t.amount)
    })

    return {
      income: Array.from(income.entries()).map(([name, value]) => ({ name, value })),
      expense: Array.from(expense.entries()).map(([name, value]) => ({ name, value })),
    }
  })

  const statistics = computed(() => {
    const monthlyStats = monthlyData.value

    const avgIncome = monthlyStats.length
      ? monthlyStats.reduce((sum: number, m: any) => sum + m.income, 0) / monthlyStats.length
      : 0

    const avgExpense = monthlyStats.length
      ? monthlyStats.reduce((sum: number, m: any) => sum + m.expense, 0) / monthlyStats.length
      : 0

    const bestMonth = monthlyStats.length
      ? monthlyStats.reduce((best: any, m: any) => (m.balance > best.balance ? m : best), monthlyStats[0])
      : { month: '', balance: 0 }

    const expenseByCategory = categoryData.value.expense
    const topExpense = expenseByCategory.length
      ? expenseByCategory.reduce((top: any, c: any) => (c.value > top.value ? c : top), expenseByCategory[0])
      : { name: '', value: 0 }

    return {
      avgIncome,
      avgExpense,
      bestMonth: bestMonth.month ? dayjs(bestMonth.month).format('MMMM YYYY') : '-',
      bestMonthAmount: bestMonth.balance,
      topExpenseCategory: topExpense.name,
      topExpenseCategoryAmount: topExpense.value,
    }
  })

  return {
    monthlyData,
    categoryData,
    statistics,
  }
}
