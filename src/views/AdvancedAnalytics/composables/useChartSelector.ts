import { ref, type Ref } from 'vue'
import type { Component } from 'vue'

export interface ChartType<T extends string = string> {
  key: T
  label: string
  icon: Component
  description?: string
}

export function useChartSelector<T extends string>(charts: ChartType<T>[], defaultChart?: T) {
  const initialChart = defaultChart || (charts[0]?.key as T)
  const activeChart = ref<T>(initialChart) as Ref<T>

  const selectChart = (key: T) => {
    activeChart.value = key
  }

  const isActive = (key: T): boolean => {
    return activeChart.value === key
  }

  const getActiveChart = () => {
    return charts.find((chart) => chart.key === activeChart.value)
  }

  return {
    activeChart,
    selectChart,
    isActive,
    getActiveChart,
    charts,
  }
}
