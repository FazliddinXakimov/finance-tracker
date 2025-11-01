<template>
  <div class="statistics-grid">
    <DataCard
      title="Средний доход"
      :value="formatCurrency(statistics.avgIncome)"
      variant="success"
      subtitle="в месяц"
      :icon="RiseOutlined"
      hoverable
    />

    <DataCard
      title="Средний расход"
      :value="formatCurrency(statistics.avgExpense)"
      variant="danger"
      subtitle="в месяц"
      :icon="FallOutlined"
      hoverable
    />

    <DataCard
      title="Самый прибыльный месяц"
      :value="statistics.bestMonth"
      variant="info"
      :subtitle="formatCurrency(statistics.bestMonthAmount)"
      :icon="TrophyOutlined"
      hoverable
    />

    <DataCard
      title="Самая большая категория расходов"
      :value="statistics.topExpenseCategory"
      variant="warning"
      :subtitle="formatCurrency(statistics.topExpenseCategoryAmount)"
      :icon="FireOutlined"
      hoverable
    />
  </div>
</template>

<script setup lang="ts">
import { RiseOutlined, FallOutlined, TrophyOutlined, FireOutlined } from '@ant-design/icons-vue'
import DataCard from '@/components/shared/DataCard.vue'
import { formatCurrency } from '@/utils/formatters'

interface Statistics {
  avgIncome: number
  avgExpense: number
  bestMonth: string
  bestMonthAmount: number
  topExpenseCategory: string
  topExpenseCategoryAmount: number
}

interface Props {
  statistics: Statistics
}

defineProps<Props>()
</script>

<style scoped>
.statistics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .statistics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
