export class StorageError extends Error {
  constructor(
    public readonly operation: 'get' | 'set' | 'remove' | 'clear',
    public readonly key: string,
    message: string,
    public readonly cause?: unknown
  ) {
    super(message)
    this.name = 'StorageError'
    Object.setPrototypeOf(this, StorageError.prototype)
  }
}

export class LocalStorageService {
  private static instance: LocalStorageService | null = null

  private constructor() {}

  static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService()
    }
    return LocalStorageService.instance
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : null
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new StorageError('get', key, `Failed to retrieve item from localStorage: ${message}`, error)
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new StorageError('set', key, `Failed to store item in localStorage: ${message}`, error)
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new StorageError('remove', key, `Failed to remove item from localStorage: ${message}`, error)
    }
  }

  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new StorageError('clear', '', `Failed to clear localStorage: ${message}`, error)
    }
  }
}

export const localStorageService = LocalStorageService.getInstance()
