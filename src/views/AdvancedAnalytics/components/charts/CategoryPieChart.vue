<template>
  <ChartContainer :title="title" :icon="PieChartOutlined" :loading="loading" height="400px">
    <v-chart :option="chartOption" :autoresize="true" style="height: 100%" />
  </ChartContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PieChartOutlined } from '@ant-design/icons-vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import ChartContainer from '@/components/shared/ChartContainer.vue'
import { useChartConfig } from '../../composables/useChartConfig'
import type { CategoryChartData } from '../../composables/useChartConfig'

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent])

interface Props {
  data: CategoryChartData[]
  title?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Категории',
})

const { getPieChartConfig } = useChartConfig()

const chartOption = computed(() => getPieChartConfig(props.data).value)
</script>
