<template>
  <ChartContainer title="Денежный поток" :icon="FundOutlined" :loading="loading" height="400px">
    <v-chart :option="chartOption" :autoresize="true" style="height: 100%" />
  </ChartContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FundOutlined } from '@ant-design/icons-vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import ChartContainer from '@/components/shared/ChartContainer.vue'
import dayjs from 'dayjs'

use([CanvasRenderer, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

interface MonthlyData {
  month: string
  income: number
  expense: number
  balance: number
}

interface Props {
  data: MonthlyData[]
  loading?: boolean
}

const props = defineProps<Props>()

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {
    data: ['Приток', 'Отток', 'Чистый поток'],
    bottom: 0,
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
    data: props.data.map((d) => dayjs(d.month).format('MMM YYYY')),
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value} сум',
    },
  },
  series: [
    {
      name: 'Приток',
      type: 'bar',
      stack: 'total',
      data: props.data.map((d) => d.income),
      itemStyle: {
        color: '#52c41a',
      },
    },
    {
      name: 'Отток',
      type: 'bar',
      stack: 'total',
      data: props.data.map((d) => -d.expense),
      itemStyle: {
        color: '#ff4d4f',
      },
    },
    {
      name: 'Чистый поток',
      type: 'line',
      data: props.data.map((d) => d.balance),
      itemStyle: {
        color: '#1890ff',
      },
      lineStyle: {
        width: 3,
      },
    },
  ],
}))
</script>
