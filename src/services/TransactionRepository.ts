import type { Transaction, CreateTransactionDto, UpdateTransactionDto } from '@/types/transaction.types'
import { StorageError, localStorageService } from './LocalStorageService'

const STORAGE_KEY = 'finance_tracker_transactions' as const
const ARTIFICIAL_DELAY_MS = 100 as const

export class RepositoryError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message)
    this.name = 'RepositoryError'
    Object.setPrototypeOf(this, RepositoryError.prototype)
  }
}

export class TransactionRepository {
  private static instance: TransactionRepository | null = null

  private constructor() {
    this.initializeStorage()
  }

  static getInstance(): TransactionRepository {
    if (!TransactionRepository.instance) {
      TransactionRepository.instance = new TransactionRepository()
    }
    return TransactionRepository.instance
  }

  private initializeStorage(): void {
    try {
      const existing = localStorageService.get<Transaction[]>(STORAGE_KEY)
      if (!existing) {
        localStorageService.set<Transaction[]>(STORAGE_KEY, [])
      }
    } catch (error) {
      if (error instanceof StorageError) {
        throw new RepositoryError(`Failed to initialize storage: ${error.message}`, error)
      }
      throw error
    }
  }

  async findAll(): Promise<Transaction[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const transactions = localStorageService.get<Transaction[]>(STORAGE_KEY) ?? []
          resolve(transactions)
        } catch (error) {
          reject(new RepositoryError('Failed to retrieve all transactions', error))
        }
      }, ARTIFICIAL_DELAY_MS)
    })
  }

  async findById(id: string): Promise<Transaction | null> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const transactions = localStorageService.get<Transaction[]>(STORAGE_KEY) ?? []
          const transaction = transactions.find((t) => t.id === id) ?? null
          resolve(transaction)
        } catch (error) {
          reject(new RepositoryError(`Failed to retrieve transaction with id: ${id}`, error))
        }
      }, ARTIFICIAL_DELAY_MS)
    })
  }

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const transactions = localStorageService.get<Transaction[]>(STORAGE_KEY) ?? []
          const now = new Date().toISOString()

          const newTransaction: Transaction = {
            id: this.generateId(),
            ...dto,
            createdAt: now,
            updatedAt: now,
          }

          transactions.push(newTransaction)
          localStorageService.set(STORAGE_KEY, transactions)
          resolve(newTransaction)
        } catch (error) {
          reject(new RepositoryError('Failed to create transaction', error))
        }
      }, ARTIFICIAL_DELAY_MS)
    })
  }

  async update(dto: UpdateTransactionDto): Promise<Transaction> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const transactions = localStorageService.get<Transaction[]>(STORAGE_KEY) ?? []
          const index = transactions.findIndex((t) => t.id === dto.id)

          if (index === -1) {
            reject(new RepositoryError(`Transaction not found: ${dto.id}`))
            return
          }

          const existing = transactions[index]!
          const updatedTransaction: Transaction = {
            id: existing.id,
            type: dto.type ?? existing.type,
            category: dto.category ?? existing.category,
            amount: dto.amount ?? existing.amount,
            date: dto.date ?? existing.date,
            comment: dto.comment !== undefined ? dto.comment : existing.comment,
            createdAt: existing.createdAt,
            updatedAt: new Date().toISOString(),
          }

          transactions[index] = updatedTransaction
          localStorageService.set(STORAGE_KEY, transactions)
          resolve(updatedTransaction)
        } catch (error) {
          if (error instanceof RepositoryError) {
            reject(error)
          } else {
            reject(new RepositoryError(`Failed to update transaction: ${dto.id}`, error))
          }
        }
      }, ARTIFICIAL_DELAY_MS)
    })
  }

  async delete(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const transactions = localStorageService.get<Transaction[]>(STORAGE_KEY) ?? []
          const filtered = transactions.filter((t) => t.id !== id)

          if (filtered.length === transactions.length) {
            reject(new RepositoryError(`Transaction not found: ${id}`))
            return
          }

          localStorageService.set(STORAGE_KEY, filtered)
          resolve()
        } catch (error) {
          reject(new RepositoryError(`Failed to delete transaction: ${id}`, error))
        }
      }, ARTIFICIAL_DELAY_MS)
    })
  }

  async exportData(): Promise<Transaction[]> {
    return this.findAll()
  }

  async importData(transactions: Transaction[]): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (!Array.isArray(transactions)) {
            reject(new RepositoryError('Invalid import data: expected an array'))
            return
          }

          localStorageService.set(STORAGE_KEY, transactions)
          resolve()
        } catch (error) {
          reject(new RepositoryError('Failed to import transactions', error))
        }
      }, ARTIFICIAL_DELAY_MS)
    })
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
  }
}

export const transactionRepository = TransactionRepository.getInstance()
