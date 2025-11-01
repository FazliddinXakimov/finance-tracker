import type { Transaction } from '@/types/transaction.types'
import { TransactionType, TransactionCategory } from '@/types/transaction.types'
import dayjs from 'dayjs'

export const generateMockTransactions = (): Transaction[] => {
  const now = dayjs()
  const transactions: Transaction[] = []
  let idCounter = 1

  for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
    const monthDate = now.subtract(monthOffset, 'month')

    transactions.push({
      id: String(idCounter++),
      type: TransactionType.INCOME,
      category: TransactionCategory.SALARY,
      amount: 120000 + Math.random() * 20000,
      date: monthDate.startOf('month').add(5, 'day').toISOString(),
      comment: `Зарплата за ${monthDate.format('MMMM')}`,
      createdAt: monthDate.startOf('month').add(5, 'day').toISOString(),
      updatedAt: monthDate.startOf('month').add(5, 'day').toISOString(),
    })

    const freelanceCount = Math.floor(Math.random() * 3) + 1
    for (let i = 0; i < freelanceCount; i++) {
      transactions.push({
        id: String(idCounter++),
        type: TransactionType.INCOME,
        category: TransactionCategory.FREELANCE,
        amount: 15000 + Math.random() * 50000,
        date: monthDate.add(Math.floor(Math.random() * 28), 'day').toISOString(),
        comment: `Фриланс проект ${i + 1}`,
        createdAt: monthDate.toISOString(),
        updatedAt: monthDate.toISOString(),
      })
    }

    if (Math.random() > 0.3) {
      transactions.push({
        id: String(idCounter++),
        type: TransactionType.INCOME,
        category: TransactionCategory.INVESTMENT,
        amount: 5000 + Math.random() * 15000,
        date: monthDate.add(15, 'day').toISOString(),
        comment: 'Дивиденды',
        createdAt: monthDate.toISOString(),
        updatedAt: monthDate.toISOString(),
      })
    }

    transactions.push({
      id: String(idCounter++),
      type: TransactionType.EXPENSE,
      category: TransactionCategory.HOUSING,
      amount: 35000 + Math.random() * 5000,
      date: monthDate.add(1, 'day').toISOString(),
      comment: 'Аренда квартиры',
      createdAt: monthDate.toISOString(),
      updatedAt: monthDate.toISOString(),
    })

    transactions.push({
      id: String(idCounter++),
      type: TransactionType.EXPENSE,
      category: TransactionCategory.UTILITIES,
      amount: 3000 + Math.random() * 2000,
      date: monthDate.add(10, 'day').toISOString(),
      comment: 'Коммунальные услуги',
      createdAt: monthDate.toISOString(),
      updatedAt: monthDate.toISOString(),
    })

    for (let week = 0; week < 4; week++) {
      transactions.push({
        id: String(idCounter++),
        type: TransactionType.EXPENSE,
        category: TransactionCategory.FOOD,
        amount: 2500 + Math.random() * 3000,
        date: monthDate.add(week * 7 + 2, 'day').toISOString(),
        comment: week === 0 ? 'Продукты в супермаркете' : `Продукты неделя ${week + 1}`,
        createdAt: monthDate.toISOString(),
        updatedAt: monthDate.toISOString(),
      })
    }

    transactions.push({
      id: String(idCounter++),
      type: TransactionType.EXPENSE,
      category: TransactionCategory.TRANSPORT,
      amount: 1500 + Math.random() * 1500,
      date: monthDate.add(3, 'day').toISOString(),
      comment: 'Проездной',
      createdAt: monthDate.toISOString(),
      updatedAt: monthDate.toISOString(),
    })

    const fuelCount = Math.floor(Math.random() * 2) + 2
    for (let i = 0; i < fuelCount; i++) {
      transactions.push({
        id: String(idCounter++),
        type: TransactionType.EXPENSE,
        category: TransactionCategory.TRANSPORT,
        amount: 2000 + Math.random() * 2000,
        date: monthDate.add(i * 10 + 5, 'day').toISOString(),
        comment: 'Бензин',
        createdAt: monthDate.toISOString(),
        updatedAt: monthDate.toISOString(),
      })
    }

    const entertainmentCount = Math.floor(Math.random() * 3) + 2
    for (let i = 0; i < entertainmentCount; i++) {
      transactions.push({
        id: String(idCounter++),
        type: TransactionType.EXPENSE,
        category: TransactionCategory.ENTERTAINMENT,
        amount: 1500 + Math.random() * 5000,
        date: monthDate.add(Math.floor(Math.random() * 28), 'day').toISOString(),
        comment: ['Кино', 'Ресторан', 'Концерт', 'Спортзал'][Math.floor(Math.random() * 4)],
        createdAt: monthDate.toISOString(),
        updatedAt: monthDate.toISOString(),
      })
    }

    const healthcareCount = Math.floor(Math.random() * 3)
    for (let i = 0; i < healthcareCount; i++) {
      transactions.push({
        id: String(idCounter++),
        type: TransactionType.EXPENSE,
        category: TransactionCategory.HEALTHCARE,
        amount: 1000 + Math.random() * 8000,
        date: monthDate.add(Math.floor(Math.random() * 28), 'day').toISOString(),
        comment: ['Аптека', 'Врач', 'Анализы'][Math.floor(Math.random() * 3)],
        createdAt: monthDate.toISOString(),
        updatedAt: monthDate.toISOString(),
      })
    }

    const shoppingCount = Math.floor(Math.random() * 3) + 1
    for (let i = 0; i < shoppingCount; i++) {
      transactions.push({
        id: String(idCounter++),
        type: TransactionType.EXPENSE,
        category: TransactionCategory.SHOPPING,
        amount: 3000 + Math.random() * 12000,
        date: monthDate.add(Math.floor(Math.random() * 28), 'day').toISOString(),
        comment: ['Одежда', 'Электроника', 'Подарки', 'Товары для дома'][Math.floor(Math.random() * 4)],
        createdAt: monthDate.toISOString(),
        updatedAt: monthDate.toISOString(),
      })
    }

    if (Math.random() > 0.6) {
      transactions.push({
        id: String(idCounter++),
        type: TransactionType.EXPENSE,
        category: TransactionCategory.EDUCATION,
        amount: 5000 + Math.random() * 15000,
        date: monthDate.add(Math.floor(Math.random() * 28), 'day').toISOString(),
        comment: ['Онлайн курс', 'Книги', 'Тренинг'][Math.floor(Math.random() * 3)],
        createdAt: monthDate.toISOString(),
        updatedAt: monthDate.toISOString(),
      })
    }
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
