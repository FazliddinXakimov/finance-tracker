import { computed, type Ref } from 'vue'
import { formatCurrency, formatMonthYear } from '@/utils/formatters'
import type { EChartsOption } from 'echarts'

interface MonthlyDataItem {
  month: string
  income: number
  expense: number
}

interface CategoryDataItem {
  name: string
  value: number
  itemStyle: { color: string }
}

export function useChartOptions(
  monthlyData: Ref<MonthlyDataItem[]>,
  categoryData: Ref<{ expense: CategoryDataItem[]; income: CategoryDataItem[] }>
) {
  const monthlyTrendOption = computed<EChartsOption>(() => {
    const months = monthlyData.value.map((d) => formatMonthYear(d.month))
    const income = monthlyData.value.map((d) => d.income)
    const expense = monthlyData.value.map((d) => d.expense)
    const balance = monthlyData.value.map((d) => d.income - d.expense)

    return {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          let result = `<div style="font-weight: 600; margin-bottom: 8px;">${params[0].axisValue}</div>`
          params.forEach((param: any) => {
            result += `
              <div style="display: flex; justify-content: space-between; margin: 4px 0;">
                <span><span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${param.color}; margin-right: 8px;"></span>${param.seriesName}</span>
                <span style="font-weight: 600; margin-left: 16px;">${formatCurrency(param.value)}</span>
              </div>
            `
          })
          return result
        },
      },
      legend: {
        data: ['Доходы', 'Расходы', 'Баланс'],
        top: 0,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '12%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: months,
        axisLabel: { rotate: 45 },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => formatCurrency(value),
        },
      },
      series: [
        {
          name: 'Доходы',
          type: 'bar',
          data: income,
          itemStyle: { color: '#52c41a' },
        },
        {
          name: 'Расходы',
          type: 'bar',
          data: expense,
          itemStyle: { color: '#ff4d4f' },
        },
        {
          name: 'Баланс',
          type: 'line',
          data: balance,
          smooth: false,
          lineStyle: { width: 3 },
          itemStyle: { color: '#1890ff' },
        },
      ],
    }
  })

  const expenseCategoryOption = computed<EChartsOption>(() => ({
    title: {
      text: 'Расходы',
      left: 'center',
      top: 10,
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => `${params.name}: ${formatCurrency(params.value)} (${params.percent}%)`,
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        data: categoryData.value.expense,
        label: {
          formatter: '{b}: {d}%',
        },
      },
    ],
  }))

  const incomeCategoryOption = computed<EChartsOption>(() => ({
    title: {
      text: 'Доходы',
      left: 'center',
      top: 10,
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => `${params.name}: ${formatCurrency(params.value)} (${params.percent}%)`,
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        data: categoryData.value.income,
        label: {
          formatter: '{b}: {d}%',
        },
      },
    ],
  }))

  const comparisonOption = computed<EChartsOption>(() => {
    const months = monthlyData.value.map((d) => formatMonthYear(d.month))
    const income = monthlyData.value.map((d) => d.income)
    const expense = monthlyData.value.map((d) => d.expense)

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      legend: {
        top: '20px',
        data: ['Доходы', 'Расходы'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '12%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => formatCurrency(value),
        },
      },
      yAxis: {
        type: 'category',
        data: months,
      },
      series: [
        {
          name: 'Доходы',
          type: 'bar',
          data: income,
          itemStyle: { color: '#52c41a' },
        },
        {
          name: 'Расходы',
          type: 'bar',
          data: expense,
          itemStyle: { color: '#ff4d4f' },
        },
      ],
    }
  })

  const cashFlowOption = computed<EChartsOption>(() => {
    const data = monthlyData.value
    const months = data.map((d) => formatMonthYear(d.month))
    let cumulativeBalance = 0
    const cumulativeData = data.map((d) => {
      cumulativeBalance += d.income - d.expense
      return cumulativeBalance
    })

    return {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const value = params[0].value
          return `${params[0].axisValue}<br/>Накопительный баланс: ${formatCurrency(value)}`
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '5%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: months,
        axisLabel: { rotate: 45 },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => formatCurrency(value),
        },
      },
      series: [
        {
          name: 'Денежный поток',
          type: 'line',
          data: cumulativeData,
          smooth: false,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
              ],
            },
          },
          lineStyle: { width: 3, color: '#1890ff' },
        },
      ],
    }
  })

  return {
    monthlyTrendOption,
    expenseCategoryOption,
    incomeCategoryOption,
    comparisonOption,
    cashFlowOption,
  }
}
