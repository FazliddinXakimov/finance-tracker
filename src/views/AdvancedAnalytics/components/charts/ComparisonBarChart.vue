<template>
  <ChartContainer title="Сравнение доходов и расходов" :icon="BarChartOutlined" :loading="loading" height="400px">
    <v-chart :option="chartOption" :autoresize="true" style="height: 100%" />
  </ChartContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BarChartOutlined } from '@ant-design/icons-vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import ChartContainer from '@/components/shared/ChartContainer.vue'
import { useChartConfig } from '../../composables/useChartConfig'
import type { MonthlyChartData } from '../../composables/useChartConfig'

use([CanvasRenderer, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

interface Props {
  data: MonthlyChartData[]
  loading?: boolean
}

const props = defineProps<Props>()

const { getBarChartConfig } = useChartConfig()

const chartOption = computed(() => getBarChartConfig(props.data).value)
</script>
