import type { Component } from 'vue'

export type AnalyticsPeriod = 'month' | 'quarter' | 'year' | 'all'

export type ChartKey = 'monthly' | 'categories' | 'comparison' | 'cashflow' | 'stats'

export interface MonthlyData {
  month: string
  income: number
  expense: number
  balance: number
}

export interface CategoryData {
  name: string
  value: number
}

export interface GroupedCategoryData {
  income: CategoryData[]
  expense: CategoryData[]
}

export interface AnalyticsStatistics {
  avgIncome: number
  avgExpense: number

  bestMonth: string
  bestMonthAmount: number
  worstMonth: string
  worstMonthAmount: number

  topIncomeCategory: string
  topIncomeCategoryAmount: number
  topExpenseCategory: string
  topExpenseCategoryAmount: number

  totalTransactions: number
  savingsRate: number
}

export interface ChartType<T extends string = string> {
  key: T
  label: string
  icon: Component
  description?: string
}

export interface PeriodOption {
  value: AnalyticsPeriod
  label: string
}

export interface ChartFilters {
  period: AnalyticsPeriod
  monthsToShow?: number
  chartType?: ChartKey
}

export interface TimeSeriesDataPoint {
  date: string
  value: number
  label?: string
}

export interface ComparisonData {
  category: string
  current: number
  previous: number
  change: number
  changePercent: number
}
