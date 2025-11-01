import type {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionFilters,
  Balance,
  MonthlyStats,
} from '@/types/transaction.types'
import { TransactionType } from '@/types/transaction.types'
import { RepositoryError, transactionRepository } from './TransactionRepository'
import dayjs from 'dayjs'

const MINIMUM_AMOUNT = 0 as const
const JSON_INDENT = 2 as const

export class ServiceError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message)
    this.name = 'ServiceError'
    Object.setPrototypeOf(this, ServiceError.prototype)
  }
}

export class TransactionService {
  private static instance: TransactionService | null = null

  private constructor() {}

  static getInstance(): TransactionService {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService()
    }
    return TransactionService.instance
  }

  async getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
    try {
      const transactions = await transactionRepository.findAll()
      return filters ? this.applyFilters(transactions, filters) : this.sortByDate(transactions)
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw error
      }
      throw new ServiceError('Failed to retrieve transactions', error)
    }
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    return transactionRepository.findById(id)
  }

  async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
    this.validateAmount(dto.amount)
    try {
      return await transactionRepository.create(dto)
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw error
      }
      throw new ServiceError('Failed to create transaction', error)
    }
  }

  async updateTransaction(dto: UpdateTransactionDto): Promise<Transaction> {
    if (dto.amount !== undefined) {
      this.validateAmount(dto.amount)
    }
    try {
      return await transactionRepository.update(dto)
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw error
      }
      throw new ServiceError('Failed to update transaction', error)
    }
  }

  async deleteTransaction(id: string): Promise<void> {
    return transactionRepository.delete(id)
  }

  async calculateBalance(): Promise<Balance> {
    const transactions = await transactionRepository.findAll()
    return this.computeBalance(transactions)
  }

  async getMonthlyStats(): Promise<MonthlyStats[]> {
    const transactions = await transactionRepository.findAll()
    return this.computeMonthlyStats(transactions)
  }

  async exportToJSON(): Promise<string> {
    try {
      const transactions = await transactionRepository.exportData()
      return JSON.stringify(transactions, null, JSON_INDENT)
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw error
      }
      throw new ServiceError('Failed to export transactions', error)
    }
  }

  async importFromJSON(jsonString: string): Promise<void> {
    try {
      const data = this.parseJSON(jsonString)

      if (!Array.isArray(data)) {
        throw new ServiceError('Invalid import format: expected an array of transactions')
      }

      this.validateImportData(data)
      await transactionRepository.importData(data)
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error
      }
      throw new ServiceError('Failed to import transactions', error)
    }
  }

  private applyFilters(transactions: Transaction[], filters: TransactionFilters): Transaction[] {
    let filtered = transactions

    if (filters.type) {
      filtered = filtered.filter((t) => t.type === filters.type)
    }

    if (filters.category) {
      filtered = filtered.filter((t) => t.category === filters.category)
    }

    if (filters.dateFrom) {
      filtered = this.filterByDateFrom(filtered, filters.dateFrom)
    }

    if (filters.dateTo) {
      filtered = this.filterByDateTo(filtered, filters.dateTo)
    }

    if (filters.search) {
      filtered = this.filterBySearch(filtered, filters.search)
    }

    return this.sortByDate(filtered)
  }

  private filterByDateFrom(transactions: Transaction[], dateFrom: string | Date): Transaction[] {
    const fromDate = dayjs(dateFrom).startOf('day')
    return transactions.filter((t) => dayjs(t.date).isAfter(fromDate.subtract(1, 'day')))
  }

  private filterByDateTo(transactions: Transaction[], dateTo: string | Date): Transaction[] {
    const toDate = dayjs(dateTo).endOf('day')
    return transactions.filter((t) => dayjs(t.date).isBefore(toDate.add(1, 'day')))
  }

  private filterBySearch(transactions: Transaction[], search: string): Transaction[] {
    const searchLower = search.toLowerCase()
    return transactions.filter((t) => t.comment?.toLowerCase().includes(searchLower))
  }

  private sortByDate(transactions: Transaction[]): Transaction[] {
    return [...transactions].sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
  }

  private computeBalance(transactions: Transaction[]): Balance {
    const { income, expense } = this.aggregateByType(transactions)
    return {
      totalIncome: income,
      totalExpense: expense,
      netBalance: income - expense,
    }
  }

  private aggregateByType(transactions: Transaction[]): { income: number; expense: number } {
    return transactions.reduce(
      (acc, t) => ({
        income: acc.income + (t.type === TransactionType.INCOME ? t.amount : 0),
        expense: acc.expense + (t.type === TransactionType.EXPENSE ? t.amount : 0),
      }),
      { income: 0, expense: 0 }
    )
  }

  private computeMonthlyStats(transactions: Transaction[]): MonthlyStats[] {
    const monthlyMap = this.groupByMonth(transactions)
    return this.convertToMonthlyStats(monthlyMap)
  }

  private groupByMonth(transactions: Transaction[]): Map<string, { income: number; expense: number }> {
    const monthlyMap = new Map<string, { income: number; expense: number }>()

    for (const transaction of transactions) {
      const monthKey = dayjs(transaction.date).format('YYYY-MM')
      const current = monthlyMap.get(monthKey) ?? { income: 0, expense: 0 }

      if (transaction.type === TransactionType.INCOME) {
        current.income += transaction.amount
      } else {
        current.expense += transaction.amount
      }

      monthlyMap.set(monthKey, current)
    }

    return monthlyMap
  }

  private convertToMonthlyStats(monthlyMap: Map<string, { income: number; expense: number }>): MonthlyStats[] {
    return Array.from(monthlyMap.entries())
      .map(([month, { income, expense }]) => ({
        month,
        income,
        expense,
        balance: income - expense,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
  }

  private validateAmount(amount: number): void {
    if (amount <= MINIMUM_AMOUNT) {
      throw new ServiceError(`Amount must be greater than ${MINIMUM_AMOUNT}`)
    }
  }

  private parseJSON(jsonString: string): unknown {
    try {
      return JSON.parse(jsonString)
    } catch (error) {
      throw new ServiceError('Invalid JSON format', error)
    }
  }

  private validateImportData(data: unknown[]): void {
    const isValid = data.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'id' in item &&
        'type' in item &&
        'category' in item &&
        'amount' in item &&
        'date' in item &&
        typeof (item as Record<string, unknown>).amount === 'number'
    )

    if (!isValid) {
      throw new ServiceError('Invalid transaction data structure in import')
    }
  }
}

export const transactionService = TransactionService.getInstance()
