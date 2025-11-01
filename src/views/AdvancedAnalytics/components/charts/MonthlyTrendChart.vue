<template>
  <ChartContainer title="Месячные тренды" :icon="LineChartOutlined" :loading="loading" height="450px">
    <template #actions>
      <a-select v-model:value="monthsCount" style="width: 150px" size="small">
        <a-select-option :value="3">3 месяца</a-select-option>
        <a-select-option :value="6">6 месяцев</a-select-option>
        <a-select-option :value="12">12 месяцев</a-select-option>
      </a-select>
    </template>

    <v-chart :option="chartOption" :autoresize="true" style="height: 100%" />
  </ChartContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { LineChartOutlined } from '@ant-design/icons-vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import ChartContainer from '@/components/shared/ChartContainer.vue'
import { useChartConfig } from '../../composables/useChartConfig'
import type { MonthlyChartData } from '../../composables/useChartConfig'

use([CanvasRenderer, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

interface Props {
  data: MonthlyChartData[]
  loading?: boolean
}

const props = defineProps<Props>()

const monthsCount = ref(6)
const { getLineChartConfig } = useChartConfig()

const chartOption = computed(() => {
  const filteredData = props.data.slice(-monthsCount.value)
  return getLineChartConfig(filteredData).value
})
</script>
