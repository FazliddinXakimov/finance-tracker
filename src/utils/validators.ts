import { z } from 'zod'
import { TransactionType, TransactionCategory } from '@/types/transaction.types'

export const transactionSchema = z.object({
  type: z.nativeEnum(TransactionType, {
    message: 'Выберите тип транзакции',
  }),

  category: z.nativeEnum(TransactionCategory, {
    message: 'Выберите категорию',
  }),

  amount: z
    .number({
      message: 'Сумма должна быть числом',
    })
    .positive('Сумма должна быть положительной')
    .min(0.01, 'Минимальная сумма 0.01')
    .max(999999999, 'Максимальная сумма 999,999,999'),

  date: z
    .string({
      message: 'Дата обязательна',
    })
    .min(1, 'Дата обязательна'),

  comment: z.string().max(500, 'Комментарий не должен превышать 500 символов').optional(),
})

export type TransactionFormData = z.infer<typeof transactionSchema>
