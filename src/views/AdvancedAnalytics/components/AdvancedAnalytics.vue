<template>
  <div class="advanced-analytics">
    <div class="chart-selector">
      <a-button
        v-for="chart in chartTypes"
        :key="chart.key"
        :type="activeChart === chart.key ? 'primary' : 'default'"
        @click="activeChart = chart.key"
        class="chart-btn"
      >
        <component :is="chart.icon" />
        {{ chart.label }}
      </a-button>
    </div>

    <a-spin :spinning="loading">
      <div v-show="activeChart === 'monthly'" class="chart-wrapper">
        <div class="chart-header">
          <h3 class="chart-title">
            <LineChartOutlined />
            Месячные тренды
          </h3>
          <a-select v-model:value="monthsToShow" class="period-select" size="small">
            <a-select-option :value="3">3 месяца</a-select-option>
            <a-select-option :value="6">6 месяцев</a-select-option>
            <a-select-option :value="12">12 месяцев</a-select-option>
          </a-select>
        </div>
        <v-chart :option="monthlyTrendOption" :autoresize="true" class="chart" />
      </div>

      <div v-show="activeChart === 'categories'" class="chart-wrapper">
        <div class="chart-header">
          <h3 class="chart-title">
            <PieChartOutlined />
            Расходы по категориям
          </h3>
          <a-radio-group v-model:value="categoryPeriod" size="small">
            <a-radio-button value="month">Месяц</a-radio-button>
            <a-radio-button value="quarter">Квартал</a-radio-button>
            <a-radio-button value="all">Всё время</a-radio-button>
          </a-radio-group>
        </div>
        <div class="charts-row">
          <div class="chart-col">
            <v-chart :option="expenseCategoryOption" :autoresize="true" class="chart-half" />
          </div>
          <div class="chart-col">
            <v-chart :option="incomeCategoryOption" :autoresize="true" class="chart-half" />
          </div>
        </div>
      </div>

      <div v-show="activeChart === 'comparison'" class="chart-wrapper">
        <div class="chart-header">
          <h3 class="chart-title">
            <BarChartOutlined />
            Сравнение доходов и расходов
          </h3>
        </div>
        <v-chart :option="comparisonOption" :autoresize="true" class="chart" />
      </div>

      <div v-show="activeChart === 'cashflow'" class="chart-wrapper">
        <div class="chart-header">
          <h3 class="chart-title">
            <FundOutlined />
            Денежный поток
          </h3>
        </div>
        <v-chart :option="cashFlowOption" :autoresize="true" class="chart" />
      </div>

      <div v-show="activeChart === 'stats'" class="stats-grid">
        <div class="stat-box">
          <div class="stat-label">Средний доход</div>
          <div class="stat-value income">{{ formatCurrency(statistics.avgIncome) }}</div>
          <div class="stat-trend">в месяц</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Средний расход</div>
          <div class="stat-value expense">{{ formatCurrency(statistics.avgExpense) }}</div>
          <div class="stat-trend">в месяц</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Самый прибыльный месяц</div>
          <div class="stat-value">{{ statistics.bestMonth }}</div>
          <div class="stat-trend">{{ formatCurrency(statistics.bestMonthAmount) }}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Самая большая категория расходов</div>
          <div class="stat-value">{{ statistics.topExpenseCategory }}</div>
          <div class="stat-trend">{{ formatCurrency(statistics.topExpenseCategoryAmount) }}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Коэффициент сбережений</div>
          <div class="stat-value" :class="savingsRateClass">{{ statistics.savingsRate }}%</div>
          <div class="stat-trend">{{ savingsRateLabel }}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Всего транзакций</div>
          <div class="stat-value">{{ statistics.totalTransactions }}</div>
          <div class="stat-trend">за {{ statistics.monthsTracked }} мес.</div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent, DatasetComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { useTransactionStore } from '@/stores/transactionStore'
import { formatCurrency } from '@/utils/formatters'
import { useAdvancedAnalyticsData } from '../composables/useAdvancedAnalyticsData'
import { useChartOptions } from '../composables/useChartOptions'
import {
  LineChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
  FundOutlined,
  DotChartOutlined,
} from '@ant-design/icons-vue'

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
])

const transactionStore = useTransactionStore()
const loading = ref(false)
const activeChart = ref('monthly')
const monthsToShow = ref(6)
const categoryPeriod = ref<'month' | 'quarter' | 'all'>('all')

const chartTypes = [
  { key: 'monthly', label: 'Тренды', icon: LineChartOutlined },
  { key: 'categories', label: 'Категории', icon: PieChartOutlined },
  { key: 'comparison', label: 'Сравнение', icon: BarChartOutlined },
  { key: 'cashflow', label: 'Денежный поток', icon: FundOutlined },
  { key: 'stats', label: 'Статистика', icon: DotChartOutlined },
]

const { monthlyData, categoryData, statistics, savingsRateClass, savingsRateLabel } = useAdvancedAnalyticsData(
  monthsToShow,
  categoryPeriod
)

const { monthlyTrendOption, expenseCategoryOption, incomeCategoryOption, comparisonOption, cashFlowOption } =
  useChartOptions(monthlyData, categoryData)

onMounted(() => {
  transactionStore.fetchTransactions()
})
</script>

<style src="@/assets/styles/advanced-analytics/advanced-analytics.css" scoped></style>
