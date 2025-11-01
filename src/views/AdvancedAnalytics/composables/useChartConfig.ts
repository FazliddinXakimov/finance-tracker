import { computed, type ComputedRef } from 'vue'
import type { EChartsOption } from 'echarts'
import dayjs from 'dayjs'
import { categoryLabels, categoryColors } from '@/utils/categoryConfig'

export interface MonthlyChartData {
  month: string
  income: number
  expense: number
  balance: number
}

export interface CategoryChartData {
  name: string
  value: number
}

export function useChartConfig() {
  const getLineChartConfig = (data: MonthlyChartData[], monthsToShow?: number): ComputedRef<EChartsOption> => {
    return computed(() => {
      const filteredData = monthsToShow ? data.slice(-monthsToShow) : data

      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
          backgroundColor: 'rgba(50, 50, 50, 0.95)',
          borderColor: '#333',
          textStyle: {
            color: '#fff',
          },
        },
        legend: {
          data: ['Доходы', 'Расходы', 'Баланс'],
          bottom: 0,
          icon: 'circle',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '60px',
          top: '10px',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: filteredData.map((d) => dayjs(d.month).format('MMM YYYY')),
          axisLine: {
            lineStyle: {
              color: '#d9d9d9',
            },
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} сум',
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#f0f0f0',
            },
          },
        },
        series: [
          {
            name: 'Доходы',
            type: 'line',
            data: filteredData.map((d) => d.income),
            smooth: false,
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: '#52c41a',
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
                  { offset: 1, color: 'rgba(82, 196, 26, 0.05)' },
                ],
              },
            },
          },
          {
            name: 'Расходы',
            type: 'line',
            data: filteredData.map((d) => d.expense),
            smooth: false,
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: '#ff4d4f',
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(255, 77, 79, 0.3)' },
                  { offset: 1, color: 'rgba(255, 77, 79, 0.05)' },
                ],
              },
            },
          },
          {
            name: 'Баланс',
            type: 'line',
            data: filteredData.map((d) => d.balance),
            smooth: false,
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: '#1890ff',
            },
          },
        ],
      }
    })
  }

  const getPieChartConfig = (data: CategoryChartData[]): ComputedRef<EChartsOption> => {
    return computed(() => ({
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} сум ({d}%)',
        backgroundColor: 'rgba(50, 50, 50, 0.95)',
        borderColor: '#333',
        textStyle: {
          color: '#fff',
        },
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'center',
        icon: 'circle',
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['60%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          labelLine: {
            show: false,
          },
          data: data.map((item) => ({
            value: item.value,
            name: categoryLabels[item.name as keyof typeof categoryLabels] || item.name,
            itemStyle: {
              color: categoryColors[item.name as keyof typeof categoryColors] || '#8c8c8c',
            },
          })),
        },
      ],
    }))
  }

  const getBarChartConfig = (data: MonthlyChartData[]): ComputedRef<EChartsOption> => {
    return computed(() => ({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        backgroundColor: 'rgba(50, 50, 50, 0.95)',
        borderColor: '#333',
        textStyle: {
          color: '#fff',
        },
      },
      legend: {
        data: ['Доходы', 'Расходы'],
        top: '20px',
        icon: 'roundRect',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '60px',
        top: '10px',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: data.map((d) => dayjs(d.month).format('MMM YYYY')),
        axisLine: {
          lineStyle: {
            color: '#d9d9d9',
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} сум',
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#f0f0f0',
          },
        },
      },
      series: [
        {
          name: 'Доходы',
          type: 'bar',
          data: data.map((d) => d.income),
          itemStyle: {
            color: '#52c41a',
            borderRadius: [4, 4, 0, 0],
          },
          barMaxWidth: 50,
        },
        {
          name: 'Расходы',
          type: 'bar',
          data: data.map((d) => d.expense),
          itemStyle: {
            color: '#ff4d4f',
            borderRadius: [4, 4, 0, 0],
          },
          barMaxWidth: 50,
        },
      ],
    }))
  }

  return {
    getLineChartConfig,
    getPieChartConfig,
    getBarChartConfig,
  }
}
