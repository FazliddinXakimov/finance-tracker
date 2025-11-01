import { computed, type ComputedRef } from 'vue'
import type { MonthlyStats } from '@/types/transaction.types'
import { formatCurrency, formatMonthYear } from '@/utils/formatters'

export const useMonthlyChartConfig = (chartData: ComputedRef<MonthlyStats[]>) => {
  const months = computed(() => chartData.value.map((stat) => formatMonthYear(stat.month)))
  const incomeData = computed(() => chartData.value.map((stat) => stat.income))
  const expenseData = computed(() => chartData.value.map((stat) => stat.expense))
  const balanceData = computed(() => chartData.value.map((stat) => stat.balance))

  const tooltipFormatter = (params: any) => {
    let result = `<div style="font-weight: 600; margin-bottom: 8px;">${params[0].axisValue}</div>`
    params.forEach((param: any) => {
      const color = param.color.colorStops ? param.color.colorStops[0].color : param.color
      result += `
        <div style="display: flex; align-items: center; justify-content: space-between; margin: 4px 0;">
          <span style="display: flex; align-items: center;">
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${color}; margin-right: 8px;"></span>
            ${param.seriesName}
          </span>
          <span style="font-weight: 600; margin-left: 16px;">${formatCurrency(param.value)}</span>
        </div>
      `
    })
    return result
  }

  const yAxisFormatter = (value: number) => {
    return value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
  }

  const chartOption = computed(() => ({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e8e8e8',
      borderWidth: 1,
      padding: 16,
      textStyle: {
        color: '#333',
        fontSize: 14,
      },
      formatter: tooltipFormatter,
    },
    legend: {
      data: ['Доходы', 'Расходы', 'Баланс'],
      top: 0,
      left: 'center',
      itemGap: 30,
      textStyle: {
        fontSize: 14,
        fontWeight: 500,
      },
      icon: 'circle',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: months.value,
      axisLabel: {
        rotate: 45,
        interval: 0,
        fontSize: 12,
        color: '#666',
        fontWeight: 500,
      },
      axisLine: {
        lineStyle: {
          color: '#e8e8e8',
        },
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 12,
        color: '#666',
        formatter: yAxisFormatter,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed',
        },
      },
    },
    series: [
      {
        name: 'Доходы',
        type: 'bar',
        data: incomeData.value,
        barWidth: '20%',
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#52c41a' },
              { offset: 1, color: '#73d13d' },
            ],
          },
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(82, 196, 26, 0.5)',
          },
        },
      },
      {
        name: 'Расходы',
        type: 'bar',
        data: expenseData.value,
        barWidth: '20%',
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#ff4d4f' },
              { offset: 1, color: '#ff7875' },
            ],
          },
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(255, 77, 79, 0.5)',
          },
        },
      },
      {
        name: 'Баланс',
        type: 'line',
        data: balanceData.value,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#1890ff',
          borderWidth: 2,
          borderColor: '#fff',
        },
        lineStyle: {
          width: 3,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#1890ff' },
              { offset: 1, color: '#40a9ff' },
            ],
          },
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(24, 144, 255, 0.2)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
            ],
          },
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(24, 144, 255, 0.5)',
            borderWidth: 3,
          },
        },
      },
    ],
  }))

  return {
    chartOption,
  }
}
