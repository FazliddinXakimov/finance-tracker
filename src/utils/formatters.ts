import dayjs from 'dayjs'
import 'dayjs/locale/ru'

dayjs.locale('ru')

const DEFAULT_CURRENCY_FORMAT = 'сум' as const
const DEFAULT_DATE_FORMAT = 'DD.MM.YYYY' as const
const DEFAULT_DATETIME_FORMAT = 'DD.MM.YYYY HH:mm' as const
const MONTH_YEAR_FORMAT = 'MMMM YYYY' as const
const MONTH_KEY_FORMAT = 'YYYY-MM' as const

export const formatCurrency = (amount: number): string => {
  if (!Number.isFinite(amount)) {
    return `0 ${DEFAULT_CURRENCY_FORMAT}`
  }

  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

  return `${formatted} ${DEFAULT_CURRENCY_FORMAT}`
}

export const formatDate = (date: string | Date, format: string = DEFAULT_DATE_FORMAT): string => {
  return dayjs(date).format(format)
}

export const formatDateTime = (date: string | Date): string => {
  return dayjs(date).format(DEFAULT_DATETIME_FORMAT)
}

export const formatMonthYear = (date: string): string => {
  return dayjs(date).format(MONTH_YEAR_FORMAT)
}

export const getMonthKey = (date: string | Date): string => {
  return dayjs(date).format(MONTH_KEY_FORMAT)
}

export const parseDate = (date: string | Date): Date => {
  return dayjs(date).toDate()
}
