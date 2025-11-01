import { ref } from 'vue'

export type Period = 'month' | 'quarter' | 'year' | 'all'

export interface PeriodOption {
  value: Period
  label: string
}

export function usePeriodFilter(defaultPeriod: Period = 'all') {
  const selectedPeriod = ref<Period>(defaultPeriod)

  const periodOptions: PeriodOption[] = [
    { value: 'month', label: 'Месяц' },
    { value: 'quarter', label: 'Квартал' },
    { value: 'year', label: 'Год' },
    { value: 'all', label: 'Всё время' },
  ]

  const setPeriod = (period: Period) => {
    selectedPeriod.value = period
  }

  return {
    selectedPeriod,
    periodOptions,
    setPeriod,
  }
}
