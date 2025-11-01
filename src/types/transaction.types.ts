export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum TransactionCategory {
  SALARY = 'salary',
  FREELANCE = 'freelance',
  INVESTMENT = 'investment',
  GIFT = 'gift',
  OTHER_INCOME = 'other_income',

  FOOD = 'food',
  TRANSPORT = 'transport',
  HOUSING = 'housing',
  ENTERTAINMENT = 'entertainment',
  HEALTHCARE = 'healthcare',
  EDUCATION = 'education',
  SHOPPING = 'shopping',
  UTILITIES = 'utilities',
  OTHER_EXPENSE = 'other_expense',
}

export interface Transaction {
  id: string
  type: TransactionType
  category: TransactionCategory
  amount: number
  date: string
  comment?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTransactionDto {
  type: TransactionType
  category: TransactionCategory
  amount: number
  date: string
  comment?: string
}

export interface UpdateTransactionDto {
  id: string
  type?: TransactionType
  category?: TransactionCategory
  amount?: number
  date?: string
  comment?: string
}

export interface TransactionFilters {
  type?: TransactionType
  category?: TransactionCategory
  dateFrom?: string
  dateTo?: string
  search?: string
}

export interface Balance {
  totalIncome: number
  totalExpense: number
  netBalance: number
}

export interface MonthlyStats {
  month: string
  income: number
  expense: number
  balance: number
}
