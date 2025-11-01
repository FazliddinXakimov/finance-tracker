import { TransactionCategory, TransactionType } from '@/types/transaction.types'

export interface CategoryConfig {
  label: string
  color: string
  icon: string
}

export const categoryLabels = {
  [TransactionCategory.SALARY]: 'Зарплата',
  [TransactionCategory.FREELANCE]: 'Фриланс',
  [TransactionCategory.INVESTMENT]: 'Инвестиции',
  [TransactionCategory.GIFT]: 'Подарок',
  [TransactionCategory.OTHER_INCOME]: 'Другой доход',

  [TransactionCategory.FOOD]: 'Еда',
  [TransactionCategory.TRANSPORT]: 'Транспорт',
  [TransactionCategory.HOUSING]: 'Жилье',
  [TransactionCategory.ENTERTAINMENT]: 'Развлечения',
  [TransactionCategory.HEALTHCARE]: 'Здоровье',
  [TransactionCategory.EDUCATION]: 'Образование',
  [TransactionCategory.SHOPPING]: 'Покупки',
  [TransactionCategory.UTILITIES]: 'Коммунальные услуги',
  [TransactionCategory.OTHER_EXPENSE]: 'Другие расходы',
} as const satisfies Record<TransactionCategory, string>

export const categoryColors = {
  [TransactionCategory.SALARY]: '#52c41a',
  [TransactionCategory.FREELANCE]: '#73d13d',
  [TransactionCategory.INVESTMENT]: '#95de64',
  [TransactionCategory.GIFT]: '#b7eb8f',
  [TransactionCategory.OTHER_INCOME]: '#d9f7be',

  [TransactionCategory.FOOD]: '#ff4d4f',
  [TransactionCategory.TRANSPORT]: '#ff7a45',
  [TransactionCategory.HOUSING]: '#ffa940',
  [TransactionCategory.ENTERTAINMENT]: '#ffc53d',
  [TransactionCategory.HEALTHCARE]: '#fa541c',
  [TransactionCategory.EDUCATION]: '#722ed1',
  [TransactionCategory.SHOPPING]: '#eb2f96',
  [TransactionCategory.UTILITIES]: '#1890ff',
  [TransactionCategory.OTHER_EXPENSE]: '#8c8c8c',
} as const satisfies Record<TransactionCategory, string>

const INCOME_CATEGORIES = [
  TransactionCategory.SALARY,
  TransactionCategory.FREELANCE,
  TransactionCategory.INVESTMENT,
  TransactionCategory.GIFT,
  TransactionCategory.OTHER_INCOME,
] as const

const EXPENSE_CATEGORIES = [
  TransactionCategory.FOOD,
  TransactionCategory.TRANSPORT,
  TransactionCategory.HOUSING,
  TransactionCategory.ENTERTAINMENT,
  TransactionCategory.HEALTHCARE,
  TransactionCategory.EDUCATION,
  TransactionCategory.SHOPPING,
  TransactionCategory.UTILITIES,
  TransactionCategory.OTHER_EXPENSE,
] as const

export const getIncomeCategoriesOptions = (): Array<{ value: TransactionCategory; label: string }> => {
  return INCOME_CATEGORIES.map((cat) => ({
    value: cat,
    label: categoryLabels[cat],
  }))
}

export const getExpenseCategoriesOptions = (): Array<{ value: TransactionCategory; label: string }> => {
  return EXPENSE_CATEGORIES.map((cat) => ({
    value: cat,
    label: categoryLabels[cat],
  }))
}

export const getCategoriesByType = (type: TransactionType): Array<{ value: TransactionCategory; label: string }> => {
  return type === TransactionType.INCOME ? getIncomeCategoriesOptions() : getExpenseCategoriesOptions()
}
