<template>
  <div class="analytics-wrapper">
    <div class="analytics-header">
      <h3 class="analytics-title">
        <BarChartOutlined class="title-icon" />
        Месячная аналитика
      </h3>
    </div>

    <a-spin :spinning="loading">
      <div v-if="hasData" class="chart-container">
        <v-chart :option="chartOption" :autoresize="true" class="chart" />
      </div>
      <div v-else class="empty-state">
        <BarChartOutlined class="empty-icon" />
        <p class="empty-text">Нет данных для отображения</p>
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { useTransactionStore } from '@/stores/transactionStore'
import type { MonthlyStats } from '@/types/transaction.types'
import { BarChartOutlined } from '@ant-design/icons-vue'
import { useMonthlyChartConfig } from '../composables/useMonthlyChartConfig'

use([CanvasRenderer, BarChart, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

const transactionStore = useTransactionStore()
const loading = ref(false)
const chartData = ref<MonthlyStats[]>([])

const hasData = computed(() => chartData.value.length > 0)
const { chartOption } = useMonthlyChartConfig(computed(() => chartData.value))

const loadData = async () => {
  loading.value = true
  try {
    chartData.value = await transactionStore.getMonthlyStats()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped src="@/assets/styles/analytics/analytics-chart.css"></style>
